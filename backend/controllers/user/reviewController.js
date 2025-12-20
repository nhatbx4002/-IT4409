import { sendError, sendSuccess } from "../../utils/response.js";
import { createReview, listProductReviews } from "../../services/user/reviewService.js";

export const listProductReviewsController = async (req, res) => {
  const productId = Number(req.params.productId);
  const page = req.query.page ? Number(req.query.page) : 1;
  const pageSize = req.query.pageSize ? Number(req.query.pageSize) : 6;

  try {
    const data = await listProductReviews({ productId, page, pageSize });
    return sendSuccess(res, 200, data, "Reviews fetched successfully");
  } catch (error) {
    const statusCode = error.message === "Product not found" ? 404 : 400;
    return sendError(res, { status: statusCode, message: error.message });
  }
};

export const createReviewController = async (req, res) => {
  const userId = req.user?.id;
  const { productId, rating, comment, images } = req.body;

  if (!userId) {
    return sendError(res, { status: 401, message: "Authentication required" });
  }

  try {
    const data = await createReview({
      userId,
      productId: Number(productId),
      rating: Number(rating),
      comment,
      images,
    });
    return sendSuccess(res, 201, data, "Review created successfully");
  } catch (error) {
    const statusCode = error.message === "Product not found" ? 404 : 400;
    return sendError(res, { status: statusCode, message: error.message });
  }
};
