export interface Collection {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  banner_image: string | null;
  start_date: string | null;
  end_date: string | null;
}

export interface CollectionProductsResponse {
  collection: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    banner_image: string | null;
  };
  products: ProductSummary[];
  total: number;
}

import type { ProductSummary } from './products';

