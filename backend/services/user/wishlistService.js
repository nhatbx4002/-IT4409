import { Wishlist, Product, ProductVariant } from "../../models/index.js";

// Thêm mới
export const addWishlist = async (userId, productId) => {
  try {
    const newItem = await Wishlist.create({
      user_id: userId,
      product_id: productId
    });
    return newItem;
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new Error('Sản phẩm này đã có trong danh sách yêu thích');
    }
    throw error;
  }
};

// Lấy danh sách (Kèm thông tin sản phẩm)
export const getWishlist = async (userId) => {
  const list = await Wishlist.findAll({
    where: { user_id: userId },
    include: [
      {
        model: Product,
        as: 'product',
        attributes: ['id', 'name', 'brand', 'base_price', 'sale_price', 'description', 'images', 'tags', 'is_new'],
        where: { status: 'active' },
        include: [
          {
            model: ProductVariant,
            as: 'variants',
            attributes: ['id', 'color', 'size', 'stock_quantity'],
            required: false
          }
        ]
      }
    ],
    order: [['createdAt', 'DESC']]
  });
  return list;
};

// Xóa
export const removeWishlist = async (userId, productId) => {
  const deletedCount = await Wishlist.destroy({
    where: {
      user_id: userId,
      product_id: productId
    }
  });
  return deletedCount;
};

export const toggleWishlist = async (userId, productId) => {
  const existingItem = await Wishlist.findOne({
    where: { user_id: userId, product_id: productId }
  });

  if (existingItem) {
    await existingItem.destroy();
    return { action: 'removed' };
  }

  const newItem = await Wishlist.create({
    user_id: userId,
    product_id: productId
  });

  return { action: 'added', data: newItem };
};

export const checkWishlistStatus = async (userId, productId) => {
  const existingItem = await Wishlist.findOne({
    where: { user_id: userId, product_id: productId }
  });

  return { inWishlist: Boolean(existingItem) };
};
