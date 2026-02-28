import bcrypt from "bcryptjs";
import { loadEnv } from "../config/env.js";
import { sequelize } from "../config/db.config.js";
import {
  User,
  Category,
  Product,
  ProductVariant,
  Discount,
  Collection,
  ProductCollection,
  Review,
  ShippingAddress,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Wishlist,
  Notification,
  ProductView,
  OrderStatusHistory
} from "../models/index.js";

/**
 * Seed Data Script
 * 
 * This script populates the database with initial testing data.
 * It will clear existing data and insert new ones.
 */

async function seed() {
  try {
    // Load environment variables
    loadEnv();

    console.log("🔗 Connecting to database...");
    await sequelize.authenticate();
    console.log("✓ Connected.\n");

    console.log("🔨 Dropping and recreating all tables (force sync)...");
    // sequelize.sync({ force: true }) will drop tables if they exist and recreate them based on models
    // This is safer than manual destroy when tables might not exist yet
    await sequelize.sync({ force: true });
    console.log("✓ Tables recreated.\n");

    // 1. Create Users
    console.log("👤 Creating users...");
    const hashedPassword = await bcrypt.hash("password123", 10);
    const admin = await User.create({
      email: "admin@example.com",
      password: hashedPassword,
      name: "System Admin",
      phone: "0123456789",
      role: "admin",
      email_verified: true
    });

    const customer = await User.create({
      email: "customer@example.com",
      password: hashedPassword,
      name: "John Doe",
      phone: "0987654321",
      role: "customer",
      email_verified: true,
      gender: "male",
      date_of_birth: "1995-01-01"
    });
    console.log("✓ Users created.\n");

    // 2. Create Categories
    console.log("📂 Creating categories...");
    const catMen = await Category.create({
      name: "Nam",
      slug: "nam",
      description: "Thời trang nam giới",
      level: 0
    });

    const catWomen = await Category.create({
      name: "Nữ",
      slug: "nu",
      description: "Thời trang nữ giới",
      level: 0
    });

    const catAccessories = await Category.create({
      name: "Phụ kiện",
      slug: "phu-kien",
      description: "Trang sức, túi xách, phụ kiện",
      level: 0
    });

    const catShirts = await Category.create({
      name: "Áo sơ mi",
      slug: "ao-so-mi",
      parent_id: catMen.id,
      level: 1
    });

    const catDresses = await Category.create({
      name: "Váy liền",
      slug: "vay-lien",
      parent_id: catWomen.id,
      level: 1
    });
    console.log("✓ Categories created.\n");

    // 3. Create Products
    console.log("📦 Creating products...");
    const p1 = await Product.create({
      name: "Áo sơ mi Oxford Classic",
      description: "Chất liệu cotton cao cấp, thoáng mát, form dáng chuẩn.",
      brand: "Essential",
      base_price: 350000,
      category_id: catShirts.id,
      slug: "ao-so-mi-oxford-classic",
      images: ["https://res.cloudinary.com/demo/image/upload/v1625121213/sample.jpg"],
      status: "active",
      tags: ["BS", "NEW"]
    });

    const p2 = await Product.create({
      name: "Váy lụa dạo phố",
      description: "Váy lụa mềm mại, sang trọng cho những buổi tiệc tối.",
      brand: "Grace",
      base_price: 590000,
      category_id: catDresses.id,
      slug: "vay-lua-dao-pho",
      images: ["https://res.cloudinary.com/demo/image/upload/v1625121213/sample.jpg"],
      status: "active",
      tags: ["LIMITED"]
    });

    const p3 = await Product.create({
      name: "Túi xách da thật",
      description: "Da bò 100%, thiết kế minimal sang trọng.",
      brand: "Luxe",
      base_price: 1200000,
      category_id: catAccessories.id,
      slug: "tui-xach-da-that",
      images: ["https://res.cloudinary.com/demo/image/upload/v1625121213/sample.jpg"],
      status: "active"
    });
    console.log("✓ Products created.\n");

    // 4. Create Product Variants
    console.log("🎨 Creating product variants...");
    // P1 Variants
    await ProductVariant.bulkCreate([
      { product_id: p1.id, color: "Trắng", size: "M", sku: "OXFORD-WHT-M", stock_quantity: 50, price_adjustment: 0 },
      { product_id: p1.id, color: "Trắng", size: "L", sku: "OXFORD-WHT-L", stock_quantity: 30, price_adjustment: 0 },
      { product_id: p1.id, color: "Xanh nhạt", size: "M", sku: "OXFORD-BLU-M", stock_quantity: 20, price_adjustment: 0 },
      { product_id: p1.id, color: "Xanh nhạt", size: "L", sku: "OXFORD-BLU-L", stock_quantity: 15, price_adjustment: 0 },
    ]);

    // P2 Variants
    await ProductVariant.bulkCreate([
      { product_id: p2.id, color: "Đen", size: "S", sku: "DRESS-BLK-S", stock_quantity: 10, price_adjustment: 50000 },
      { product_id: p2.id, color: "Đen", size: "M", sku: "DRESS-BLK-M", stock_quantity: 10, price_adjustment: 50000 },
      { product_id: p2.id, color: "Đỏ rượu", size: "S", sku: "DRESS-RED-S", stock_quantity: 5, price_adjustment: 100000 },
    ]);

    // P3 Variant
    await ProductVariant.create({
      product_id: p3.id,
      color: "Nâu",
      size: "Free size",
      sku: "BAG-BRW-OS",
      stock_quantity: 5,
      price_adjustment: 0
    });
    console.log("✓ Product variants created.\n");

    // 5. Create Discounts
    console.log("🎟️ Creating discounts...");
    await Discount.bulkCreate([
      {
        name: "Welcome Discount",
        code: "WELCOME10",
        discount_type: "percentage",
        discount_value: 10,
        max_discount_amount: 50000,
        min_order_value: 200000,
        start_date: new Date(),
        end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        usage_limit: 100,
        is_active: true
      },
      {
        name: "Free Shipping",
        code: "FREESHIP",
        discount_type: "fixed_amount",
        discount_value: 30000,
        max_discount_amount: 30000,
        min_order_value: 500000,
        start_date: new Date(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        usage_limit: 1000,
        is_active: true
      }
    ]);
    console.log("✓ Discounts created.\n");

    // 6. Create Collections
    console.log("🖼️ Creating collections...");
    const summerColl = await Collection.create({
      name: "Bộ sưu tập mùa hè",
      slug: "bo-suu-tap-mua-he",
      description: "Thoáng mát cùng BST Mùa Hè rực rỡ",
      image_url: "https://res.cloudinary.com/demo/image/upload/v1625121213/sample.jpg"
    });

    await ProductCollection.bulkCreate([
      { product_id: p1.id, collection_id: summerColl.id },
      { product_id: p2.id, collection_id: summerColl.id }
    ]);
    console.log("✓ Collections created.\n");

    // 7. Create Some Reviews
    console.log("⭐️ Creating reviews...");
    await Review.bulkCreate([
      {
        product_id: p1.id,
        user_id: customer.id,
        rating: 5,
        comment: "Áo rất đẹp, vải mềm, mặc rất thích.",
        is_visible: true
      },
      {
        product_id: p2.id,
        user_id: customer.id,
        rating: 4,
        comment: "Váy đẹp nhưng hơi ngắn so với mình.",
        is_visible: true
      }
    ]);
    console.log("✓ Reviews created.\n");

    console.log("=".repeat(40));
    console.log("🚀 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=".repeat(40));

    await sequelize.close();
    process.exit(0);

  } catch (error) {
    console.error("\n❌ Seeding failed:");
    console.error(error);
    await sequelize.close();
    process.exit(1);
  }
}

seed();
