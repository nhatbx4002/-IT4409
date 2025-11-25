# Kế hoạch Tích hợp Backend-Frontend cho Hệ thống Sản phẩm

## 1. Phân tích hiện trạng

### Backend hiện có:
- **Models**: Product, ProductVariant, Category, Review (Review API sẽ triển khai sau)
- **API Endpoints**:
  - `GET /api/user/product/search?q=...&name=...&brand=...`
  - `GET /api/user/product/category/:slug`
  - `GET /api/user/product/:productId`
- **Dữ liệu trả về**: Tóm tắt sản phẩm với variants và category
- **

### Frontend yêu cầu (ĐÃ CẬP NHẬT):
- **ProductSummary Interface** (cho list): id (number), slug, name, brand, collection, category (CategorySummary | null), price, salePrice, discountPercent, images, colors (string[]), sizes (string[]), rating, reviewCount, isNew, inStock, tags, createdAt, updatedAt
- **ProductDetail Interface** (cho detail): extends ProductSummary + description, variants (ProductVariantDetail[])
- **ProductVariantDetail**: id, color, size, sku, price, stockQuantity, imageUrl
- **CategorySummary**: id, name, slug
- **ProductFilterParams**: q, collection, categorySlug, sizes, colors, priceMin, priceMax, brands, inStockOnly, sort, page, pageSize
- **ProductsListResponse**: products (ProductSummary[]), total, page, pageSize, totalPages
- **Filtering**: collection, categorySlug, sizes, colors, priceMin/priceMax, brands, inStockOnly 
- **Sorting**: featured, newest, price-low, price-high, popular
- **Pagination**: page, pageSize

### Lưu ý quan trọng:
- **Review API**: Sẽ triển khai sau, tạm thời `rating` và `reviewCount` có thể dùng giá trị mặc định (0, 0) hoặc từ dữ liệu seed
- **Frontend API Client**: Sử dụng **axios** thay vì fetch để gọi API từ frontend

## 2. Các vấn đề cần giải quyết

### 2.1 Backend thiếu fields
- Không có field `collection` (men/women/accessories)
- Không có field `slug` cho Product
- Không có field `salePrice`, `discountPercent`
- Không có field `isNew`
- Không có field `tags`

### 2.2 Backend thiếu tính năng
- **Tạm thời**: Không tính `rating` và `reviewCount` từ Review model (sẽ làm sau khi có Review API)
- Không transform `colors` và `sizes` từ ProductVariant
- Không hỗ trợ filtering (sizes, colors, priceRange, brands, inStock)
- Không hỗ trợ sorting (featured, newest, price-low, price-high, popular)
- Không hỗ trợ pagination
- Không hỗ trợ filter theo collection

### 2.3 Frontend cần thay đổi
- Thay thế mock data từ `frontend/src/data/products.ts` bằng API calls
- Cập nhật `Collections.tsx` để fetch từ API
- Cập nhật `Home.tsx` và các components khác sử dụng products
- Tạo API service functions trong `frontend/src/lib/api.ts` **sử dụng axios**

## 3. Kế hoạch triển khai

### Phase 1: Cập nhật Database Models

**File: `backend/models/productModel.js`**
- Thêm field `collection` (ENUM: 'men', 'women', 'accessories')
- Thêm field `slug` (STRING, unique)
- Thêm field `sale_price` (DECIMAL, nullable)
- Thêm field `is_new` (BOOLEAN, default false)
- Thêm field `tags` (JSONB, default [])

### Phase 2: Cập nhật Backend Services

**File: `backend/services/user/productService.js`**
- **VIẾT LẠI HOÀN TOÀN `summarizeProduct()`** để trả về `ProductSummary`:
  - `id`: number (từ data.id)
  - `slug`: string (từ data.slug)
  - `name`: string
  - `brand`: string
  - `collection`: 'men' | 'women' | 'accessories' (từ data.collection)
  - `category`: { id, name, slug } | null (transform từ Category association)
  - `price`: number (base_price + min(price_adjustment từ variants))
  - `salePrice`: number | null (từ data.sale_price)
  - `discountPercent`: number | null (tính từ salePrice và price nếu có)
  - `images`: string[] (từ data.images JSONB)
  - `colors`: string[] (unique từ variants.color, filter null)
  - `sizes`: string[] (unique từ variants.size, filter null)
  - `rating`: number (tạm thời 0, sẽ tính từ Review sau)
  - `reviewCount`: number (tạm thời 0, sẽ tính từ Review sau)
  - `isNew`: boolean (từ data.is_new)
  - `inStock`: boolean (any variant có stock_quantity > 0)
  - `tags`: string[] (từ data.tags JSONB)
  - `createdAt`: string (format ISO từ created_at)
  - `updatedAt`: string (format ISO từ updated_at)
