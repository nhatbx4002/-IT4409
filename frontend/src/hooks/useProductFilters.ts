import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ProductFilterParams, ProductFiltersState, SortOption } from '@/types/products';
import { PRICE_RANGE } from '@/data/filter-options';

const DEFAULT_PRICE_RANGE: [number, number] = PRICE_RANGE;

type UseProductFiltersOptions = {
  collection?: ProductFiltersState['collection'];
  categoryFromUrl?: string;
  initialSort?: SortOption;
};

const buildDefaultState = (options?: UseProductFiltersOptions): ProductFiltersState => ({
  categories: [],
  sizes: [],
  colors: [],
  priceRange: DEFAULT_PRICE_RANGE,
  brands: [],
  inStockOnly: false,
  collection: options?.collection,
  sortBy: options?.initialSort,
});

export const useProductFilters = (options?: UseProductFiltersOptions) => {
  const [filters, setFilters] = useState<ProductFiltersState>(buildDefaultState(options));

  useEffect(() => {
    if (options?.collection !== undefined) {
      setFilters((prev) => ({ ...prev, collection: options.collection }));
    }
  }, [options?.collection]);

  useEffect(() => {
    if (options?.initialSort) {
      setFilters((prev) => ({ ...prev, sortBy: options.initialSort }));
    }
  }, [options?.initialSort]);

  const resetFilters = useCallback(() => {
    setFilters(buildDefaultState(options));
  }, [options]);

  const removeFilter = useCallback(
    (type: keyof ProductFiltersState, value?: string) => {
      setFilters((prev) => {
        switch (type) {
          case 'categories':
          case 'sizes':
          case 'colors':
          case 'brands':
            return {
              ...prev,
              [type]: prev[type].filter((item) => item !== value),
            };
          case 'priceRange':
            return { ...prev, priceRange: DEFAULT_PRICE_RANGE };
          case 'inStockOnly':
            return { ...prev, inStockOnly: false };
          case 'collection':
            return { ...prev, collection: undefined };
          default:
            return prev;
        }
      });
    },
    []
  );

  const activeFilterCount = useMemo(() => {
    return (
      filters.categories.length +
      filters.sizes.length +
      filters.colors.length +
      filters.brands.length +
      (filters.inStockOnly ? 1 : 0) +
      (filters.priceRange[0] !== DEFAULT_PRICE_RANGE[0] ||
      filters.priceRange[1] !== DEFAULT_PRICE_RANGE[1]
        ? 1
        : 0)
    );
  }, [filters]);

  const buildFilterParams = useCallback(
    (overrides?: Partial<ProductFilterParams>): ProductFilterParams => {
      const hasCategoryFilter = filters.categories.length > 0;
      const categorySlug =
        !hasCategoryFilter && options?.categoryFromUrl ? options.categoryFromUrl : undefined;

      return {
        collection: filters.collection,
        categorySlug,
        categorySlugs: hasCategoryFilter ? filters.categories : undefined,
        sizes: filters.sizes.length > 0 ? filters.sizes : undefined,
        colors: filters.colors.length > 0 ? filters.colors : undefined,
        priceMin:
          filters.priceRange[0] > DEFAULT_PRICE_RANGE[0]
            ? filters.priceRange[0]
            : undefined,
        priceMax:
          filters.priceRange[1] < DEFAULT_PRICE_RANGE[1]
            ? filters.priceRange[1]
            : undefined,
        brands: filters.brands.length > 0 ? filters.brands : undefined,
        inStockOnly: filters.inStockOnly || undefined,
        sort: filters.sortBy,
        ...overrides,
      };
    },
    [filters, options?.categoryFromUrl]
  );

  return {
    filters,
    setFilters,
    resetFilters,
    removeFilter,
    activeFilterCount,
    buildFilterParams,
  };
};
