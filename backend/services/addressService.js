import { Op } from "sequelize";
import { Order, ShippingAddress, sequelize } from "../models/index.js";

export const createAddress = async (userId, payload) => {
  const { name, phone, city, district, ward, address, is_default } =
    payload;

  if (is_default) {
    await ShippingAddress.update(
      { is_default: false },
      { where: { user_id: userId } }
    );
  }

  return ShippingAddress.create({
    user_id: userId,
    name,
    phone,
    city,
    district,
    ward,
    address,
    is_default: Boolean(is_default),
  });
};

export const listUserAddresses = async (userId) => {
  return ShippingAddress.findAll({
    where: { user_id: userId },
    order: [
      ["is_default", "DESC"],
      ["created_at", "DESC"],
    ],
  });
};

export const updateAddress = async (userId, addressId, payload) => {
  const address = await ShippingAddress.findOne({
    where: { id: addressId, user_id: userId },
  });

  if (!address) {
    const error = new Error("Địa chỉ không tồn tại");
    error.status = 404;
    throw error;
  }

  if (payload.is_default) {
    return sequelize.transaction(async (transaction) => {
      await ShippingAddress.update(
        { is_default: false },
        { where: { user_id: userId }, transaction }
      );

      await address.update(
        { ...payload, is_default: true },
        { transaction }
      );

      return address;
    });
  }

  await address.update(payload);
  return address;
};

export const setDefaultAddress = async (userId, addressId) => {
  return sequelize.transaction(async (transaction) => {
    const address = await ShippingAddress.findOne({
      where: { id: addressId, user_id: userId },
      transaction,
    });

    if (!address) {
      const error = new Error("Địa chỉ không tồn tại");
      error.status = 404;
      throw error;
    }

    await ShippingAddress.update(
      { is_default: false },
      { where: { user_id: userId }, transaction }
    );

    await address.update({ is_default: true }, { transaction });

    return address;
  });
};

export const removeAddress = async (userId, addressId) => {
  const address = await ShippingAddress.findOne({
    where: { id: addressId, user_id: userId },
  });

  if (!address) {
    const error = new Error("Địa chỉ không tồn tại");
    error.status = 404;
    throw error;
  }

  const activeStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipping",
  ];

  const activeOrder = await Order.findOne({
    where: {
      shipping_address_id: addressId,
      status: { [Op.in]: activeStatuses },
    },
  });

  if (activeOrder) {
    const error = new Error("Không thể xóa địa chỉ đang dùng");
    error.status = 400;
    throw error;
  }

  await ShippingAddress.destroy({
    where: { id: addressId, user_id: userId },
  });

  if (address.is_default) {
    const latestAddress = await ShippingAddress.findOne({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });

    if (latestAddress) {
      await latestAddress.update({ is_default: true });
    }
  }

  return addressId;
};

