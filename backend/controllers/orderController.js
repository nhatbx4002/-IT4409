import * as orderService from '../services/orderService.js';

/**
 * Tính phí ship (API riêng để Frontend gọi khi chọn xong địa chỉ)
 */
export const getShippingFee = async (req, res) => {
    try {
        const userId = req.user.id;
        // locationData: { province_id, district_id, ... } từ Frontend gửi lên
        const locationData = req.body;

        const result = await orderService.previewShippingFee(userId, locationData);

        res.status(200).json({
            success: true,
            message: "Tính phí ship thành công",
            data: result
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Tạo đơn hàng (Checkout)
 */
export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        // Frontend gửi: ID địa chỉ đã lưu, Phương thức thanh toán, Ghi chú
        const { shippingAddressId, paymentMethod, notes } = req.body;

        const result = await orderService.createOrder(userId, shippingAddressId, paymentMethod, notes);

        res.status(201).json({
            success: true,
            message: "Đặt hàng thành công",
            data: {
                orderId: result.order.id,
                totalAmount: result.financials.totalAmount,
                paymentMethod: result.order.payment_method,
                paymentUrl: result.paymentUrl // (Nếu là VNPAY thì có link này)
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Lấy danh sách đơn hàng của tôi
 */
export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await orderService.getUserOrders(userId);

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Lấy chi tiết một đơn hàng
 */
export const getOrderDetails = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const order = await orderService.getOrderById(userId, id);

        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};