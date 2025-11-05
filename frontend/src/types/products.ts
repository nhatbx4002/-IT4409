export interface Product {
  id: string;                     // Unique identifier
  slug?: string;                  // URL-friendly name
  name: string;
  description?: string;          // Optional detailed description
  brand: string; // Allow object or name
  collection: 'men' | 'women' | 'accessories';
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


export interface FilterState {
  categories: string[];           // Active category filters
  sizes: string[];                // e.g. ["M", "L"]
  colors: string[];               // e.g. ["#000000", "#D4AF37"]
  priceRange: [number, number];   // [min, max]
  brands: string[];               // e.g. ["Gucci", "Prada"]
  inStockOnly: boolean;
  collection?: 'men' | 'women' | 'accessories'; 
  sortBy?: SortOption;            
}

export type SortOption =
  | 'featured'
  | 'newest'
  | 'price-low'
  | 'price-high'
  | 'popular'
  | 'rating';

export type ViewMode = 'grid-4' | 'grid-3' | 'list';
