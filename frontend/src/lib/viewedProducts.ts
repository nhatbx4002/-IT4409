const VIEWED_PRODUCTS_KEY = 'viewed_products';
const MAX_VIEWED_PRODUCTS = 20;

export interface ViewedProduct {
  id: number;
  viewedAt: number;
}

export const getViewedProducts = (): ViewedProduct[] => {
  try {
    const stored = localStorage.getItem(VIEWED_PRODUCTS_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as ViewedProduct[];
  } catch {
    return [];
  }
};

export const addViewedProduct = (productId: number): void => {
  try {
    const viewed = getViewedProducts();
    
    const filtered = viewed.filter((p) => p.id !== productId);
    const updated = [
      { id: productId, viewedAt: Date.now() },
      ...filtered,
    ].slice(0, MAX_VIEWED_PRODUCTS);

    localStorage.setItem(VIEWED_PRODUCTS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save viewed product', error);
  }
};

export const getViewedProductIds = (): number[] => {
  return getViewedProducts().map((p) => p.id);
};

