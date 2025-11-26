import {
    Cart,
    CartItem,
    Product,
    ProductVariant,
    Promotion,
    sequelize, // Dùng cho transactions (đảm bảo an toàn dữ liệu)
} from "../models/index.js";
import { Op } from "sequelize";

/**
 * Hàm nội bộ: Tìm giỏ hàng của user, nếu chưa có thì tạo mới
 */
const getOrCreateCart = async (userId) => {
    const [cart] = await Cart.findOrCreate({
        where: { user_id: userId },
        defaults: { user_id: userId },
    });
    return cart;
};

/**
 * Parse số nguyên cho quantity, đảm bảo là số nguyên không âm/dương theo cấu hình
 */
const parseIntegerQuantity = (value, options = {}) => {
    const { allowZero = false } = options;
    const num = Number(value);

    if (!Number.isInteger(num)) {
        const err = new Error("Số lượng phải là số nguyên");
        err.statusCode = 400;
        throw err;
    }

    if (allowZero) {
        if (num < 0) {
            const err = new Error("Số lượng không được nhỏ hơn 0");
            err.statusCode = 400;
            throw err;
        }
    } else if (num <= 0) {
        const err = new Error("Số lượng phải là một số nguyên dương");
        err.statusCode = 400;
        throw err;
    }

    return num;
};

/**
 * Parse số thập phân an toàn cho các field giá/khuyến mãi
 */
const parseDecimal = (value, fieldName, options = {}) => {
    const { defaultValue } = options;

    if (value === null || value === undefined || value === "") {
        if (defaultValue !== undefined) {
            return defaultValue;
        }
        const err = new Error(`${fieldName} đang không hợp lệ`);
        err.statusCode = 500;
        throw err;
    }

    const num = Number(value);

    if (!Number.isFinite(num)) {
        const err = new Error(`${fieldName} đang không hợp lệ`);
        err.statusCode = 500;
        throw err;
    }

    return num;
};

/**
 * 1. Thêm sản phẩm vào giỏ hàng
 */
export const addProductToCart = async (
    userId,
    productVariantId,
    quantity
) => {
    if (!productVariantId) {
        const err = new Error("Vui lòng chọn sản phẩm");
        err.statusCode = 400;
        throw err;
    }

    const addQuantity = parseIntegerQuantity(quantity);

    const cart = await getOrCreateCart(userId);

    const result = await sequelize.transaction(async (t) => {
        const variant = await ProductVariant.findByPk(productVariantId, {
            transaction: t,
            lock: t.LOCK.UPDATE,
        });

        if (!variant) {
            const err = new Error("Sản phẩm không tồn tại");
            err.statusCode = 404;
            throw err;
        }

        let cartItem = await CartItem.findOne({
            where: {
                cart_id: cart.id,
                product_variant_id: productVariantId,
            },
            transaction: t,
        });

        let newQuantity;
        if (cartItem) {
            newQuantity = cartItem.quantity + addQuantity;
            cartItem.quantity = newQuantity;
        } else {
            newQuantity = addQuantity;
            cartItem = await CartItem.create(
                {
                    cart_id: cart.id,
                    product_variant_id: productVariantId,
                    quantity: newQuantity,
                },
                { transaction: t }
            );
        }

        if (newQuantity > variant.stock_quantity) {
            const err = new Error(
                `Số lượng trong kho không đủ (Chỉ còn ${variant.stock_quantity} sản phẩm)`
            );
            err.statusCode = 400;
            throw err;
        }

        await cartItem.save({ transaction: t });
        return cartItem;
    });

    return result;
};

/**
 * 2. Cập nhật số lượng sản phẩm trong giỏ
 */
