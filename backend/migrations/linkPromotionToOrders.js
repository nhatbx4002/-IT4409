/**
 * Migration: Link promotion_id to existing orders
 * 
 * Script này sẽ:
 * 1. Tìm promotion_code trong mỗi order
 * 2. Match với promotion.id
 * 3. Cập nhật promotion_id cho order
 * 
 * Chạy: node ./migrations/linkPromotionToOrders.js
 */

import { sequelize, Order, Promotion } from "../models/index.js";
import { Op } from "sequelize";

const linkPromotionToOrders = async () => {
  try {
    console.log("🔄 Starting migration: Link promotion_id to existing orders...");

    // Đảm bảo schema đã có đầy đủ cột (tránh lỗi thiếu cột trên DB cũ)
    // 1) Nếu thiếu cột name -> thêm trước
    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'promotions' AND column_name = 'name'
        ) THEN
          ALTER TABLE promotions ADD COLUMN name VARCHAR(255);
        END IF;
      END $$;
    `);

    // 2) Chuẩn hóa discount_type giá trị cũ để tránh lỗi cast enum
    await sequelize.query(`
      UPDATE promotions
      SET discount_type = 'fixed_amount'
      WHERE discount_type IN ('fixed', 'fixed_amount');
    `);

    // 3) Lấp đầy giá trị NULL cho cột name
    await sequelize.query(`
      UPDATE promotions
      SET name = COALESCE(name, code, 'Promotion')
      WHERE name IS NULL;
    `);

    // 4) Đảm bảo orders có cột promotion_id (nếu chưa có)
    await sequelize.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'orders' AND column_name = 'promotion_id'
        ) THEN
          ALTER TABLE orders ADD COLUMN promotion_id INTEGER;
        END IF;
      END $$;
    `);

    // Tìm tất cả orders có promotion_code nhưng chưa có promotion_id
    const ordersWithPromoCode = await Order.findAll({
      where: {
        promotion_code: { [Op.not]: null },
        promotion_id: null,
      },
      raw: true,
    });

    console.log(
      `📋 Found ${ordersWithPromoCode.length} orders with promotion_code but no promotion_id`
    );

    let updated = 0;
    let skipped = 0;

    for (const order of ordersWithPromoCode) {
      // Tìm promotion theo code
      const promotion = await Promotion.findOne({
        where: { code: order.promotion_code },
        raw: true,
      });

      if (promotion) {
        // Cập nhật promotion_id
        await Order.update(
          { promotion_id: promotion.id },
          { where: { id: order.id } }
        );
        updated++;
        console.log(
          `✅ Order #${order.id}: Linked to Promotion #${promotion.id} (${order.promotion_code})`
        );
      } else {
        skipped++;
        console.log(
          `⚠️  Order #${order.id}: Promotion code "${order.promotion_code}" not found in database`
        );
      }
    }

    console.log(`\n📊 Migration Summary:`);
    console.log(`   ✅ Updated: ${updated} orders`);
    console.log(`   ⚠️  Skipped: ${skipped} orders (promotion not found)`);
    console.log(`✨ Migration completed successfully!`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
};

linkPromotionToOrders();