- **Tạo function `transformVariantDetail()`** để trả về `ProductVariantDetail`:
  - `id`: number
  - `color`: string | null
  - `size`: string | null
  - `sku`: string | null
  - `price`: number (base_price + price_adjustment)
  - `stockQuantity`: number (từ stock_quantity)
  - `imageUrl`: string | null (từ image_url)
- **Cập nhật `getProductDetailService()`**:
  - Trả về `ProductDetail` extends `ProductSummary`
  - Thêm `description`: string
  - Thêm `variants`: ProductVariantDetail[] (transform tất cả variants)
- **Cập nhật `getProductsByCategoryService()`**:
  - Nhận params: collection, sizes, colors, priceMin, priceMax, brands, inStockOnly, sort, page, pageSize
  - Filter logic:
    - Collection: WHERE collection = ?
    - Sizes: JOIN variants WHERE size IN (?)
    - Colors: JOIN variants WHERE color IN (?)
    - Price: WHERE (base_price + min(price_adjustment)) BETWEEN ? AND ?
    - Brands: WHERE brand IN (?)
    - InStock: WHERE EXISTS (SELECT 1 FROM variants WHERE stock_quantity > 0)
  - Sorting logic:
    - featured: ORDER BY created_at DESC (default)
    - newest: ORDER BY created_at DESC
    - price-low: ORDER BY (base_price + min(price_adjustment)) ASC
    - price-high: ORDER BY (base_price + min(price_adjustment)) DESC
    - popular: ORDER BY reviewCount DESC (tạm thời dùng created_at)
  - Pagination: LIMIT/OFFSET
  - Response format: `{ products: ProductSummary[], total: number, page: number, pageSize: number, totalPages: number }`
- **Cập nhật `searchProductsService()`**:
  - Tương tự `getProductsByCategoryService()` nhưng thêm search query (name/brand LIKE)
  - Hỗ trợ tất cả filters, sorting, pagination
  - Response format giống trên

**File: `backend/controllers/user/productController.js`**
- **Cập nhật `getProductsByCategoryController()`**:
  - Parse query params: collection, sizes (array), colors (array), priceMin, priceMax, brands (array), inStockOnly (boolean), sort, page, pageSize
  - Validate: collection phải là 'men' | 'women' | 'accessories', sort phải hợp lệ, page/pageSize phải là số dương
  - Parse arrays từ query string (sizes, colors, brands có thể là comma-separated hoặc multiple params)
  - Truyền params xuống service
  - Response format: `{ success: true, data: { products, total, page, pageSize, totalPages }, message: "..." }`
- **Cập nhật `getProductDetailController()`**:
  - Response format: `{ success: true, data: ProductDetail, message: "..." }`
- **Cập nhật `searchProductsController()`**:
  - Parse query params tương tự `getProductsByCategoryController()` + thêm `q` param
  - Response format: `{ success: true, data: { products, total, page, pageSize, totalPages }, message: "..." }`

### Phase 3: Tạo Migration Script

**File: `backend/migrations/addProductFields.js`**
- Migration để thêm các fields mới vào bảng products
- Update existing products với giá trị mặc định
- Hỗ trợ up/down migration
- Xử lý foreign key constraints khi clear data 

### Phase 4: Chuẩn bị Dữ liệu Database

**File: `backend/scripts/seedProducts.js`**
- Script để seed dữ liệu mẫu:
  - Categories với hierarchy (men/women/accessories và subcategories)
  - Products với đầy đủ thông tin
  - ProductVariants với colors và sizes
  - **Tạm thời**: Products có thể có rating và reviewCount hardcode trong seed data (sẽ tính từ Review API sau)

### Phase 5: Cập nhật Frontend API Service

**File: `frontend/src/lib/api.ts`**
- **QUAN TRỌNG**: Thay thế tất cả `fetch()` bằng **axios**
- Cài đặt axios: `npm install axios`
- Tạo axios instance với baseURL và default config:
  ```typescript
  import axios from 'axios';
  const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  ```
- Thêm axios interceptors cho error handling
- Thêm interface `ProductResponse`, `ProductsListResponse`
- Thêm function `getProducts()` với filters và pagination (sử dụng axios.get với params)
- Thêm function `getProductById(id: string)` (sử dụng axios.get)
- Thêm function `getProductsByCategory(slug: string, filters?)` (sử dụng axios.get với params)
- Thêm function `searchProducts(query: string, filters?)` (sử dụng axios.get với params)

### Phase 6: Cập nhật Frontend Components

**File: `frontend/src/pages/Collections.tsx`**
- Thay `allProducts` từ mock data bằng state từ API
- Thêm `useEffect` để fetch products khi filters/params thay đổi
- Thêm loading state và error handling
- Cập nhật filtering logic để gửi filters lên API

