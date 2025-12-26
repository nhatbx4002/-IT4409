import { getCategories, flattenCategories } from './lib/categories';
import { getBrands } from './lib/products';

async function testAPIs() {
  console.log('🧪 Testing API endpoints...\n');

  try {
    // Test Categories
    console.log('1️⃣ Testing Categories API...');
    const categories = await getCategories();
    console.log('✅ Categories:', categories);
    console.log(`📊 Total categories: ${categories.length}`);

    const flattened = flattenCategories(categories);
    console.log('📋 Flattened categories:', flattened);
    console.log(`📊 Total flattened: ${flattened.length}\n`);

    // Test Brands
    console.log('2️⃣ Testing Brands API...');
    const brands = await getBrands();
    console.log('✅ Brands:', brands);
    console.log(`📊 Total brands: ${brands.length}\n`);

    console.log('✅ All APIs working correctly!');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run test
testAPIs();
