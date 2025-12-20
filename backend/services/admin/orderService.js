import { Op, fn, col, literal } from "sequelize";
import { Order, OrderItem, Product, User, ShippingAddress } from "../../models/index.js";

const normalizeDate = ({ from, to }) => {
    const now = new Date();
    const toDate = to ? new Date(to) : now;
    const fromDate = from ? new Date(from) : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return { fromDate, toDate };
};

export const listOrders = async ({ 
    page = 1, 
    limit = 10, 
    status = null, 
    startDate = null, 
    endDate = null,
    customer = null,
    sortBy = 'created_at',
    sortDir = 'DESC'
}) => {
    const { fromDate, toDate } = normalizeDate({ from: startDate, to: endDate });
    
    const whereClause = {};
    
    // Add status filter if provided
    if (status) {
        whereClause.status = status;
    }
    
    // Add date range filter if provided
    if (fromDate || toDate) {
        whereClause.created_at = {};
        if (fromDate) {
            whereClause.created_at[Op.gte] = fromDate;
        }
        if (toDate) {
            whereClause.created_at[Op.lte] = toDate;
        }
    }
    
    // Add customer search if provided
    if (customer) {
        whereClause[Op.or] = [
            { '$user.name$': { [Op.iLike]: `%${customer}%` } },
            { '$user.email$': { [Op.iLike]: `%${customer}%` } }
        ];
    }
    
    // Add order by clause
    const orderClause = [];
    if (sortBy === 'total_amount') {
        orderClause.push([literal('order_items.quantity * order_items.unit_price'), sortDir.toUpperCase()]);
    } else {
        orderClause.push([`Order.${sortBy}`, sortDir.toUpperCase()]);
    }
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    const { count, rows } = await Order.findAndCountAll({
        where: whereClause,
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email'],
                required: false
            },
            {
                model: OrderItem,
                as: 'order_items',
                attributes: ['id', 'product_id', 'quantity', 'unit_price', 'line_total'],
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'slug']
                    }
                ],
                required: false
            },
            {
                model: ShippingAddress,
                as: 'shipping_address',
                attributes: ['id', 'full_name', 'phone', 'address', 'city', 'province'],
                required: false
            }
        ],
        order: orderClause,
        limit: parseInt(limit),
        offset,
        distinct: true
    });
    
    const totalPages = Math.ceil(count / limit);
    
    return {
        orders: rows,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: count,
            totalPages
        }
    };
};

export const getOrderDetail = async (orderId) => {
    const order = await Order.findByPk(orderId, {
        include: [
            {
                model: User,
                as: 'user',
                attributes: ['id', 'name', 'email']
            },
            {
                model: OrderItem,
                as: 'order_items',
                attributes: ['id', 'product_id', 'quantity', 'unit_price', 'line_total'],
                include: [
                    {
                        model: Product,
                        as: 'product',
                        attributes: ['id', 'name', 'slug']
                    }
                ]
            },
            {
                model: ShippingAddress,
                as: 'shipping_address',
                attributes: ['id', 'full_name', 'phone', 'address', 'city', 'province']
            }
        ]
    });
    
    if (!order) {
        throw new Error("Order not found");
    }
    
    return order;
};

const validStatusTransitions = {
    pending: ['confirmed', 'canceled'],
    confirmed: ['shipping', 'canceled'],
    shipping: ['completed', 'canceled'],
    completed: [], // This is a terminal state
    canceled: [] // This is a terminal state
};

export const updateOrderStatus = async (orderId, newStatus) => {
    const order = await Order.findByPk(orderId);
    
    if (!order) {
        throw new Error("Order not found");
    }
    
    const currentStatus = order.status;
    const allowedNewStatuses = validStatusTransitions[currentStatus] || [];
    
    if (!allowedNewStatuses.includes(newStatus)) {
        throw new Error(`Cannot change order status from ${currentStatus} to ${newStatus}`);
    }
    
    order.status = newStatus;
    await order.save();
    
    return order;
};

export const processRefund = async (orderId, refundData) => {
    const order = await Order.findByPk(orderId);
    
    if (!order) {
        throw new Error("Order not found");
    }
    
    // For now, just update status to 'refunded' and save refund data
    order.status = 'refunded';
    // In a real implementation, you would process the refund through payment gateway
    // and store refund details in a separate refunds table
    
    // For simplicity, we'll store refund data in notes field
    const refundNote = refundData.reason 
        ? `Refund processed: ${refundData.reason}. Amount: ${refundData.amount}`
        : 'Refund processed';
    
    order.notes = refundNote;
    await order.save();
    
    return order;
};

