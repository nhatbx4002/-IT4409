import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../../.env") });

import {
  sequelize,
  User,
  ShippingAddress,
  Category,
  Product,
  ProductVariant,
  Cart,
  CartItem,
  Order,
  OrderItem,
  Payment,
  Promotion,
  Review,
} from "../models/index.js";
import { QueryTypes } from "sequelize";
import { up as migrateProductFields } from "../migrations/addProductFields.js";

const ensureUserColumns = async () => {
  const columns = [
    { name: "token_version", type: "INTEGER DEFAULT 0" },
    { name: "refresh_token", type: "TEXT" },
    { name: "access_token", type: "TEXT" },
    { name: "expires_at", type: "TIMESTAMP" },
  ];

  for (const column of columns) {
    await sequelize.query(
      `
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = 'users' AND column_name = '${column.name}'
        ) THEN
          ALTER TABLE users ADD COLUMN ${column.name} ${column.type};
        END IF;
      END $$;
      `,
      { type: QueryTypes.RAW }
    );
  }
};

const seedData = async () => {
  try {
    console.log("Starting full seed...");
    await sequelize.authenticate();
    console.log("Database connected");

    console.log("Running product fields migration (if needed)...");
    await migrateProductFields();
    console.log("Product fields migration completed");

    await ensureUserColumns();

    await sequelize.query(`
      TRUNCATE TABLE
        reviews,
        payments,
        order_items,
        orders,
        cart_items,
        carts,
        product_variants,
        products,
        categories,
        shipping_addresses,
        users,
        promotions
      RESTART IDENTITY CASCADE;
    `);
    console.log("Existing data cleared");

    const passwordHash = await bcrypt.hash("password123", 10);
    const adminHash = await bcrypt.hash("admin123", 10);

    const users = await User.bulkCreate(
      [
        {
          email: "alice@example.com",
          password: passwordHash,
          full_name: "Alice Nguyen",
          phone: "0900000001",
          role: "customer",
        },
        {
          email: "admin@example.com",
          password: adminHash,
          full_name: "Admin Tran",
          phone: "0900000002",
          role: "admin",
        },
        {
          email: "bob@example.com",
          password: passwordHash,
          full_name: "Bob Pham",
          phone: "0900000003",
          role: "customer",
        },
        {
          email: "charlie@example.com",
          password: passwordHash,
          full_name: "Charlie Le",
          phone: "0900000004",
          role: "customer",
        },
        {
          email: "diana@example.com",
          password: passwordHash,
          full_name: "Diana Vo",
          phone: "0900000005",
          role: "customer",
        },
      ],
      { returning: true }
    );

    const addresses = await ShippingAddress.bulkCreate(
      [
        {
          user_id: users[0].id,
          full_name: "Alice Nguyen",
          phone: "0900000001",
          address: "123 Pasteur, District 1",
          city: "Ho Chi Minh",
          district: "District 1",
          ward: "Ben Nghe",
          is_default: true,
        },
        {
          user_id: users[1].id,
          full_name: "Admin Tran",
          phone: "0900000002",
          address: "42 Pho Hue, Hai Ba Trung",
          city: "Ha Noi",
          district: "Hai Ba Trung",
          ward: "Pham Dinh Ho",
          is_default: true,
        },
        {
          user_id: users[2].id,
          full_name: "Bob Pham",
          phone: "0900000003",
          address: "88 Nguyen Hue, District 1",
          city: "Ho Chi Minh",
          district: "District 1",
          ward: "Ben Nghe",
          is_default: true,
        },
        {
          user_id: users[3].id,
          full_name: "Charlie Le",
          phone: "0900000004",
          address: "15 Tran Hung Dao, Son Tra",
          city: "Da Nang",
          district: "Son Tra",
          ward: "An Hai Bac",
          is_default: true,
        },
        {
          user_id: users[4].id,
          full_name: "Diana Vo",
          phone: "0900000005",
          address: "25 Le Loi, Ninh Kieu",
          city: "Can Tho",
          district: "Ninh Kieu",
          ward: "Tan An",
          is_default: true,
        },
      ],
      { returning: true }
    );

    const [men, women, accessories] = await Category.bulkCreate(
      [
        { name: "Men", slug: "men", parent_id: null },
        { name: "Women", slug: "women", parent_id: null },
        { name: "Accessories", slug: "accessories", parent_id: null },
      ],
      { returning: true }
    );

    const subCategories = await Category.bulkCreate(
      [
        { name: "Shirts", slug: "men-shirts", parent_id: men.id },
        { name: "Pants", slug: "men-pants", parent_id: men.id },
        { name: "Dresses", slug: "women-dresses", parent_id: women.id },
        { name: "Tops", slug: "women-tops", parent_id: women.id },
        { name: "Watches", slug: "watches", parent_id: accessories.id },
        { name: "Bags", slug: "bags", parent_id: accessories.id },
      ],
      { returning: true }
    );

    const categoriesBySlug = {};
    [...subCategories, men, women, accessories].forEach((cat) => {
      categoriesBySlug[cat.slug] = cat;
    });

    const productSeed = [
      {
        name: "Essential Cotton Shirt",
        slug: "essential-cotton-shirt",
        description: "Everyday cotton button-down with a modern fit.",
        brand: "Everyday",
        base_price: 49.99,
        category_id: categoriesBySlug["men-shirts"].id,
        collection: "men",
        is_new: true,
        tags: ["cotton", "shirt", "casual"],
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"],
      },
      {
        name: "Slim Chino Pants",
        slug: "slim-chino-pants",
        description: "Tapered chinos with stretch for comfort at work or weekend.",
        brand: "LineUp",
        base_price: 79.99,
        sale_price: 69.99,
        category_id: categoriesBySlug["men-pants"].id,
        collection: "men",
        is_new: false,
        tags: ["chino", "smart-casual"],
        images: ["https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800"],
      },
      {
        name: "Relaxed Oxford Shirt",
        slug: "relaxed-oxford-shirt",
        description: "Soft washed oxford shirt with a relaxed, lived-in feel.",
        brand: "LineUp",
        base_price: 59.99,
        category_id: categoriesBySlug["men-shirts"].id,
        collection: "men",
        is_new: false,
        tags: ["oxford", "shirt", "relaxed"],
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"],
      },
      {
        name: "Tech Stretch Joggers",
        slug: "tech-stretch-joggers",
        description: "Moisture-wicking joggers with 4-way stretch for travel and gym.",
        brand: "Motion",
        base_price: 69.99,
        sale_price: 59.99,
        category_id: categoriesBySlug["men-pants"].id,
        collection: "men",
        is_new: true,
        tags: ["jogger", "athleisure", "stretch"],
        images: ["https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800"],
      },
      {
        name: "Floral Summer Dress",
        slug: "floral-summer-dress",
        description: "Lightweight midi dress with bright floral print.",
        brand: "Sunlit",
        base_price: 109.99,
        category_id: categoriesBySlug["women-dresses"].id,
        collection: "women",
        is_new: true,
        tags: ["floral", "summer", "dress"],
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"],
      },
      {
        name: "Layered Midi Skirt",
        slug: "layered-midi-skirt",
        description: "Flowy layered skirt that pairs perfectly with basic tees.",
        brand: "Sunlit",
        base_price: 79.99,
        category_id: categoriesBySlug["women-dresses"].id,
        collection: "women",
        is_new: false,
        tags: ["skirt", "midi", "layered"],
        images: ["https://images.unsplash.com/photo-1519741497674-611481863552?w=800"],
      },
      {
        name: "Boxy Linen Top",
        slug: "boxy-linen-top",
        description: "Breathable linen top with relaxed silhouette.",
        brand: "Breeze",
        base_price: 59.99,
        category_id: categoriesBySlug["women-tops"].id,
        collection: "women",
        is_new: false,
        tags: ["linen", "top"],
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"],
      },
      {
        name: "Cropped Knit Tee",
        slug: "cropped-knit-tee",
        description: "Ribbed knit tee with a slightly cropped, boxy fit.",
        brand: "Breeze",
        base_price: 39.99,
        category_id: categoriesBySlug["women-tops"].id,
        collection: "women",
        is_new: true,
        tags: ["knit", "tee", "cropped"],
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800"],
      },
      {
        name: "Leather Strap Watch",
        slug: "leather-strap-watch",
        description: "Minimal dial with full-grain leather strap.",
        brand: "Tempo",
        base_price: 219.99,
        category_id: categoriesBySlug["watches"].id,
        collection: "accessories",
        is_new: false,
        tags: ["watch", "leather"],
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"],
      },
      {
        name: "Field Chronograph Watch",
        slug: "field-chronograph-watch",
        description: "Rugged chronograph with canvas strap for everyday wear.",
        brand: "Tempo",
        base_price: 259.99,
        sale_price: 229.99,
        category_id: categoriesBySlug["watches"].id,
        collection: "accessories",
        is_new: true,
        tags: ["watch", "chronograph", "field"],
        images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"],
      },
      {
        name: "Everyday Tote Bag",
        slug: "everyday-tote-bag",
        description: "Canvas tote with internal laptop sleeve and zip pocket.",
        brand: "Carry",
        base_price: 89.99,
        category_id: categoriesBySlug["bags"].id,
        collection: "accessories",
        is_new: true,
        tags: ["bag", "tote", "commute"],
        images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"],
      },
      {
        name: "Compact Crossbody Bag",
        slug: "compact-crossbody-bag",
        description: "Hands-free crossbody bag with just enough room for essentials.",
        brand: "Carry",
        base_price: 69.99,
        category_id: categoriesBySlug["bags"].id,
        collection: "accessories",
        is_new: false,
        tags: ["bag", "crossbody"],
        images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800"],
      },
    ];

    const createdProducts = await Product.bulkCreate(productSeed, { returning: true });
    const productBySlug = {};
    createdProducts.forEach((prod) => {
      productBySlug[prod.slug] = prod;
    });

    const variantSeed = [
      {
        product_id: productBySlug["essential-cotton-shirt"].id,
        color: "White",
        size: "M",
        sku: "ESS-WHT-M",
        price_adjustment: 0,
        stock_quantity: 60,
        image_url: productBySlug["essential-cotton-shirt"].images[0],
      },
      {
        product_id: productBySlug["essential-cotton-shirt"].id,
        color: "Blue",
        size: "L",
        sku: "ESS-BLU-L",
        price_adjustment: 5,
        stock_quantity: 40,
        image_url: productBySlug["essential-cotton-shirt"].images[0],
      },
      {
        product_id: productBySlug["relaxed-oxford-shirt"].id,
        color: "Sky",
        size: "M",
        sku: "OXF-SKY-M",
        price_adjustment: 0,
        stock_quantity: 35,
        image_url: productBySlug["relaxed-oxford-shirt"].images[0],
      },
      {
        product_id: productBySlug["relaxed-oxford-shirt"].id,
        color: "Olive",
        size: "L",
        sku: "OXF-OLV-L",
        price_adjustment: 3,
        stock_quantity: 25,
        image_url: productBySlug["relaxed-oxford-shirt"].images[0],
      },
      {
        product_id: productBySlug["slim-chino-pants"].id,
        color: "Khaki",
        size: "32",
        sku: "CHI-KHA-32",
        price_adjustment: 0,
        stock_quantity: 45,
        image_url: productBySlug["slim-chino-pants"].images[0],
      },
      {
        product_id: productBySlug["slim-chino-pants"].id,
        color: "Navy",
        size: "33",
        sku: "CHI-NAV-33",
        price_adjustment: 8,
        stock_quantity: 30,
        image_url: productBySlug["slim-chino-pants"].images[0],
      },
      {
        product_id: productBySlug["tech-stretch-joggers"].id,
        color: "Charcoal",
        size: "M",
        sku: "JOG-CHR-M",
        price_adjustment: 0,
        stock_quantity: 40,
        image_url: productBySlug["tech-stretch-joggers"].images[0],
      },
      {
        product_id: productBySlug["tech-stretch-joggers"].id,
        color: "Charcoal",
        size: "L",
        sku: "JOG-CHR-L",
        price_adjustment: 0,
        stock_quantity: 32,
        image_url: productBySlug["tech-stretch-joggers"].images[0],
      },
      {
        product_id: productBySlug["floral-summer-dress"].id,
        color: "Red",
        size: "S",
        sku: "DRS-RED-S",
        price_adjustment: 0,
        stock_quantity: 25,
        image_url: productBySlug["floral-summer-dress"].images[0],
      },
      {
        product_id: productBySlug["floral-summer-dress"].id,
        color: "Blue",
        size: "M",
        sku: "DRS-BLU-M",
        price_adjustment: 0,
        stock_quantity: 20,
        image_url: productBySlug["floral-summer-dress"].images[0],
      },
      {
        product_id: productBySlug["layered-midi-skirt"].id,
        color: "Blush",
        size: "S",
        sku: "SKT-BLS-S",
        price_adjustment: 0,
        stock_quantity: 22,
        image_url: productBySlug["layered-midi-skirt"].images[0],
      },
      {
        product_id: productBySlug["layered-midi-skirt"].id,
        color: "Blush",
        size: "M",
        sku: "SKT-BLS-M",
        price_adjustment: 0,
        stock_quantity: 20,
        image_url: productBySlug["layered-midi-skirt"].images[0],
      },
      {
        product_id: productBySlug["boxy-linen-top"].id,
        color: "Natural",
        size: "M",
        sku: "LIN-NAT-M",
        price_adjustment: 0,
        stock_quantity: 35,
        image_url: productBySlug["boxy-linen-top"].images[0],
      },
      {
        product_id: productBySlug["cropped-knit-tee"].id,
        color: "Cream",
        size: "S",
        sku: "TEE-CRM-S",
        price_adjustment: 0,
        stock_quantity: 30,
        image_url: productBySlug["cropped-knit-tee"].images[0],
      },
      {
        product_id: productBySlug["cropped-knit-tee"].id,
        color: "Cream",
        size: "M",
        sku: "TEE-CRM-M",
        price_adjustment: 0,
        stock_quantity: 28,
        image_url: productBySlug["cropped-knit-tee"].images[0],
      },
      {
        product_id: productBySlug["leather-strap-watch"].id,
        color: "Brown",
        size: null,
        sku: "WAT-BRN-ONE",
        price_adjustment: 0,
        stock_quantity: 15,
        image_url: productBySlug["leather-strap-watch"].images[0],
      },
      {
        product_id: productBySlug["field-chronograph-watch"].id,
        color: "Black",
        size: null,
        sku: "WAT-FLD-ONE",
        price_adjustment: 0,
        stock_quantity: 18,
        image_url: productBySlug["field-chronograph-watch"].images[0],
      },
      {
        product_id: productBySlug["everyday-tote-bag"].id,
        color: "Black",
        size: null,
        sku: "BAG-BLK-ONE",
        price_adjustment: 0,
        stock_quantity: 28,
        image_url: productBySlug["everyday-tote-bag"].images[0],
      },
      {
        product_id: productBySlug["compact-crossbody-bag"].id,
        color: "Tan",
        size: null,
        sku: "BAG-TAN-ONE",
        price_adjustment: 0,
        stock_quantity: 24,
        image_url: productBySlug["compact-crossbody-bag"].images[0],
      },
    ];

    const createdVariants = await ProductVariant.bulkCreate(variantSeed, { returning: true });
    const variantBySku = {};
    createdVariants.forEach((variant) => {
      variantBySku[variant.sku] = variant;
    });

    const promotions = await Promotion.bulkCreate(
      [
        {
          code: "WELCOME10",
          discount_type: "percent",
          discount_value: 10,
          start_date: new Date(),
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 2)),
          applicable_to: "order",
          usage_limit: 500,
        },
        {
          code: "FREESHIP",
          discount_type: "fixed",
          discount_value: 5.0,
          start_date: new Date(),
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          applicable_to: "shipping",
          usage_limit: 200,
        },
        {
          code: "SUMMER15",
          discount_type: "percent",
          discount_value: 15,
          start_date: new Date(),
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 3)),
          applicable_to: "order",
          usage_limit: 300,
        },
        {
          code: "BAG20",
          discount_type: "percent",
          discount_value: 20,
          start_date: new Date(),
          end_date: new Date(new Date().setMonth(new Date().getMonth() + 1)),
          applicable_to: "product",
          usage_limit: 150,
        },
      ],
      { returning: true }
    );

    const carts = await Cart.bulkCreate(
      [
        { user_id: users[0].id },
        { user_id: users[2].id },
        { user_id: users[3].id },
      ],
      { returning: true }
    );

    await CartItem.bulkCreate([
      {
        cart_id: carts[0].id,
        product_variant_id: variantBySku["ESS-WHT-M"].id,
        quantity: 2,
      },
      {
        cart_id: carts[0].id,
        product_variant_id: variantBySku["BAG-BLK-ONE"].id,
        quantity: 1,
      },
      {
        cart_id: carts[1].id,
        product_variant_id: variantBySku["JOG-CHR-M"].id,
        quantity: 1,
      },
      {
        cart_id: carts[1].id,
        product_variant_id: variantBySku["SKT-BLS-M"].id,
        quantity: 1,
      },
      {
        cart_id: carts[2].id,
        product_variant_id: variantBySku["TEE-CRM-S"].id,
        quantity: 3,
      },
    ]);

    const order1Subtotal = 49.99 * 2 + 79.99;
    const order1Discount = 18.0;
    const order1Total = parseFloat((order1Subtotal - order1Discount).toFixed(2));

    const order2Subtotal = 69.99 + 79.99;
    const order2Discount = 15.0;
    const order2Total = parseFloat((order2Subtotal - order2Discount).toFixed(2));

    const order3Subtotal = 39.99 * 3 + 219.99;
    const order3Discount = 30.0;
    const order3Total = parseFloat((order3Subtotal - order3Discount).toFixed(2));

    const orders = await Order.bulkCreate(
      [
        {
          user_id: users[0].id,
          shipping_address_id: addresses[0].id,
          subtotal_amount: order1Subtotal,
          discount_amount: order1Discount,
          total_amount: order1Total,
          status: "paid",
          promotion_code: promotions[0].code,
          notes: "Seed order for demo - Alice",
        },
        {
          user_id: users[2].id,
          shipping_address_id: addresses[2].id,
          subtotal_amount: order2Subtotal,
          discount_amount: order2Discount,
          total_amount: order2Total,
          status: "processing",
          promotion_code: promotions[2].code,
          notes: "Seed order for demo - Bob",
        },
        {
          user_id: users[3].id,
          shipping_address_id: addresses[3].id,
          subtotal_amount: order3Subtotal,
          discount_amount: order3Discount,
          total_amount: order3Total,
          status: "paid",
          promotion_code: promotions[1].code,
          notes: "Seed order for demo - Charlie",
        },
      ],
      { returning: true }
    );

    await OrderItem.bulkCreate([
      {
        order_id: orders[0].id,
        product_id: productBySlug["essential-cotton-shirt"].id,
        product_variant_id: variantBySku["ESS-WHT-M"].id,
        name_snapshot: productBySlug["essential-cotton-shirt"].name,
        sku_snapshot: "ESS-WHT-M",
        color_snapshot: "White",
        size_snapshot: "M",
        unit_price: 49.99,
        quantity: 2,
        line_total: 99.98,
      },
      {
        order_id: orders[0].id,
        product_id: productBySlug["slim-chino-pants"].id,
        product_variant_id: variantBySku["CHI-KHA-32"].id,
        name_snapshot: productBySlug["slim-chino-pants"].name,
        sku_snapshot: "CHI-KHA-32",
        color_snapshot: "Khaki",
        size_snapshot: "32",
        unit_price: 79.99,
        quantity: 1,
        line_total: 79.99,
      },
      {
        order_id: orders[1].id,
        product_id: productBySlug["tech-stretch-joggers"].id,
        product_variant_id: variantBySku["JOG-CHR-M"].id,
        name_snapshot: productBySlug["tech-stretch-joggers"].name,
        sku_snapshot: "JOG-CHR-M",
        color_snapshot: "Charcoal",
        size_snapshot: "M",
        unit_price: 69.99,
        quantity: 1,
        line_total: 69.99,
      },
      {
        order_id: orders[1].id,
        product_id: productBySlug["layered-midi-skirt"].id,
        product_variant_id: variantBySku["SKT-BLS-M"].id,
        name_snapshot: productBySlug["layered-midi-skirt"].name,
        sku_snapshot: "SKT-BLS-M",
        color_snapshot: "Blush",
        size_snapshot: "M",
        unit_price: 79.99,
        quantity: 1,
        line_total: 79.99,
      },
      {
        order_id: orders[2].id,
        product_id: productBySlug["cropped-knit-tee"].id,
        product_variant_id: variantBySku["TEE-CRM-S"].id,
        name_snapshot: productBySlug["cropped-knit-tee"].name,
        sku_snapshot: "TEE-CRM-S",
        color_snapshot: "Cream",
        size_snapshot: "S",
        unit_price: 39.99,
        quantity: 3,
        line_total: 119.97,
      },
      {
        order_id: orders[2].id,
        product_id: productBySlug["leather-strap-watch"].id,
        product_variant_id: variantBySku["WAT-BRN-ONE"].id,
        name_snapshot: productBySlug["leather-strap-watch"].name,
        sku_snapshot: "WAT-BRN-ONE",
        color_snapshot: "Brown",
        size_snapshot: null,
        unit_price: 219.99,
        quantity: 1,
        line_total: 219.99,
      },
    ]);

    await Payment.bulkCreate([
      {
        order_id: orders[0].id,
        provider: "stripe",
        provider_txn_id: "seed_txn_001",
        amount: order1Total,
        currency: "USD",
        status: "succeeded",
        raw_payload: { demo: true },
      },
      {
        order_id: orders[1].id,
        provider: "stripe",
        provider_txn_id: "seed_txn_002",
        amount: order2Total,
        currency: "USD",
        status: "pending",
        raw_payload: { demo: true },
      },
      {
        order_id: orders[2].id,
        provider: "stripe",
        provider_txn_id: "seed_txn_003",
        amount: order3Total,
        currency: "USD",
        status: "succeeded",
        raw_payload: { demo: true },
      },
    ]);

    await Review.bulkCreate([
      {
        user_id: users[0].id,
        product_id: productBySlug["essential-cotton-shirt"].id,
        rating: 5,
        comment: "Great fit and fabric, perfect for daily wear.",
        images: [],
      },
      {
        user_id: users[1].id,
        product_id: productBySlug["leather-strap-watch"].id,
        rating: 4,
        comment: "Clean design, strap feels premium.",
        images: [],
      },
      {
        user_id: users[2].id,
        product_id: productBySlug["tech-stretch-joggers"].id,
        rating: 5,
        comment: "Super comfortable for flights and long days.",
        images: [],
      },
      {
        user_id: users[3].id,
        product_id: productBySlug["cropped-knit-tee"].id,
        rating: 4,
        comment: "Nice weight and color, runs a bit short.",
        images: [],
      },
      {
        user_id: users[4].id,
        product_id: productBySlug["everyday-tote-bag"].id,
        rating: 5,
        comment: "Perfect everyday bag, fits my laptop and more.",
        images: [],
      },
    ]);

    console.log("Seeding finished");
    console.log(`   Users: ${await User.count()}`);
    console.log(`   Addresses: ${await ShippingAddress.count()}`);
    console.log(`   Categories: ${await Category.count()}`);
    console.log(`   Products: ${await Product.count()}`);
    console.log(`   Variants: ${await ProductVariant.count()}`);
    console.log(`   Carts: ${await Cart.count()}`);
    console.log(`   Cart items: ${await CartItem.count()}`);
    console.log(`   Orders: ${await Order.count()}`);
    console.log(`   Order items: ${await OrderItem.count()}`);
    console.log(`   Payments: ${await Payment.count()}`);
    console.log(`   Promotions: ${await Promotion.count()}`);
    console.log(`   Reviews: ${await Review.count()}`);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    await sequelize.close();
    process.exit(1);
  }
};

const isMainModule =
  process.argv[1] &&
  (process.argv[1].endsWith("seedData.js") || process.argv[1].includes("seedData.js"));

if (isMainModule) {
  seedData();
}

export { seedData };
