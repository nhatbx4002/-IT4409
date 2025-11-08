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
 * 1. Thêm sản phẩm vào giỏ hàng
 */
export const addProductToCart = async (
    userId,
    productVariantId,
    quantity
) => {
    // --- Validations ---
    if (!productVariantId) {
        throw new Error("Vui lòng chọn sản phẩm");
    }
    const addQuantity = parseInt(quantity, 10);
    if (isNaN(addQuantity) || addQuantity <= 0) {
        throw new Error("Số lượng phải là một số dương");
    }

    // --- Tìm giỏ hàng & sản phẩm ---
    const cart = await getOrCreateCart(userId);
    const variant = await ProductVariant.findByPk(productVariantId);

    if (!variant) {
        throw new Error("Sản phẩm không tồn tại");
    }

    // --- Xử lý logic (trong 1 transaction) ---
    const result = await sequelize.transaction(async (t) => {
        // Kiểm tra xem item đã có trong giỏ chưa
        let cartItem = await CartItem.findOne({
            where: {
                cart_id: cart.id,
                product_variant_id: productVariantId,
            },
            transaction: t,
        });

        let newQuantity;
        if (cartItem) {
            // Đã có -> Cập nhật số lượng
            newQuantity = cartItem.quantity + addQuantity;
            cartItem.quantity = newQuantity;
        } else {
            // Chưa có -> Tạo mới
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

        // Kiểm tra tồn kho
        if (newQuantity > variant.stock_quantity) {
            throw new Error(
                `Số lượng trong kho không đủ (Chỉ còn ${variant.stock_quantity} sản phẩm)`
            );
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
    const newQuantity = parseInt(quantity, 10);
    if (isNaN(newQuantity) || newQuantity < 0) {
        throw new Error("Số lượng không hợp lệ");
    }

    // Nếu số lượng là 0, gọi hàm xóa
    if (newQuantity === 0) {
        return await removeItemFromCart(userId, cartItemId);
    }

    // --- Tìm giỏ hàng & item ---
    const cart = await getOrCreateCart(userId);
    const cartItem = await CartItem.findByPk(cartItemId);

    if (!cartItem) {
        throw new Error("Sản phẩm không có trong giỏ hàng");
    }
    // --- Security check: Đảm bảo item này thuộc giỏ hàng của user ---
    if (cartItem.cart_id !== cart.id) {
        throw new Error("Bạn không có quyền cập nhật sản phẩm này");
    }

    // --- Kiểm tra tồn kho ---
    const variant = await ProductVariant.findByPk(cartItem.product_variant_id);
    if (!variant) {
        // Nếu sản phẩm đã bị xóa, cũng xóa nó khỏi giỏ
        await cartItem.destroy();
        throw new Error(
            "Sản phẩm không còn tồn tại và đã được xóa khỏi giỏ hàng"
        );
    }

    if (newQuantity > variant.stock_quantity) {
        throw new Error(
            `Số lượng trong kho không đủ (Chỉ còn ${variant.stock_quantity} sản phẩm)`
        );
    }

    // --- Cập nhật ---
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
        throw new Error("Sản phẩm không có trong giỏ hàng");
    }
    // --- Security check: Đảm bảo item này thuộc giỏ hàng của user ---
    if (cartItem.cart_id !== cart.id) {
        throw new Error("Bạn không có quyền xóa sản phẩm này");
    }

    // --- Xóa ---
    await cartItem.destroy();
    return { message: "Đã xóa sản phẩm khỏi giỏ hàng" };
};

/**
 * 4. Lấy chi tiết giỏ hàng và tính tổng tiền
 */
export const getCartDetails = async (userId) => {
    const cart = await getOrCreateCart(userId);

    // Lấy tất cả item trong giỏ, đồng thời lấy thông tin của
    // ProductVariant (biến thể) và Product (sản phẩm gốc)
    const cartItems = await CartItem.findAll({
        where: { cart_id: cart.id },
        include: [
            {
                model: ProductVariant,
                as: "product_variant", // (Yêu cầu 'as' trong models/index.js)
                include: [
                    {
                        model: Product,
                        as: "product", // (Yêu cầu 'as' trong models/index.js)
                    },
                ],
            },
        ],
        order: [["added_at", "DESC"]], // Sắp xếp theo ngày thêm
    });

    let subtotal_amount = 0;
    let items = [];

    for (const item of cartItems) {
        const variant = item.product_variant;
        // Nếu vì lý do nào đó sản phẩm/biến thể không còn, bỏ qua
        if (!variant || !variant.product) {
            continue;
        }

        const product = variant.product;

        // Tính giá cuối cùng của 1 sản phẩm
        // (Giá gốc + điều chỉnh giá của biến thể)
        const final_price =
            parseFloat(product.base_price) +
            parseFloat(variant.price_adjustment);

        // Tính tổng tiền của dòng này
        const line_total = final_price * item.quantity;

        // Cộng dồn vào tổng tạm tính
        subtotal_amount += line_total;

        // Thêm vào mảng items để trả về
        items.push({
            cart_item_id: item.id,
            quantity: item.quantity,
            product_variant_id: variant.id,
            sku: variant.sku,
            product_name: product.name,
            color: variant.color,
            size: variant.size,
            image_url: variant.image_url, // Ảnh của biến thể
            unit_price: final_price,
            line_total: line_total,
            stock_quantity: variant.stock_quantity, // Gửi về để frontend kiểm tra
        });
    }

    // === 4. TÍNH TỔNG GIÁ TẠM TÍNH (áp dụng khuyến mãi) ===
    const activePromotion = await Promotion.findOne({
        where: {
            start_date: { [Op.lte]: new Date() }, // Bắt đầu <= hôm nay
            end_date: { [Op.gte]: new Date() }, // Kết thúc >= hôm nay
        },
        // Tạm lấy cái đầu tiên
    });

    let discount_amount = 0;
    if (activePromotion) {
        if (activePromotion.discount_type === "percentage") {
            discount_amount =
                subtotal_amount * (parseFloat(activePromotion.discount_value) / 100);
        } else if (activePromotion.discount_type === "fixed") {
            discount_amount = parseFloat(activePromotion.discount_value);
        }
    }

    // Đảm bảo giảm giá không lớn hơn tổng tiền
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