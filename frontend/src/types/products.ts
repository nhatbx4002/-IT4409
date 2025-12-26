// ============================================
// NEW INTERFACES (Phase 5)
// ============================================

export interface CategorySummary {
  id: number;
  name: string;
  slug: string;
}

export interface ProductSummary {
  id: number;
  slug: string | null;
  name: string;
  brand: string;
  category: CategorySummary | null;
  price: number;
  salePrice: number | null;
  discountPercent: number | null;
  images: string[];
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  isNew: boolean;
  inStock: boolean;
  tags: string[];
  createdAt: string | null;
  updatedAt: string | null;
  defaultVariantId: number | null;
}

export interface ProductVariantDetail {
  id: number;
  color: string | null;
  size: string | null;
  sku: string | null;
  stockQuantity: number;
  imageUrl: string | null;
}

export interface ProductDetail extends ProductSummary {
  description: string | null;
  variants: ProductVariantDetail[];
}

export interface ProductFilterParams {
  q?: string;
  collection?: string;
  categorySlug?: string;
  categorySlugs?: string[];
  sizes?: string[];
  colors?: string[];
  priceMin?: number;
  priceMax?: number;
  brands?: string[];
  inStockOnly?: boolean;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface ProductsListResponse {
  products: ProductSummary[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-low'
  | 'price-high'
  | 'popular';

export type ViewMode = 'grid-4' | 'grid-3' | 'list';

export interface ProductFiltersState {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: [number, number];
  brands: string[];
  inStockOnly: boolean;
  collection?: string;
  sortBy?: SortOption;
}

// ============================================
// OLD INTERFACES (kept for backward compatibility)
// ============================================

export interface Product {
  id: string;                     // Unique identifier
  slug?: string;                  // URL-friendly name
  name: string;
  description?: string;          // Optional detailed description
  brand: string; // Allow object or name
  category: string;
  price: number;                  // Base price
  salePrice?: number;             // Discounted price (if on sale)
  discountPercent?: number;       // Optional - auto-calculated
  images: string[];               // Image URLs
  colors: Array<{ name: string; hex: string }>;
  sizes: string[];                // e.g. ["S", "M", "L", "XL"]
  rating: number;                 // Average rating
  reviewCount: number;
  isNew?: boolean;
  inStock: boolean;
  variantId?: string;             // Optional, if product variants exist
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}
