import { Promotion, Product } from "../models/index.js";
import { Op } from "sequelize";

// 1. [PUBLIC] Lấy Flash Sale (Đang chạy, không cần mã)
export const getActivePromotions = async () => {
  const now = new Date();
  return await Promotion.findAll({
    where: {
      is_active: true,
      code: null, // Code null là flash sale tự động
      start_date: { [Op.lte]: now },
      end_date: { [Op.gte]: now },
    },
    order: [['end_date', 'ASC']]
  });
};

// 2. [PUBLIC] Tính toán giảm giá (Khi user nhập mã)
export const calculateDiscount = async (code, cartItems) => {
  const now = new Date();
  
  // A. Tìm mã trong DB
  const promo = await Promotion.findOne({
    where: {
      code: code,
      is_active: true,
      start_date: { [Op.lte]: now },
      end_date: { [Op.gte]: now }
    }
  });

  if (!promo) throw new Error("Mã giảm giá không hợp lệ hoặc đã hết hạn");
  if (promo.usage_count >= promo.usage_limit) throw new Error("Mã này đã hết lượt sử dụng");

  // B. Tính toán trên giỏ hàng
  let cartTotal = 0;      // Tổng tiền giỏ
  let eligibleTotal = 0;  // Tổng tiền các món được giảm
  const targetIds = promo.target_ids || [];

  for (const item of cartItems) {
    const product = await Product.findByPk(item.product_id);
    if (!product) continue;
    
    const itemTotal = parseFloat(product.base_price) * item.quantity;
    cartTotal += itemTotal;

    // Logic kiểm tra điều kiện (Brand/Category)
    let isMatch = false;
    if (promo.applicable_to === 'all') isMatch = true;
    
    // So sánh Brand (Lưu ý: Trong Product bạn lưu brand là String "Nike")
    if (promo.applicable_to === 'brand' && targetIds.includes(product.brand)) isMatch = true;
    
    // Nếu bạn có category_id thì check thêm ở đây
    // if (promo.applicable_to === 'category' && targetIds.includes(product.category_id)) isMatch = true;

    if (isMatch) eligibleTotal += itemTotal;
  }

  // C. Kiểm tra điều kiện đơn hàng
  if (cartTotal < parseFloat(promo.min_order_value)) {
    throw new Error(`Đơn hàng phải tối thiểu ${promo.min_order_value} để áp dụng`);
  }
  if (eligibleTotal === 0) {
    throw new Error("Mã này không áp dụng cho sản phẩm nào trong giỏ của bạn");
  }

  // D. Tính tiền giảm
  let discount = 0;
  if (promo.discount_type === 'fixed_amount') {
    discount = parseFloat(promo.discount_value);
  } else {
    // Giảm %
    discount = (eligibleTotal * parseFloat(promo.discount_value)) / 100;
    // Kiểm tra trần giảm giá (Max Discount)
    if (promo.max_discount_amount && discount > parseFloat(promo.max_discount_amount)) {
      discount = parseFloat(promo.max_discount_amount);
    }
  }

  // Không giảm quá tổng tiền
  if (discount > cartTotal) discount = cartTotal;

  return { 
    promo_code: code, 
    discount_amount: discount, 
    final_total: cartTotal - discount,
    message: "Áp dụng mã thành công!" 
  };
};

// 3. [ADMIN] Tạo khuyến mãi
export const createPromotion = async (data) => {
  return await Promotion.create(data);
};

// 4. [ADMIN] Xóa khuyến mãi
export const deletePromotion = async (id) => {
  return await Promotion.destroy({ where: { id } });
};