**File: `frontend/src/components/HomePage/MensCollection.tsx`**
- Cập nhật để fetch từ API thay vì mock data

**File: `frontend/src/pages/Home.tsx`**
- Cập nhật các components sử dụng products

### Phase 7: Cập nhật Type Definitions

**File: `frontend/src/types/products.ts`**
- **Thay thế interface Product cũ** bằng các interface mới:
  - `CategorySummary`: { id: number, name: string, slug: string }
  - `ProductSummary`: id, slug, name, brand, collection, category (CategorySummary | null), price, salePrice, discountPercent, images, colors (string[]), sizes (string[]), rating, reviewCount, isNew, inStock, tags, createdAt, updatedAt
  - `ProductVariantDetail`: id, color, size, sku, price, stockQuantity, imageUrl
  - `ProductDetail`: extends ProductSummary + description, variants (ProductVariantDetail[])
  - `ProductFilterParams`: q, collection, categorySlug, sizes, colors, priceMin, priceMax, brands, inStockOnly, sort, page, pageSize
  - `ProductsListResponse`: products (ProductSummary[]), total, page, pageSize, totalPages
  - `SortOption`: 'featured' | 'newest' | 'price-low' | 'price-high' | 'popular'
  - `ViewMode`: 'grid-4' | 'grid-3' | 'list' (giữ nguyên cho UI)
- **Lưu ý**: Interface cũ `Product` và `FilterState` có thể giữ lại để backward compatibility hoặc xóa nếu không còn dùng

## 4. Cấu trúc dữ liệu cần seed

### Categories:
```
- Men (slug: "men")
  - Shirts (slug: "shirts")
  - Pants (slug: "pants")
  - Suits (slug: "suits")
  - Shoes (slug: "shoes")
- Women (slug: "women")
  - Dresses (slug: "dresses")
  - Blouses (slug: "blouses")
  - Pants (slug: "pants")
- Accessories (slug: "accessories")
  - Watches (slug: "watches")
  - Bags (slug: "bags")
```

### Products mẫu:
- Ít nhất 20-30 products với đầy đủ variants
- Mỗi product có 2-4 variants (khác màu/size)
- **Tạm thời**: Products có thể có rating và reviewCount hardcode trong seed data (sẽ tính từ Review API sau)
- Một số products có sale_price để test discount

## 5. Checklist triển khai

### Phase 1: Database Models ✅
- [x] Cập nhật Product model với fields mới (collection, slug, sale_price, is_new, tags)

### Phase 2: Backend Services ✅
- [x] Cập nhật productService với transformation logic (rating/reviewCount tạm thời dùng default)
- [x] Viết lại summarizeProduct() để trả về ProductSummary
- [x] Tạo transformVariantDetail() function
- [x] Cập nhật getProductDetailService() để trả về ProductDetail
- [x] Cập nhật getProductsByCategoryService() với filters, sorting, pagination
- [x] Cập nhật searchProductsService() với filters, sorting, pagination
- [x] Cập nhật productController với filters và pagination
- [x] Parse và validate query params trong controllers

### Phase 3: Migration Script ✅
- [x] Tạo migration script (backend/migrations/addProductFields.js)
- [x] Migration hỗ trợ up/down
- [x] Xử lý foreign key constraints khi clear data

### Phase 4: Seed Data ✅
- [x] Tạo seed script với dữ liệu mẫu (backend/scripts/seedProducts.js)
- [x] Categories với hierarchy (men/women/accessories và subcategories)
- [x] 20 products với đầy đủ thông tin
- [x] ProductVariants với colors và sizes
- [ ] Chạy migration và seed database (cần chạy thủ công)

### Phase 5: Frontend API Service ✅
- [x] **Cài đặt axios trong frontend**: `npm install axios`
- [x] Tạo axios instance với baseURL và default config
- [x] Thêm axios interceptors cho error handling
- [x] Thêm request interceptor cho auth token
- [x] Cập nhật frontend API service (thay fetch bằng axios)
- [x] Thêm function getProducts() với filters và pagination
- [x] Thêm function getProductById()
- [x] Thêm function getProductsByCategory()
- [x] Thêm function searchProducts()

### Phase 6: Frontend Components ✅ (Một phần)
- [x] Cập nhật Collections page để fetch từ API
- [x] Thêm loading state và error handling trong Collections
- [x] Cập nhật filtering logic để gửi filters lên API
- [x] Cập nhật MensCollection.tsx để fetch từ API
- [x] Cập nhật ProductCard để nhận ProductSummary trực tiếp
- [ ] Cập nhật NewArrivals.tsx để fetch từ API (đang dùng hardcoded products)
- [ ] FeaturedCollection.tsx - không cần cập nhật (chỉ hiển thị collection images)
- [ ] ShoppingCart.tsx - cần kiểm tra nếu có dùng products

