import {
  Cart,
  CartItem,
  ProductVariant,
  Product,
  ShippingAddress,
  Order,
  OrderItem,
  Payment,
  User,
} from "../models/index.js";

export const findCartWithItems = (userId) =>
  Cart.findOne({
    where: { user_id: userId },
    include: [
      {
        model: CartItem,
        include: [
          {
            model: ProductVariant,
            as: "product_variant",
            include: [{ model: Product, as: "product" }],
          },
        ],
      },
    ],
  });

export const findShippingAddress = (userId, addressId) =>
  ShippingAddress.findOne({
    where: { id: addressId, user_id: userId },
  });

export const createOrderRecord = (payload, transaction) =>
  Order.create(payload, { transaction });

export const bulkCreateOrderItems = (items, transaction) =>
  OrderItem.bulkCreate(items, { transaction });

export const createPaymentRecord = (payload, transaction) =>
  Payment.create(payload, { transaction });

export const clearCartItems = (cartId, transaction) =>
  CartItem.destroy({ where: { cart_id: cartId }, transaction });

export const findOrdersForUser = (userId) =>
  Order.findAll({
    where: { user_id: userId },
    order: [["created_at", "DESC"]],
    include: [{ model: Payment }, { model: OrderItem }],
  });

export const findOrderForUser = (userId, orderId) =>
  Order.findOne({
    where: { id: orderId, user_id: userId },
    include: [{ model: ShippingAddress }, { model: Payment }, { model: OrderItem }],
  });

export const findAllOrders = () =>
  Order.findAll({
    order: [["created_at", "DESC"]],
    include: [
      {
        model: User,
        attributes: ["id", "full_name", "email", "phone"],
      },
      { model: Payment },
      { model: OrderItem },
    ],
  });

export const findOrderWithRelations = (orderId) =>
  Order.findByPk(orderId, {
    include: [{ model: User }, { model: OrderItem }],
  });

