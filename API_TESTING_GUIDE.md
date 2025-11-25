# Hướng dẫn Test API

## 1. Kiểm tra Backend Server

Đảm bảo backend server đang chạy:
```bash
cd backend
npm run dev
# Hoặc
npm start
```

Server sẽ chạy tại: `http://localhost:3000`

Test server đang hoạt động:
```bash
curl http://localhost:3000/
```

---

## 2. Test với Thunder Client (VS Code Extension) - Khuyến nghị

### Cài đặt:
1. Mở VS Code
2. Extensions → Tìm "Thunder Client"
3. Install

### Test các endpoints:

#### **Endpoint 1: Search Products**
```
Method: GET
URL: http://localhost:3000/api/user/product/search
Query Params:
  - q: "shirt" (optional)
  - collection: "men" (optional: men/women/accessories)
  - sizes: "M,L" (comma-separated)
  - colors: "red,blue" (comma-separated)
  - priceMin: 10
  - priceMax: 100
  - brands: "Nike,Adidas" (comma-separated)
  - inStockOnly: true
  - sort: "featured" (featured/newest/price-low/price-high/popular)
  - page: 1
  - pageSize: 12
```

**Ví dụ URL đầy đủ:**
```
http://localhost:3000/api/user/product/search?collection=men&sort=price-low&page=1&pageSize=12
```
#### **Endpoint 2: Get Products by Category**
```
Method: GET
URL: http://localhost:3000/api/user/product/category/{slug}
Query Params: (tương tự như search)
  - collection: "men"
  - sizes: "M,L"
  - colors: "red,blue"
  - priceMin: 10
  - priceMax: 100
  - brands: "Nike"
  - inStockOnly: true
  - sort: "newest"
  - page: 1
  - pageSize: 12
```

**Ví dụ URL đầy đủ:**
```
http://localhost:3000/api/user/product/category/shirts?collection=men&sort=price-low&page=1
```

#### **Endpoint 3: Get Product Detail**
```
Method: GET
URL: http://localhost:3000/api/user/product/{productId}
```

**Ví dụ URL đầy đủ:**
```
http://localhost:3000/api/user/product/1
```

---

## 3. Test với Postman

### Import Collection:
1. Mở Postman
2. File → Import
3. Tạo collection mới với các requests:

#### Request 1: Search Products
- Method: `GET`
- URL: `http://localhost:3000/api/user/product/search`
- Params tab:
  - `q`: `shirt`
  - `collection`: `men`
  - `sort`: `price-low`
  - `page`: `1`
  - `pageSize`: `12`

#### Request 2: Get Products by Category
- Method: `GET`
- URL: `http://localhost:3000/api/user/product/category/shirts`
- Params tab:
  - `collection`: `men`
  - `sort`: `newest`
  - `page`: `1`

#### Request 3: Get Product Detail
- Method: `GET`
- URL: `http://localhost:3000/api/user/product/1`

---

## 4. Test với cURL (Command Line)

### Search Products:
```bash
curl "http://localhost:3000/api/user/product/search?collection=men&sort=price-low&page=1&pageSize=12"
```

### Get Products by Category:
```bash
curl "http://localhost:3000/api/user/product/category/shirts?collection=men&sort=newest"
```

### Get Product Detail:
```bash
curl "http://localhost:3000/api/user/product/1"
```

### Với query params phức tạp:
```bash
curl "http://localhost:3000/api/user/product/search?collection=men&sizes=M,L&colors=red,blue&priceMin=10&priceMax=100&sort=price-low&page=1&pageSize=12"
```

### Format JSON output (Windows PowerShell):
```powershell
curl "http://localhost:3000/api/user/product/search?collection=men" | ConvertFrom-Json | ConvertTo-Json -Depth 10
```

---

## 5. Test với Browser DevTools

1. Mở browser (Chrome/Firefox)
2. F12 → Console tab
3. Chạy JavaScript:

```javascript
// Test Search Products
fetch('http://localhost:3000/api/user/product/search?collection=men&sort=price-low&page=1&pageSize=12')
  .then(res => res.json())
  .then(data => console.log('Search Results:', data))
  .catch(err => console.error('Error:', err));

// Test Get Products by Category
fetch('http://localhost:3000/api/user/product/category/shirts?collection=men')
  .then(res => res.json())
  .then(data => console.log('Category Results:', data))
  .catch(err => console.error('Error:', err));

// Test Get Product Detail
fetch('http://localhost:3000/api/user/product/1')
  .then(res => res.json())
  .then(data => console.log('Product Detail:', data))
  .catch(err => console.error('Error:', err));
```

---

