import { Product } from "../models/index.js";
import { Op } from "sequelize";

async function addSampleBrands() {
  try {
    // Get some products and update them with brands
    const products = await Product.findAll({
      where: {
        brand: {
          [Op.or]: [null, '']
        }
      },
      limit: 8
    });

    if (products.length === 0) {
      console.log('No products found without brands. All products may already have brands.');
      process.exit(0);
    }

    const brands = ['Nike', 'Adidas', 'Puma', 'Zara', 'H&M', 'Uniqlo', 'Mango', 'Gucci'];

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      const brand = brands[i % brands.length];
      await product.update({ brand });
      console.log(`Updated product "${product.name}" with brand: ${brand}`);
    }

    console.log('\n✅ Sample brands added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addSampleBrands();
