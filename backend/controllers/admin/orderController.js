import {
    listOrders,
    getOrderDetail,
    updateOrderStatus,
    processRefund
} from "../../services/admin/orderService.js";
import { sendSuccess, sendError } from "../controllerUtils.js";

export const listOrdersController = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            status, 
            startDate, 
            endDate, 
            customer,
            sortBy = 'created_at',
            sortDir = 'DESC'
        } = req.query;
        
        const data = await listOrders({
            page: parseInt(page),
            limit: parseInt(limit),
            status,
            startDate,
            endDate,
            customer,
            sortBy,
            sortDir
        });
        
        return sendSuccess(res, {
            data,
            message: "Orders fetched successfully"
        });
    } catch (error) {
        return sendError(res, {
            message: "Failed to fetch orders",
            error
        });
    }
};

export const getOrderDetailController = async (req, res) => {
    try {
        const { id } = req.params;
        
        const order = await getOrderDetail(parseInt(id));
        
        return res.status(200).json({
            success: true,
            data: order,
            message: "Order detail fetched successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch order detail"
        });
    }
};

export const updateOrderStatusController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Status is required"
            });
        }
        
        const order = await updateOrderStatus(parseInt(id), status);
        
        return sendSuccess(res, {
            data: order,
            message: "Order status updated successfully"
        });
    } catch (error) {
        return sendError(res, {
            message: "Failed to update order status",
            error
        });
    }
};

export const refundOrderController = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, amount } = req.body;
        
        if (!reason) {
            return res.status(400).json({
                success: false,
                message: "Refund reason is required"
            });
        }
        
        const order = await processRefund(parseInt(id), { reason, amount });
        
        return res.status(200).json({
            success: true,
            data: order,
            message: "Refund processed successfully"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to process refund"
        });
    }
};