## 6. Test Script (Node.js)

Tạo file `test-api.js` trong thư mục `backend`:

```javascript
import axios from 'axios';

const BASE_URL = 'http://localhost:3000/api/user/product';

async function testAPI() {
  try {
    console.log('🧪 Testing Product APIs...\n');

    // Test 1: Search Products
    console.log('1️⃣ Testing Search Products...');
    const searchResponse = await axios.get(`${BASE_URL}/search`, {
      params: {
        collection: 'men',
        sort: 'price-low',
        page: 1,
        pageSize: 12
      }
    });
    console.log('✅ Search Results:', {
      success: searchResponse.data.success,
      total: searchResponse.data.data?.total,
      productsCount: searchResponse.data.data?.products?.length
    });

    // Test 2: Get Products by Category
    console.log('\n2️⃣ Testing Get Products by Category...');
    const categoryResponse = await axios.get(`${BASE_URL}/category/shirts`, {
      params: {
        collection: 'men',
        sort: 'newest'
      }
    });
    console.log('✅ Category Results:', {
      success: categoryResponse.data.success,
      total: categoryResponse.data.data?.total,
      productsCount: categoryResponse.data.data?.products?.length
    });

    // Test 3: Get Product Detail
    console.log('\n3️⃣ Testing Get Product Detail...');
    const detailResponse = await axios.get(`${BASE_URL}/1`);
    console.log('✅ Product Detail:', {
      success: detailResponse.data.success,
      productName: detailResponse.data.data?.name,
      hasVariants: detailResponse.data.data?.variants?.length > 0
    });

    console.log('\n✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();
```

Chạy script:
```bash
cd backend
node test-api.js
```

---

## 7. Test từ Frontend (React DevTools)

1. Mở frontend app: `http://localhost:5173`
2. F12 → Network tab
3. Navigate đến page sử dụng API (ví dụ: `/collections/men`)
4. Xem requests trong Network tab
5. Click vào request → Preview/Response tab để xem data

---

## 8. Expected Response Format

### Success Response:
```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1,
        "slug": "product-slug",
        "name": "Product Name",
        "brand": "Brand Name",
        "collection": "men",
        "category": {
          "id": 1,
          "name": "Category Name",
          "slug": "category-slug"
        },
        "price": 99.99,
        "salePrice": 79.99,
        "discountPercent": 20,
        "images": ["url1", "url2"],
        "colors": ["red", "blue"],
        "sizes": ["M", "L"],
        "rating": 0,
        "reviewCount": 0,
        "isNew": true,
        "inStock": true,
        "tags": ["tag1", "tag2"],
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 12,
    "totalPages": 9
  },
  "message": "Products fetched successfully"
}
```

### Error Response:
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## 9. Common Issues & Solutions

### Issue 1: CORS Error
**Error:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**Solution:** Đảm bảo backend đã cấu hình CORS (đã implement trong `backend/api.js`)

### Issue 2: Connection Refused
**Error:** `ECONNREFUSED` hoặc `Failed to fetch`

**Solution:** 
- Kiểm tra backend server đang chạy: `http://localhost:3000`
- Kiểm tra port trong `.env` file

### Issue 3: 404 Not Found
**Error:** `Route not found`

**Solution:**
- Kiểm tra URL đúng format: `/api/user/product/...`
- Kiểm tra route đã được register trong `backend/routes/api.js`

### Issue 4: Empty Results
**Solution:**
- Đảm bảo đã chạy migration: `node backend/migrations/addProductFields.js`
- Đảm bảo đã seed data: `node backend/scripts/seedProducts.js`

---

## 10. Quick Test Checklist

- [ ] Backend server đang chạy (`http://localhost:3000`)
- [ ] Database đã được migrate và seeded
- [ ] Test endpoint `/api/user/product/search` với collection filter
- [ ] Test endpoint `/api/user/product/category/{slug}` với category slug
- [ ] Test endpoint `/api/user/product/{id}` với product ID
- [ ] Kiểm tra response format đúng
- [ ] Kiểm tra error handling (invalid params, not found, etc.)
- [ ] Test filters: sizes, colors, price range, brands
- [ ] Test sorting: featured, newest, price-low, price-high
- [ ] Test pagination: page, pageSize

---

## Tips

1. **Sử dụng Thunder Client** - Dễ nhất và tích hợp với VS Code
2. **Kiểm tra Network tab** - Xem request/response thực tế từ frontend
3. **Test từng filter riêng** - Để dễ debug
4. **Log trong backend** - Thêm `console.log` trong controllers để debug
5. **Validate data** - Đảm bảo database có data trước khi test

