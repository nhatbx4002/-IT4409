import type { ProductSummary } from './products';

export interface WishlistItem {
  id: number;
  user_id: number;
  product_id: number;
  product?: ProductSummary;
  createdAt?: string;
  updatedAt?: string;
}

export interface WishlistResponse {
  success: boolean;
  count: number;
  data: WishlistItem[];
  message?: string;
}

export interface AddToWishlistResponse {
  success: boolean;
  data: WishlistItem;
  message?: string;
}

export interface RemoveFromWishlistResponse {
  success: boolean;
  message?: string;
}
