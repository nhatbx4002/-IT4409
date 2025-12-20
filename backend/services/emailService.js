import nodemailer from "nodemailer";
import { loadEnv } from "../config/env.js";
import { EMAIL_SENDER } from "../config/constants.js";

const env = loadEnv();

// Cấu hình Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
    },
});

/**
 * Gửi email thông báo trạng thái đơn hàng
 */
export const sendOrderStatusEmail = async (to, orderId, newStatus) => {
    if (!to) return;

    const subject = `Cập nhật trạng thái đơn hàng #${orderId}`;
    let statusText = "";
    let message = "";

    switch (newStatus) {
        case 'confirmed':
            statusText = "ĐÃ ĐƯỢC XÁC NHẬN";
            message = "Chúng tôi đang chuẩn bị hàng để giao cho bạn.";
            break;
        case 'shipping':
            statusText = "ĐANG ĐƯỢC GIAO";
            message = "Vui lòng chú ý điện thoại để nhận hàng.";
            break;
        case 'completed':
            statusText = "ĐÃ HOÀN THÀNH";
            message = "Cảm ơn bạn đã mua sắm tại cửa hàng!";
            break;
        case 'canceled':
            statusText = "ĐÃ BỊ HỦY";
            message = "Rất tiếc đơn hàng của bạn đã bị hủy. Vui lòng liên hệ nếu có nhầm lẫn.";
            break;
        default:
            statusText = newStatus.toUpperCase();
    }

    const text = `Xin chào,\n\nĐơn hàng #${orderId} của bạn hiện tại: ${statusText}.\n${message}\n\nTrân trọng,`;

    try {
        await transporter.sendMail({
            from: EMAIL_SENDER,
            to,
            subject,
            text,
        });
    } catch (error) {
        console.error("❌ Lỗi gửi email:", error);
    }
};