import { Promotion, ProductVariant } from "../models/index.js";
import { sendOrderStatusEmail } from "./emailService.js";
import { Op } from "sequelize";
import crypto from "crypto";
import querystring from "qs";
import moment from "moment";
import { loadEnv } from "../config/env.js";
import {
    findCartWithItems,
    findShippingAddress,
    createOrderRecord,
    bulkCreateOrderItems,
    createPaymentRecord,
    clearCartItems,
    findOrdersForUser,
    findOrderForUser,
    findAllOrders,
    findOrderWithRelations
} from "../repositories/orderRepository.js";
import { withTransaction } from "../utils/transactions.js";

const env = loadEnv();

// === CẤU HÌNH ===
const SHOP_PROVINCE_ID = parseInt(env.SHOP_PROVINCE_ID || "1", 10);
const SHOP_CITY_NAME = env.SHOP_CITY || "Hà Nội";

/**
 * Hàm tính phí ship cơ bản (Theo địa chỉ)
 */
const calculateFeeLogic = (addressData, subtotal) => {
    // 1. Mặc định > 1tr Free Ship (Logic cứng của Shop)
    if (subtotal >= 1000000) {
        return { fee: 0, note: "Miễn phí vận chuyển (Đơn > 1tr)" };
    }

    let fee = 50000; // Mặc định: Ngoại tỉnh
    let isInnerCity = false;

    // So sánh địa chỉ (Ưu tiên ID)
    if (addressData.province_id) {
        if (Number(addressData.province_id) === SHOP_PROVINCE_ID) isInnerCity = true;
    } else if (addressData.city) {
        if (addressData.city.toLowerCase().includes(SHOP_CITY_NAME.toLowerCase())) isInnerCity = true;
    }

    if (isInnerCity) {
        return { fee: 30000, note: "Phí ship nội thành" };
    }
    return { fee: 50000, note: "Phí ship ngoại thành" };
};

/**
 * LOGIC TÍNH MÃ GIẢM GIÁ (SỬA CHUẨN THEO DB)
 * @param {string} promotionCode 
 * @param {number} subtotal 
 * @param {number} shippingFee 
 */
const calculateDiscount = async (promotionCode, subtotal, shippingFee) => {
    if (!promotionCode) return { amount: 0, code: null, id: null, type: null };

    // 1. Tìm mã trong DB
    const promotion = await Promotion.findOne({
        where: {
            code: promotionCode,
            start_date: { [Op.lte]: new Date() },
            end_date: { [Op.gte]: new Date() },
            usage_limit: { [Op.gt]: 0 }
        }
    });

    if (!promotion) {
        throw new Error(`Mã "${promotionCode}" không hợp lệ hoặc đã hết hạn.`);
    }

    // 2. Xác định phạm vi áp dụng (Dựa vào cột applicable_to)
    let baseAmount = 0; // Số tiền gốc để tính giảm giá
    let maxDiscount = 0; // Mức giảm tối đa (không được âm tiền)

    if (promotion.applicable_to === 'shipping') {
        // Áp dụng cho Phí Ship
        baseAmount = shippingFee;
        maxDiscount = shippingFee;
    } else {
        // Áp dụng cho Đơn hàng (applicable_to = 'order' hoặc null)
        baseAmount = subtotal;
        maxDiscount = subtotal;
    }

    // 3. Tính giá trị giảm (Dựa vào discount_type và discount_value)
    let discountAmount = 0;

    if (promotion.discount_type === 'percentage') {
        // Giảm theo %
        discountAmount = baseAmount * (parseFloat(promotion.discount_value) / 100);
    } else {
        // Giảm tiền mặt (fixed)
        discountAmount = parseFloat(promotion.discount_value);
    }

    // 4. Chốt số tiền giảm (Không vượt quá số tiền gốc)
    if (discountAmount > maxDiscount) {
        discountAmount = maxDiscount;
    }

    // Làm tròn
    discountAmount = Math.round(discountAmount);

    return {
        amount: discountAmount,
        code: promotion.code,
        id: promotion.id,
        applicable_to: promotion.applicable_to // Trả về để biết nó giảm vào đâu
    };
};

/**
 * Tạo URL VNPay (Giữ nguyên)
 */
