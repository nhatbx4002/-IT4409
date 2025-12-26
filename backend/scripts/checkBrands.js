import { Product, sequelize } from "../models/index.js";

async function checkBrands() {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'name', 'brand'],
      where: {
        brand: {
          [require('sequelize').Op.ne]: null
        }
      },
      limit: 20,
      order: [['id', 'ASC']]
    });

    console.log(`Found ${products.length} products with brands:\n`);
    const brands = new Set();
    products.forEach(p => {
      brands.add(p.brand);
      console.log(`  - ${p.name}: ${p.brand}`);
    });

    console.log(`\n✅ Unique brands (${brands.size}):`);
    Array.from(brands).sort().forEach(b => console.log(`  - ${b}`));

    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

checkBrands();
