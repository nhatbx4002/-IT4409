import { sendError, sendSuccess } from "./controllerUtils.js";
import { validateCheckout } from "../services/checkoutService.js";

const extractSessionId = (req) => {
  const headerValue = req.headers["x-session-id"] || req.headers["x-sessionid"];
  if (typeof headerValue === "string" && headerValue.trim()) {
    return headerValue.trim();
  }

  const cookieHeader = req.headers?.cookie;
  if (typeof cookieHeader === "string") {
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((part) => {
        const [k, v] = part.split("=").map((s) => s.trim());
        return [k, v];
      })
    );
    if (cookies.sessionId) return cookies.sessionId;
  }
  return null;
};

export const validateCheckoutController = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = extractSessionId(req);
    const { shippingAddressId, shippingAddress, paymentMethod, promotionCode } = req.body || {};

    const result = await validateCheckout({
      userId,
      sessionId,
      shippingAddressId,
      shippingAddress,
      paymentMethod,
      promotionCode,
    });

    return sendSuccess(res, { data: result });
  } catch (error) {
    return sendError(res, error);
  }
};