const createVnPayUrl = (orderId, amount, ipAddr = '127.0.0.1') => {
    const tmnCode = (env.VNP_TMN_CODE || "").trim();
    const secretKey = (env.VNP_HASH_SECRET || "").trim();
    const vnpUrl = (env.VNP_URL || "").trim();
    const returnUrl = (env.VNP_RETURN_URL || "").trim();

    const date = new Date();
    const createDate = moment(date).format("YYYYMMDDHHmmss");
    const vnpTxnRef = `${orderId}_${moment(date).format("HHmmss")}`;

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = 'vn';
    vnp_Params['vnp_CurrCode'] = 'VND';
    vnp_Params['vnp_TxnRef'] = vnpTxnRef;
    vnp_Params['vnp_OrderInfo'] = `Thanh toan don hang #${orderId}`;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = Math.round(amount * 100);
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;

    let sorted = {};
    let str = [];
    for (let key in vnp_Params) {
        if (vnp_Params.hasOwnProperty(key)) str.push(encodeURIComponent(key));
    }
    str.sort();
    for (let key of str) {
        sorted[key] = encodeURIComponent(vnp_Params[key]).replace(/%20/g, "+");
    }

    const signData = querystring.stringify(sorted, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    sorted['vnp_SecureHash'] = signed;

    return `${vnpUrl}?${querystring.stringify(sorted, { encode: false })}`;
};

// === CÁC SERVICE EXPORT ===

// 1. Xem trước chi phí (Preview)
export const previewShippingFee = async (userId, locationData, promotionCode) => {
    const cart = await findCartWithItems(userId);

    let subtotal = 0;
    if (cart && cart.cart_items) {
        for (const item of cart.cart_items) {
            const variant = item.product_variant;
            if (variant && variant.product) {
                const price = parseFloat(variant.product.base_price) + parseFloat(variant.price_adjustment);
                subtotal += price * item.quantity;
            }
        }
    }

    // Tính Ship gốc
    const { fee: initialShippingFee, note: shippingNote } = calculateFeeLogic(locationData, subtotal);

    // Tính Mã Giảm Giá
    let discountInfo = { amount: 0, code: null, applicable_to: null };
    let discountError = null;

    try {
        discountInfo = await calculateDiscount(promotionCode, subtotal, initialShippingFee);
    } catch (error) {
        discountError = error.message;
    }

    // Logic cộng trừ tổng tiền
    // Nếu giảm ship -> Trừ vào ship fee (nhưng không âm)
    // Nếu giảm order -> Trừ thẳng vào tổng
    // Công thức chung: Total = Subtotal + Ship - Discount

    const total = subtotal + initialShippingFee - discountInfo.amount;

    return {
        subtotal: subtotal,
        shippingFee: initialShippingFee,
        shippingNote: shippingNote,
        discountAmount: discountInfo.amount, // Tổng tiền được giảm
        discountType: discountInfo.applicable_to, // 'shipping' hoặc 'order'
        promotionCode: discountInfo.code,
        promotionError: discountError,
        total: total < 0 ? 0 : total
    };
};

// 2. Tạo đơn hàng (Checkout)
export const createOrder = async (userId, shippingAddressId, paymentMethod, notes, promotionCode) => {
    const validMethods = ['COD', 'VNPAY'];
    if (!validMethods.includes(paymentMethod.toUpperCase())) {
        throw new Error("Phương thức thanh toán không hợp lệ");
    }

    const address = await findShippingAddress(userId, shippingAddressId);
    if (!address) throw new Error("Địa chỉ giao hàng không tồn tại");

    const cart = await findCartWithItems(userId);

    if (!cart || !cart.cart_items.length) throw new Error("Giỏ hàng trống");

    const result = await withTransaction(async (transaction) => {
        let subtotal = 0;
        const orderItemsData = [];

        for (const item of cart.cart_items) {
            const variant = item.product_variant;
            if (!variant || !variant.product) continue;
            if (variant.stock_quantity < item.quantity) throw new Error(`Sản phẩm "${variant.product.name}" hết hàng.`);

            const unitPrice = parseFloat(variant.product.base_price) + parseFloat(variant.price_adjustment);
            const lineTotal = unitPrice * item.quantity;
            subtotal += lineTotal;

            orderItemsData.push({
                product_id: variant.product_id,
                product_variant_id: variant.id,
                name_snapshot: variant.product.name,
                sku_snapshot: variant.sku,
                color_snapshot: variant.color,
                size_snapshot: variant.size,
                unit_price: unitPrice,
                quantity: item.quantity,
                line_total: lineTotal
            });

            await variant.decrement('stock_quantity', { by: item.quantity, transaction });
        }

        // Tính toán tiền
        const { fee: shippingFee } = calculateFeeLogic(address, subtotal);

        const discountInfo = await calculateDiscount(promotionCode, subtotal, shippingFee);

        // Trừ lượt dùng mã
        if (discountInfo.id) {
            await Promotion.decrement('usage_limit', {
                by: 1,
                where: { id: discountInfo.id },
                transaction: t
            });
        }

        let totalAmount = subtotal + shippingFee - discountInfo.amount;
        if (totalAmount < 0) totalAmount = 0;

        // Note thông tin giảm giá
        let promoNote = "";
        if (discountInfo.code) {
            promoNote = ` | Mã ${discountInfo.code}: -${discountInfo.amount}đ (${discountInfo.applicable_to})`;
        }
        const finalNotes = (notes ? notes : "") + ` | Ship: ${shippingFee}đ` + promoNote;

        // Tạo Order
        const newOrder = await createOrderRecord({
            user_id: userId,
            shipping_address_id: shippingAddressId,
            subtotal_amount: subtotal,
            discount_amount: discountInfo.amount, // Lưu số tiền giảm
            promotion_code: discountInfo.code,
            total_amount: totalAmount,
            status: 'pending',
            notes: finalNotes,
        }, transaction);

        const itemsWithOrderId = orderItemsData.map(item => ({ ...item, order_id: newOrder.id }));
        await bulkCreateOrderItems(itemsWithOrderId, transaction);

        // Thanh toán
        let paymentUrl = null;
        let paymentStatus = 'pending';
        if (paymentMethod.toUpperCase() === 'VNPAY') {
            paymentStatus = 'waiting_gateway';
            paymentUrl = createVnPayUrl(newOrder.id, totalAmount);
        }

        await createPaymentRecord({
            order_id: newOrder.id,
            provider: paymentMethod.toUpperCase(),
            amount: totalAmount,
            currency: 'VND',
            status: paymentStatus,
            raw_payload: paymentUrl ? { paymentUrl } : null
        }, transaction);

        await clearCartItems(cart.id, transaction);

        return {
            order: newOrder,
            paymentUrl: paymentUrl,
            financials: { subtotal, shippingFee, discountAmount: discountInfo.amount, totalAmount }
        };
    });

    return result;
};
// ... (Các import giữ nguyên)

/**
 * 3. Hủy đơn hàng (User tự hủy)
 */
export const cancelOrder = async (userId, orderId) => {
    const order = await findOrderForUser(userId, orderId);

    if (!order) {
        throw new Error("Đơn hàng không tồn tại");
    }

    if (order.status !== 'pending') {
        throw new Error("Không thể hủy đơn hàng này (Đã được xác nhận hoặc đang giao).");
    }

    await withTransaction(async (transaction) => {
        // 1. Đổi trạng thái
        order.status = 'canceled';
        await order.save({ transaction });

        // 2. Hoàn lại tồn kho (Back stock)
        if (order.OrderItems) {
            for (const item of order.OrderItems) {
                const variant = await ProductVariant.findByPk(item.product_variant_id);
                if (variant) {
                    await variant.increment('stock_quantity', {
                        by: item.quantity,
                        transaction
                    });
                }
            }
        }
    });

    return order;
};

export const getUserOrders = async (userId) => findOrdersForUser(userId);

export const getOrderById = async (userId, orderId) => {
    const order = await findOrderForUser(userId, orderId);
    if (!order) throw new Error("Đơn hàng không tìm thấy");
    return order;
};

/**
 * Admin: Lấy danh sách toàn bộ đơn hàng
 */
export const getAllOrdersAdmin = async () => findAllOrders();

/**
 * Admin: Cập nhật trạng thái đơn hàng
 */
export const updateOrderStatusAdmin = async (orderId, newStatus) => {
    const validStatuses = ['pending', 'confirmed', 'shipping', 'completed', 'canceled'];
    if (!validStatuses.includes(newStatus)) {
        throw new Error("Trạng thái không hợp lệ");
    }

    const order = await findOrderWithRelations(orderId);

    if (!order) {
        throw new Error("Đơn hàng không tồn tại");
    }

    if (order.status === newStatus) return order;

    // LOGIC HOÀN KHO: Nếu Admin HỦY đơn
    if (newStatus === 'canceled' && order.status !== 'canceled') {
        await withTransaction(async (transaction) => {
            const items = order.OrderItems;

            if (items) {
                for (const item of items) {
                    const variant = await ProductVariant.findByPk(item.product_variant_id);
                    if (variant) {
                        await variant.increment('stock_quantity', { by: item.quantity, transaction });
                    }
                }
            }

            order.status = newStatus;
            await order.save({ transaction });
        });
    } else {
        order.status = newStatus;
        await order.save();
    }

    // GỬI EMAIL THÔNG BÁO
    if (order.User && order.User.email) {
        sendOrderStatusEmail(order.User.email, order.id, newStatus);
    }

    return order;
};