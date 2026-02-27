import { fn, col } from "sequelize";
import { Product, Review, User, Order, OrderItem } from "../../models/index.js";
import { buildPagination } from "./product/queryBuilder.js";

const buildUserName = (user) => {
  if (!user) return "Anonymous";
  return user.name || user.email || "Anonymous";
};

export const listProductReviews = async ({ productId, page = 1, pageSize = 6 }) => {
  const product = await Product.findByPk(productId, { attributes: ["id"] });
  if (!product) {
    throw new Error("Product not found");
  }

  const { limit, offset, page: safePage, pageSize: safePageSize } =
    buildPagination(page, pageSize);

  const { rows, count } = await Review.findAndCountAll({
    where: { product_id: productId },
    include: [
      {
        model: User,
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["created_at", "DESC"]],
    limit,
    offset,
  });

  const ratingRows = await Review.findAll({
    attributes: ["rating", [fn("COUNT", col("rating")), "count"]],
    where: { product_id: productId },
    group: ["rating"],
    raw: true,
  });

  const avgRow = await Review.findAll({
    attributes: [[fn("AVG", col("rating")), "avg_rating"]],
    where: { product_id: productId },
    raw: true,
  });

  const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratingRows.forEach((row) => {
    const rating = Number(row.rating);
    if (ratingCounts[rating] !== undefined) {
      ratingCounts[rating] = Number(row.count) || 0;
    }
  });

  const averageRating = avgRow[0]?.avg_rating
    ? Number(avgRow[0].avg_rating)
    : 0;

  const reviews = rows.map((review) => {
    const data = review.toJSON ? review.toJSON() : review;
    return {
      id: data.id,
      rating: data.rating,
      comment: data.comment,
      images: Array.isArray(data.images) ? data.images : [],
      createdAt: data.created_at,
      user: {
        id: data.user?.id || null,
        name: buildUserName(data.user),
      },
    };
  });

  return {
    reviews,
    total: count,
    page: safePage,
    pageSize: safePageSize,
    totalPages: Math.ceil(count / safePageSize),
    ratingStats: {
      averageRating,
      counts: ratingCounts,
    },
  };
};

export const createReview = async ({
  userId,
  productId,
  rating,
  comment,
  images = [],
  orderItemId,
}) => {
  const product = await Product.findByPk(productId, { attributes: ["id"] });
  if (!product) {
    throw new Error("Product not found");
  }

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error("Rating must be an integer between 1 and 5");
  }

  // Nếu có truyền orderItemId => enforce các rule:
  // - Order thuộc về user
  // - Order đã delivered
  // - order_item.product_id khớp với productId
  // - Chưa có review nào trước đó cho order_item này từ cùng user
  const payload = {
    user_id: userId,
    product_id: productId,
    rating,
    comment: comment || null,
    images: Array.isArray(images) ? images : [],
  };

  if (orderItemId) {
    const numericOrderItemId = Number(orderItemId);
    if (!numericOrderItemId || Number.isNaN(numericOrderItemId)) {
      throw new Error("Order item ID không hợp lệ");
    }

    const orderItem = await OrderItem.findByPk(numericOrderItemId);
    if (!orderItem) {
      throw new Error("Không tìm thấy sản phẩm trong đơn hàng");
    }

    if (orderItem.product_id !== productId) {
      throw new Error("Sản phẩm không khớp với item trong đơn hàng");
    }

    const order = await Order.findByPk(orderItem.order_id);
    if (!order || order.user_id !== userId) {
      throw new Error("Bạn không có quyền đánh giá sản phẩm trong đơn hàng này");
    }

    if (order.status !== "delivered") {
      throw new Error("Chỉ có thể đánh giá sản phẩm khi đơn hàng đã được giao thành công");
    }

    const existing = await Review.findOne({
      where: {
        user_id: userId,
        order_item_id: numericOrderItemId,
      },
    });
    if (existing) {
      throw new Error("Bạn đã đánh giá sản phẩm này trong đơn hàng này rồi");
    }

    payload.order_item_id = numericOrderItemId;
    payload.is_verified_purchase = true;
  }

  const review = await Review.create(payload);
  return review.toJSON ? review.toJSON() : review;
};

export const updateReview = async ({
  reviewId,
  userId,
  rating,
  comment,
  images = [],
}) => {
  const review = await Review.findByPk(reviewId);
  if (!review) {
    throw new Error("Review not found");
  }

  if (review.user_id !== userId) {
    throw new Error("You can only update your own reviews");
  }

  if (rating !== undefined) {
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error("Rating must be an integer between 1 and 5");
    }
  }

  const updateData = {};
  if (rating !== undefined) updateData.rating = rating;
  if (comment !== undefined) updateData.comment = comment || null;
  if (images !== undefined) updateData.images = Array.isArray(images) ? images : [];

  await review.update(updateData);
  return review.toJSON ? review.toJSON() : review;
};

export const deleteReview = async ({ reviewId, userId }) => {
  const review = await Review.findByPk(reviewId);
  if (!review) {
    throw new Error("Review not found");
  }

  if (review.user_id !== userId) {
    throw new Error("You can only delete your own reviews");
  }

  await review.destroy();
  return { success: true };
};