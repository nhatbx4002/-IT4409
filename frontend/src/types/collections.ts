/**
 * Collection Types
 */

export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  banner_image: string | null;
  start_date: string | null;
  end_date: string | null;
  status?: 'draft' | 'active' | 'archived';
  sort_order?: number;
}

export interface CollectionProductData {
  id: number;
  name: string;
  slug: string;
  base_price: number | string;
  sale_price: number | string | null;
  images: string | string[];
  status: string;
  is_new: boolean;
  tags: string[];
  featured?: boolean;
  sort_order?: number;
  added_at?: string;
}

export interface CollectionProductsResponse {
  collection: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    banner_image: string | null;
  };
  products: CollectionProductData[];
  total: number;
}