export const updateItemQuantity = async (userId, cartItemId, quantity) => {
    const newQuantity = parseIntegerQuantity(quantity, { allowZero: true });

    if (newQuantity === 0) {
        return await removeItemFromCart(userId, cartItemId);
    }

    const cart = await getOrCreateCart(userId);
    const cartItem = await CartItem.findByPk(cartItemId);

    if (!cartItem) {
        const err = new Error("Sản phẩm không có trong giỏ hàng");
        err.statusCode = 404;
        throw err;
    }

    if (cartItem.cart_id !== cart.id) {
        const err = new Error("Bạn không có quyền cập nhật sản phẩm này");
        err.statusCode = 403;
        throw err;
    }

    const variant = await ProductVariant.findByPk(cartItem.product_variant_id);
    if (!variant) {
        await cartItem.destroy();
        const err = new Error(
            "Sản phẩm không còn tồn tại và đã được xóa khỏi giỏ hàng"
        );
        err.statusCode = 404;
        throw err;
    }

    if (newQuantity > variant.stock_quantity) {
        const err = new Error(
            `Số lượng trong kho không đủ (Chỉ còn ${variant.stock_quantity} sản phẩm)`
        );
        err.statusCode = 400;
        throw err;
    }

    cartItem.quantity = newQuantity;
    await cartItem.save();
    return cartItem;
};

/**
 * 3. Xóa sản phẩm khỏi giỏ
 */
export const removeItemFromCart = async (userId, cartItemId) => {
    const cart = await getOrCreateCart(userId);
    const cartItem = await CartItem.findByPk(cartItemId);

    if (!cartItem) {
        const err = new Error("Sản phẩm không có trong giỏ hàng");
        err.statusCode = 404;
        throw err;
    }

    if (cartItem.cart_id !== cart.id) {
        const err = new Error("Bạn không có quyền xóa sản phẩm này");
        err.statusCode = 403;
        throw err;
    }

    await cartItem.destroy();
    return { message: "Đã xóa sản phẩm khỏi giỏ hàng" };
};

/**
 * 4. Lấy chi tiết giỏ hàng và tính tổng tiền
 */
export const getCartDetails = async (userId) => {
    const cart = await getOrCreateCart(userId);

    const cartItems = await CartItem.findAll({
        where: { cart_id: cart.id },
        include: [
            {
                model: ProductVariant,
                as: "product_variant",
                include: [
                    {
                        model: Product,
                        as: "product",
                    },
                ],
            },
        ],
        order: [["added_at", "DESC"]],
    });

    let subtotal_amount = 0;
    const items = [];

    for (const item of cartItems) {
        const variant = item.product_variant;
        if (!variant || !variant.product) {
            continue;
        }

        const product = variant.product;

        const basePrice = parseDecimal(product.base_price, "Giá sản phẩm");
        const adjustment = parseDecimal(
            variant.price_adjustment ?? 0,
            "Điều chỉnh giá biến thể",
            { defaultValue: 0 }
        );

        const final_price = basePrice + adjustment;

        const line_total = final_price * item.quantity;

        subtotal_amount += line_total;

        items.push({
            cart_item_id: item.id,
            quantity: item.quantity,
            product_variant_id: variant.id,
            sku: variant.sku,
            product_name: product.name,
            color: variant.color,
            size: variant.size,
            image_url: variant.image_url,
            unit_price: final_price,
            line_total: line_total,
            stock_quantity: variant.stock_quantity,
        });
    }

    const activePromotion = await Promotion.findOne({
        where: {
            start_date: { [Op.lte]: new Date() },
            end_date: { [Op.gte]: new Date() },
        },
    });

    let discount_amount = 0;

    if (activePromotion) {
        const discountValue = parseDecimal(
            activePromotion.discount_value,
            "Giá trị khuyến mãi"
        );

        if (activePromotion.discount_type === "percentage") {
            const percentage = Math.min(Math.max(discountValue, 0), 100);
            discount_amount = subtotal_amount * (percentage / 100);
        } else if (activePromotion.discount_type === "fixed") {
            discount_amount = discountValue;
        }
    }

    if (discount_amount > subtotal_amount) {
        discount_amount = subtotal_amount;
    }

    const total_amount = subtotal_amount - discount_amount;

    return {
        id: cart.id,
        user_id: cart.user_id,
        items: items,
        subtotal_amount: subtotal_amount,
        discount_amount: discount_amount,
        total_amount: total_amount,
        applied_promotion_code: activePromotion ? activePromotion.code : null,
    };
};