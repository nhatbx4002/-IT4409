import { ShippingAddress } from "../models/index.js";

// 1. Thêm địa chỉ mới
export const addAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        // Nhận vào cả name (để lưu hiển thị) và code (nếu muốn xử lý logic, nhưng model cũ chỉ có cột string)
        // Vì bạn KHÔNG muốn sửa model, ta sẽ lưu TÊN (string) vào database để hiển thị cho đúng.
        const { full_name, phone, city, district, ward, address, is_default } = req.body;

        // Nếu user chọn địa chỉ này là mặc định, ta phải bỏ mặc định các địa chỉ cũ
        if (is_default) {
            await ShippingAddress.update(
                { is_default: false },
                { where: { user_id: userId } }
            );
        }

        const newAddress = await ShippingAddress.create({
            user_id: userId,
            full_name,
            phone,
            city,      // Lưu tên Tỉnh (VD: "Hà Nội")
            district,  // Lưu tên Quận (VD: "Ba Đình")
            ward,      // Lưu tên Phường (VD: "Phúc Xá")
            address,   // Số nhà, đường
            is_default: is_default || false
        });

        res.status(201).json({
            success: true,
            message: "Thêm địa chỉ thành công",
            data: newAddress
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 2. Lấy danh sách địa chỉ của User
export const getMyAddresses = async (req, res) => {
    try {
        const userId = req.user.id;
        const addresses = await ShippingAddress.findAll({
            where: { user_id: userId },
            order: [['is_default', 'DESC'], ['created_at', 'DESC']] // Mặc định lên đầu
        });

        res.status(200).json({
            success: true,
            data: addresses
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 3. Xóa địa chỉ
export const deleteAddress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const deleted = await ShippingAddress.destroy({
            where: { id: id, user_id: userId }
        });

        if (!deleted) throw new Error("Địa chỉ không tồn tại");

        res.status(200).json({ success: true, message: "Đã xóa địa chỉ" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}