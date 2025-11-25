import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env file from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../../.env") });

import { sequelize, Category, Product, ProductVariant } from "../models/index.js";
import { QueryTypes } from "sequelize";

/**
 * Seed script: Create sample data for products
 * - Categories with hierarchy (men/women/accessories and subcategories)
 * - Products with full information
 * - ProductVariants with colors and sizes
 */
const seedProducts = async () => {
  try {
    console.log("🔄 Starting seed script...");

    // Check database connection
    await sequelize.authenticate();
    console.log("✅ Database connected!");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🗑️  Clearing existing data...");
    
    // Delete in correct order to handle foreign key constraints
    // Use raw SQL to delete related data first
    try {
      // Delete wishlists if table exists
      await sequelize.query('DELETE FROM wishlists', {
        type: QueryTypes.DELETE,
      }).catch(() => {
        // Table might not exist, ignore error
      });
      
      // Delete cart items that reference products (if exists)
      await sequelize.query('DELETE FROM cart_items WHERE product_id IS NOT NULL', {
        type: QueryTypes.DELETE,
      }).catch(() => {
        // Table might not exist, ignore error
      });
      
      // Delete order items that reference products (if exists)
      await sequelize.query('DELETE FROM order_items WHERE product_id IS NOT NULL', {
        type: QueryTypes.DELETE,
      }).catch(() => {
        // Table might not exist, ignore error
      });
      
      // Delete reviews that reference products
      await sequelize.query('DELETE FROM reviews WHERE product_id IS NOT NULL', {
        type: QueryTypes.DELETE,
      }).catch(() => {
        // Table might not exist, ignore error
      });
    } catch (error) {
      console.warn("⚠️  Warning when clearing related data:", error.message);
    }
    
    // Then delete product variants (has CASCADE, but delete explicitly to be safe)
    try {
      await ProductVariant.destroy({ where: {}, force: true });
    } catch (error) {
      // If destroy fails, try raw SQL
      await sequelize.query('DELETE FROM product_variants', {
        type: QueryTypes.DELETE,
      });
    }
    
    // Finally delete products
    try {
      await Product.destroy({ where: {}, force: true });
    } catch (error) {
      // If destroy fails, try raw SQL
      await sequelize.query('DELETE FROM products', {
        type: QueryTypes.DELETE,
      });
    }
    
    // Delete categories (after products are deleted)
    try {
      await Category.destroy({ where: {}, force: true });
    } catch (error) {
      // If destroy fails, try raw SQL
      await sequelize.query('DELETE FROM categories', {
        type: QueryTypes.DELETE,
      });
    }
    
    console.log("✅ Existing data cleared!");

    // ============================================
    // CREATE CATEGORIES
    // ============================================
    console.log("📁 Creating categories...");

    // Parent categories
    const menCategory = await Category.create({
      name: "Men",
      slug: "men",
      parent_id: null,
    });

    const womenCategory = await Category.create({
      name: "Women",
      slug: "women",
      parent_id: null,
    });

    const accessoriesCategory = await Category.create({
      name: "Accessories",
      slug: "accessories",
      parent_id: null,
    });

    // Men subcategories
    const menShirts = await Category.create({
      name: "Shirts",
      slug: "shirts",
      parent_id: menCategory.id,
    });

    const menPants = await Category.create({
      name: "Pants",
      slug: "pants",
      parent_id: menCategory.id,
    });

    const menSuits = await Category.create({
      name: "Suits",
      slug: "suits",
      parent_id: menCategory.id,
    });

    const menShoes = await Category.create({
      name: "Shoes",
      slug: "shoes",
      parent_id: menCategory.id,
    });

    // Women subcategories
    const womenDresses = await Category.create({
      name: "Dresses",
      slug: "dresses",
      parent_id: womenCategory.id,
    });

    const womenBlouses = await Category.create({
      name: "Blouses",
      slug: "blouses",
      parent_id: womenCategory.id,
    });

    const womenPants = await Category.create({
      name: "Pants",
      slug: "pants",
      parent_id: womenCategory.id,
    });

    // Accessories subcategories
    const watchesCategory = await Category.create({
      name: "Watches",
      slug: "watches",
      parent_id: accessoriesCategory.id,
    });

    const bagsCategory = await Category.create({
      name: "Bags",
      slug: "bags",
      parent_id: accessoriesCategory.id,
    });

    console.log("✅ Categories created!");

    // ============================================
    // HELPER FUNCTION: Generate slug from name
    // ============================================
    const generateSlug = (name) => {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    };

    // ============================================
    // CREATE PRODUCTS
    // ============================================
    console.log("📦 Creating products...");

    const productsData = [
      // MEN - SHIRTS
      {
        name: "Classic White Dress Shirt",
        slug: "classic-white-dress-shirt",
        description: "Premium cotton dress shirt with classic fit. Perfect for business and formal occasions.",
        brand: "Elegance",
        base_price: 89.99,
        sale_price: 69.99,
        category_id: menShirts.id,
        collection: "men",
        is_new: false,
        tags: ["formal", "business", "cotton"],
        images: [
          "https://images.unsplash.com/photo-1594938291221-94f18ba8b130?w=800",
          "https://images.unsplash.com/photo-1594938291221-94f18ba8b130?w=800",
        ],
      },
      {
        name: "Casual Blue Denim Shirt",
        slug: "casual-blue-denim-shirt",
        description: "Comfortable denim shirt for everyday wear. Versatile and stylish.",
        brand: "Urban Style",
        base_price: 59.99,
        category_id: menShirts.id,
        collection: "men",
        is_new: true,
        tags: ["casual", "denim", "everyday"],
        images: [
          "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800",
        ],
      },
      {
        name: "Striped Business Shirt",
        slug: "striped-business-shirt",
        description: "Professional striped shirt with modern fit. Ideal for office wear.",
        brand: "Professional",
        base_price: 79.99,
        category_id: menShirts.id,
        collection: "men",
        is_new: false,
        tags: ["business", "striped", "office"],
        images: [
          "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800",
        ],
      },

      // MEN - PANTS
      {
        name: "Slim Fit Chino Pants",
        slug: "slim-fit-chino-pants",
        description: "Comfortable chino pants with slim fit. Perfect for smart casual occasions.",
        brand: "Modern Fit",
        base_price: 99.99,
        sale_price: 79.99,
        category_id: menPants.id,
        collection: "men",
        is_new: false,
        tags: ["casual", "chino", "slim-fit"],
        images: [
          "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800",
        ],
      },
      {
        name: "Classic Dress Pants",
        slug: "classic-dress-pants",
        description: "Professional dress pants with classic fit. Essential for business wardrobe.",
        brand: "Elegance",
        base_price: 129.99,
        category_id: menPants.id,
        collection: "men",
        is_new: false,
        tags: ["formal", "business", "dress"],
        images: [
          "https://images.unsplash.com/photo-1594938291221-94f18ba8b130?w=800",
        ],
      },
      {
        name: "Cargo Pants",
        slug: "cargo-pants",
        description: "Functional cargo pants with multiple pockets. Great for outdoor activities.",
        brand: "Adventure",
        base_price: 89.99,
        category_id: menPants.id,
        collection: "men",
        is_new: true,
        tags: ["casual", "cargo", "outdoor"],
        images: [
          "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=800",
        ],
      },

      // MEN - SUITS
      {
        name: "Classic Navy Suit",
        slug: "classic-navy-suit",
        description: "Elegant navy suit with perfect tailoring. Ideal for formal events and business.",
        brand: "Premium Tailor",
        base_price: 599.99,
        sale_price: 449.99,
        category_id: menSuits.id,
        collection: "men",
        is_new: false,
        tags: ["formal", "suit", "navy", "premium"],
        images: [
          "https://images.unsplash.com/photo-1594938291221-94f18ba8b130?w=800",
        ],
      },
      {
        name: "Black Tuxedo",
        slug: "black-tuxedo",
        description: "Sophisticated black tuxedo for special occasions. Premium quality fabric.",
        brand: "Luxury",
        base_price: 799.99,
        category_id: menSuits.id,
        collection: "men",
        is_new: false,
        tags: ["formal", "tuxedo", "luxury", "black-tie"],
        images: [
          "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800",
        ],
      },

      // MEN - SHOES
      {
        name: "Leather Oxford Shoes",
        slug: "leather-oxford-shoes",
        description: "Classic leather oxford shoes. Timeless design for business and formal wear.",
        brand: "Classic Footwear",
        base_price: 199.99,
        sale_price: 149.99,
        category_id: menShoes.id,
        collection: "men",
        is_new: false,
        tags: ["formal", "leather", "oxford"],
        images: [
          "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800",
        ],
      },
      {
        name: "Casual Sneakers",
        slug: "casual-sneakers",
        description: "Comfortable casual sneakers for everyday wear. Modern design.",
        brand: "Urban Style",
        base_price: 89.99,
        category_id: menShoes.id,
        collection: "men",
        is_new: true,
        tags: ["casual", "sneakers", "everyday"],
        images: [
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
        ],
      },

      // WOMEN - DRESSES
      {
        name: "Elegant Evening Dress",
        slug: "elegant-evening-dress",
        description: "Beautiful evening dress perfect for special occasions. Flowing design with elegant details.",
        brand: "Fashion Forward",
        base_price: 299.99,
        sale_price: 229.99,
        category_id: womenDresses.id,
        collection: "women",
        is_new: false,
        tags: ["evening", "elegant", "formal"],
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
        ],
      },
      {
        name: "Summer Floral Dress",
        slug: "summer-floral-dress",
        description: "Light and airy summer dress with floral pattern. Perfect for warm weather.",
        brand: "Summer Collection",
        base_price: 79.99,
        category_id: womenDresses.id,
        collection: "women",
        is_new: true,
        tags: ["summer", "floral", "casual"],
        images: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
        ],
      },
      {
        name: "Business Professional Dress",
        slug: "business-professional-dress",
        description: "Professional dress for office wear. Classic and sophisticated design.",
        brand: "Professional",
        base_price: 149.99,
        category_id: womenDresses.id,
        collection: "women",
        is_new: false,
        tags: ["business", "professional", "office"],
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
        ],
      },

      // WOMEN - BLOUSES
      {
        name: "Silk Blouse",
        slug: "silk-blouse",
        description: "Luxurious silk blouse with elegant design. Perfect for business and formal occasions.",
        brand: "Luxury",
        base_price: 179.99,
        sale_price: 139.99,
        category_id: womenBlouses.id,
        collection: "women",
        is_new: false,
        tags: ["silk", "luxury", "business"],
        images: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
        ],
      },
      {
        name: "Casual Cotton Blouse",
        slug: "casual-cotton-blouse",
        description: "Comfortable cotton blouse for everyday wear. Versatile and stylish.",
        brand: "Everyday",
        base_price: 59.99,
        category_id: womenBlouses.id,
        collection: "women",
        is_new: true,
        tags: ["casual", "cotton", "everyday"],
        images: [
          "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800",
        ],
      },

      // WOMEN - PANTS
      {
        name: "High-Waisted Trousers",
        slug: "high-waisted-trousers",
        description: "Stylish high-waisted trousers with modern fit. Perfect for office and casual wear.",
        brand: "Modern Fit",
        base_price: 119.99,
        category_id: womenPants.id,
        collection: "women",
        is_new: false,
        tags: ["business", "high-waisted", "modern"],
        images: [
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800",
        ],
      },
      {
        name: "Skinny Jeans",
        slug: "skinny-jeans",
        description: "Classic skinny jeans with perfect fit. Essential for every wardrobe.",
        brand: "Denim Co",
        base_price: 89.99,
        sale_price: 69.99,
        category_id: womenPants.id,
        collection: "women",
        is_new: false,
        tags: ["casual", "jeans", "skinny"],
        images: [
          "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800",
        ],
      },

      // ACCESSORIES - WATCHES
      {
        name: "Classic Leather Watch",
        slug: "classic-leather-watch",
        description: "Timeless leather watch with elegant design. Perfect for business and casual wear.",
        brand: "Timepiece",
        base_price: 299.99,
        sale_price: 249.99,
        category_id: watchesCategory.id,
        collection: "accessories",
        is_new: false,
        tags: ["watch", "leather", "classic"],
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
        ],
      },
      {
        name: "Sport Watch",
        slug: "sport-watch",
        description: "Durable sport watch with water resistance. Great for active lifestyle.",
        brand: "Active",
        base_price: 199.99,
        category_id: watchesCategory.id,
        collection: "accessories",
        is_new: true,
        tags: ["watch", "sport", "waterproof"],
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
        ],
      },
      {
        name: "Luxury Gold Watch",
        slug: "luxury-gold-watch",
        description: "Premium gold watch with diamond accents. Ultimate luxury timepiece.",
        brand: "Luxury",
        base_price: 2999.99,
        category_id: watchesCategory.id,
        collection: "accessories",
        is_new: false,
        tags: ["watch", "luxury", "gold", "diamond"],
        images: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
        ],
      },

      // ACCESSORIES - BAGS
      {
        name: "Leather Handbag",
        slug: "leather-handbag",
        description: "Elegant leather handbag with spacious interior. Perfect for everyday use.",
        brand: "Elegance",
        base_price: 249.99,
        sale_price: 199.99,
        category_id: bagsCategory.id,
        collection: "accessories",
        is_new: false,
        tags: ["bag", "leather", "handbag"],
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        ],
      },
      {
        name: "Designer Tote Bag",
        slug: "designer-tote-bag",
        description: "Stylish designer tote bag. Spacious and fashionable.",
        brand: "Fashion Forward",
        base_price: 179.99,
        category_id: bagsCategory.id,
        collection: "accessories",
        is_new: true,
        tags: ["bag", "tote", "designer"],
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        ],
      },
      {
        name: "Business Briefcase",
        slug: "business-briefcase",
        description: "Professional business briefcase. Durable and functional design.",
        brand: "Professional",
        base_price: 349.99,
        category_id: bagsCategory.id,
        collection: "accessories",
        is_new: false,
        tags: ["bag", "briefcase", "business"],
        images: [
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800",
        ],
      },
    ];

    const createdProducts = [];
    for (const productData of productsData) {
      const product = await Product.create(productData);
      createdProducts.push(product);
    }

    console.log(`✅ Created ${createdProducts.length} products!`);

    // ============================================
    // CREATE PRODUCT VARIANTS
    // ============================================
    console.log("🎨 Creating product variants...");

    const colors = ["Black", "White", "Navy", "Gray", "Brown", "Beige", "Red", "Blue"];
    const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
    const shoeSizes = ["38", "39", "40", "41", "42", "43", "44", "45"];

    let variantCount = 0;

    for (const product of createdProducts) {
      // Determine sizes based on category
      let availableSizes = sizes;
      if (product.category_id === menShoes.id || product.category_id === watchesCategory.id) {
        // Watches and shoes don't need size variants, or use different sizes
        availableSizes = [];
      }

      // Determine colors based on product type
      let availableColors = colors;
      if (product.name.includes("White") || product.name.includes("Navy") || product.name.includes("Black")) {
        // If product name already specifies color, use that as primary
        availableColors = colors.slice(0, 4); // Limit to 4 colors
      }

      // Create 2-4 variants per product
      const numVariants = Math.floor(Math.random() * 3) + 2; // 2-4 variants
      const selectedColors = availableColors.slice(0, numVariants);
      const selectedSizes = availableSizes.length > 0 
        ? availableSizes.slice(0, Math.min(numVariants, availableSizes.length))
        : [null]; // For products without sizes

      for (let i = 0; i < numVariants; i++) {
        const color = selectedColors[i] || selectedColors[0];
        const size = selectedSizes[i] || selectedSizes[0] || null;

        // Generate SKU
        const sku = `${product.slug.toUpperCase().substring(0, 5)}-${color.substring(0, 3).toUpperCase()}-${size || "ONE"}`;

        // Price adjustment (some variants cost more)
        const priceAdjustment = Math.random() > 0.7 ? parseFloat((Math.random() * 20 - 10).toFixed(2)) : 0;

        // Stock quantity
        const stockQuantity = Math.floor(Math.random() * 50) + 10; // 10-60 units

        // Image URL (using product image with variant-specific URL if needed)
        const imageUrl = product.images[0] || null;

        await ProductVariant.create({
          product_id: product.id,
          color: color,
          size: size,
          sku: sku,
          price_adjustment: priceAdjustment,
          stock_quantity: stockQuantity,
          image_url: imageUrl,
        });

        variantCount++;
      }
    }

    console.log(`✅ Created ${variantCount} product variants!`);

    console.log("✅ Seed script completed successfully!");
    console.log(`📊 Summary:`);
    console.log(`   - Categories: ${await Category.count()}`);
    console.log(`   - Products: ${await Product.count()}`);
    console.log(`   - Variants: ${await ProductVariant.count()}`);

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seed script failed:", error);
    await sequelize.close();
    process.exit(1);
  }
};

// Run seed script if called directly
// Usage: node backend/scripts/seedProducts.js
const isMainModule = process.argv[1] && (
  process.argv[1].endsWith('seedProducts.js') || 
  process.argv[1].includes('seedProducts.js')
);

if (isMainModule) {
  seedProducts();
}

export { seedProducts };