### Phase 7: Type Definitions ✅
- [x] Thêm CategorySummary interface
- [x] Thêm ProductSummary interface
- [x] Thêm ProductVariantDetail interface
- [x] Thêm ProductDetail interface
- [x] Thêm ProductFilterParams interface
- [x] Thêm ProductsListResponse interface
- [x] Cập nhật SortOption type
- [x] Giữ lại interfaces cũ để backward compatibility

### Testing & Deployment
- [ ] Test backend APIs với Postman/Thunder Client
- [ ] Test end-to-end flow
- [ ] Xử lý error cases và loading states (đã thêm cơ bản, có thể cần cải thiện)
- [ ] **Sau này**: Triển khai Review API và cập nhật logic tính rating/reviewCount

## 6. Lưu ý kỹ thuật

- **Frontend API Client**: Sử dụng **axios** thay vì fetch
  - Cài đặt: `npm install axios`
  - Tạo axios instance với baseURL từ `VITE_API_BASE_URL`
  - Sử dụng axios interceptors cho error handling
  - Format: `axios.get(url, { params: {...} })` cho query params
  - Response data: `response.data` (axios tự động parse JSON)
- **Backend response format**:
  - List: `{ success: boolean, data: { products: ProductSummary[], total, page, pageSize, totalPages }, message?: string }`
  - Detail: `{ success: boolean, data: ProductDetail, message?: string }`
- **Breaking Changes**:
  - Response format thay đổi: `getProductsByCategoryService()` và `searchProductsService()` trả về object với pagination thay vì array
  - `summarizeProduct()` thay đổi hoàn toàn structure
  - Frontend cần cập nhật để handle response format mới
- Frontend cần handle cả success và error responses
- Cần xử lý CORS nếu frontend và backend chạy trên ports khác nhau
- **Filtering logic**:
  - Sizes và colors: aggregate từ variants, cần JOIN và GROUP BY
  - Price filter: tính từ base_price + min(price_adjustment) của variants
  - InStock: check EXISTS subquery với variants có stock_quantity > 0
- **Performance considerations**:
  - Cần index cho: collection, brand, category_id, created_at
  - Aggregate colors/sizes có thể chậm với nhiều variants, cân nhắc cache hoặc denormalize
- **Rating/ReviewCount**: Tạm thời dùng giá trị mặc định (0, 0) hoặc từ seed data. Sẽ tính từ Review model sau khi có Review API

## 7. Ví dụ sử dụng axios trong frontend

```typescript
// frontend/src/lib/api.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Error interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || error.message || 'Network error';
    throw new Error(message);
  }
);

// Get products with filters
export async function getProducts(filters: ProductFilterParams): Promise<ProductsListResponse> {
  const response = await apiClient.get('/user/product/search', {
    params: {
      ...filters,
      sizes: filters.sizes?.join(','), // Convert array to comma-separated
      colors: filters.colors?.join(','),
      brands: filters.brands?.join(','),
      page: filters.page || 1,
      pageSize: filters.pageSize || 12,
    },
  });
  return response.data.data; // Extract data from { success, data, message }
}

// Get products by category
export async function getProductsByCategory(
  categorySlug: string,
  filters?: Omit<ProductFilterParams, 'categorySlug'>
): Promise<ProductsListResponse> {
  const response = await apiClient.get(`/user/product/category/${categorySlug}`, {
    params: {
      ...filters,
      sizes: filters?.sizes?.join(','),
      colors: filters?.colors?.join(','),
      brands: filters?.brands?.join(','),
      page: filters?.page || 1,
      pageSize: filters?.pageSize || 12,
    },
  });
  return response.data.data;
}

// Get product detail
export async function getProductById(productId: number): Promise<ProductDetail> {
  const response = await apiClient.get(`/user/product/${productId}`);
  return response.data.data;
}
```

## 8. Chi tiết thay đổi Backend Response Format

### Trước đây:
```javascript
// getProductsByCategoryService
{
  category: {...},
  categoryIds: [...],
  products: [...]
}

// searchProductsService
[...] // Array of products
```

### Sau khi cập nhật:
```javascript
// getProductsByCategoryService & searchProductsService
{
  products: ProductSummary[],
  total: number,
  page: number,
  pageSize: number,
  totalPages: number
}

// getProductDetailService
ProductDetail {
  ...ProductSummary,
  description: string,
  variants: ProductVariantDetail[]
}
```

## 9. Migration Path

1. **Backend**: Cập nhật services trước, giữ controllers tương thích tạm thời
2. **Frontend**: Cập nhật types trước, sau đó cập nhật API calls
3. **Testing**: Test từng endpoint một để đảm bảo không breaking
4. **Deployment**: Deploy backend trước, sau đó frontend

