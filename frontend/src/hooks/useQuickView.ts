import { useState } from 'react';
import type { ProductSummary } from '@/types/products';

export const useQuickView = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(null);

  const openQuickView = (product: ProductSummary) => setSelectedProduct(product);
  const closeQuickView = () => setSelectedProduct(null);

  return {
    selectedProduct,
    isQuickViewOpen: !!selectedProduct,
    openQuickView,
    closeQuickView,
  };
};

