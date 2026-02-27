import { sendError, sendSuccess } from "./controllerUtils.js";
import { createOrder, handleVnPayCallback, getOrderById } from "../services/orderService.js";
import { loadEnv } from "../config/env.js";

/**
 * POST /api/payment/create
 * Khởi tạo thanh toán online (hiện tại dùng VNPay, sau có thể mở rộng)
 * Body: { shippingAddressId, paymentMethod, notes, promotionCode }
 */
export const createPaymentController = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      const error = new Error("Cần đăng nhập để tạo thanh toán");
      error.status = 401;
      return sendError(res, error, 401);
    }

    const { shippingAddressId, paymentMethod, notes, promotionCode } = req.body || {};

    // Chỉ cho phép online method ở đây (VNPay, sau này có thể thêm MoMo/ZaloPay)
    const onlineMethods = ["VNPAY"];
    if (!onlineMethods.includes(String(paymentMethod).toUpperCase())) {
      const error = new Error("Phương thức thanh toán online không hợp lệ");
      error.status = 400;
      return sendError(res, error, 400);
    }

    // Tái sử dụng logic createOrder hiện có
    const result = await createOrder(
      userId,
      shippingAddressId,
      paymentMethod,
      notes,
      promotionCode
    );

    return sendSuccess(res, {
      status: 201,
      message: "Khởi tạo thanh toán thành công",
      data: {
        orderId: result.order.id,
        totalAmount: result.financials.totalAmount,
        currency: "VND",
        paymentMethod: String(paymentMethod).toUpperCase(),
        paymentUrl: result.paymentUrl || null,
      },
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/**
 * POST /api/payment/webhook
 * Webhook từ cổng thanh toán (notify_url)
 * Hiện tại dùng lại logic VNPay callback.
 */
export const paymentWebhookController = async (req, res) => {
  try {
    // VNPay dùng query string, nhưng để linh hoạt ta nhận cả body + query
    const vnpParams = Object.keys(req.body || {}).length ? req.body : req.query;

    const result = await handleVnPayCallback(vnpParams);

    return sendSuccess(res, {
      data: result,
      message: "Xử lý webhook thanh toán thành công",
    });
  } catch (error) {
    return sendError(res, error);
  }
};

/**
 * GET /api/payment/callback
 * return_url cho user → chỉ redirect về FE dựa theo trạng thái đã lưu.
 */
export const paymentCallbackController = async (req, res) => {
  try {
    const env = loadEnv();
    const frontendUrl = env.FRONTEND_URL || "http://localhost:5173";

    const vnpParams = req.query;
    let orderId = req.query.orderId;

    // Nếu VNPay trả về vnp_TxnRef theo format orderId_HHmmss
    if (!orderId && vnpParams?.vnp_TxnRef) {
      orderId = parseInt(String(vnpParams.vnp_TxnRef).split("_")[0], 10);
    }

    if (!orderId || Number.isNaN(Number(orderId))) {
      return res.redirect(
        `${frontendUrl}/payment-error?message=${encodeURIComponent("Không tìm thấy đơn hàng")}`
      );
    }

    // Ở đây chỉ đọc trạng thái để redirect, không xử lý payment nữa
    // Nếu sau này cần an toàn hơn có thể dùng repository trực tiếp thay vì getOrderById (yêu cầu user)
    let order;
    try {
      // getOrderById hiện yêu cầu userId, nên đoạn này chủ yếu để giữ cấu trúc;
      // có thể refactor sau để dùng repo trực tiếp nếu cần.
      order = await getOrderById(null, orderId);
    } catch {
      return res.redirect(
        `${frontendUrl}/payment-error?message=${encodeURIComponent("Không tìm thấy đơn hàng")}`
      );
    }

    const payment = order.Payment || order.payment;
    const paymentStatus = payment?.status || "pending";

    const redirectUrl =
      paymentStatus === "completed"
        ? `${frontendUrl}/orders/${orderId}?payment=success`
        : `${frontendUrl}/orders/${orderId}?payment=failed`;

    return res.redirect(redirectUrl);
  } catch (error) {
    const env = loadEnv();
    const frontendUrl = env.FRONTEND_URL || "http://localhost:5173";
    return res.redirect(
      `${frontendUrl}/payment-error?message=${encodeURIComponent(error.message)}`
    );
  }
};

