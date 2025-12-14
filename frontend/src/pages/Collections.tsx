import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import {
  Grid,
  List,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import MainLayout from "@/layout/MainLayout";
import { FilterSidebar } from "@/components/FiltersSidebar";
import { ProductCard } from "@/components/ProductsCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useParams, useSearchParams } from "react-router-dom";
import { getProducts, getProductsByCategory } from "@/lib/api";
import type { ProductSummary, SortOption, ViewMode } from "@/types/products";
import { useProductFilters } from "@/hooks/useProductFilters";
import { EmptyState, ErrorState, LoadingState } from "@/components/feedback/AsyncStates";
import {
  BRAND_GOLD,
  CATEGORY_LABEL_MAP,
  FONT_SANS,
} from "@/theme/constants";

export function Collections() {
  const { collection, category } = useParams();
  const [searchParams] = useSearchParams();

  const isNew = searchParams.get("new") === "1";
  const pageSize = Number(searchParams.get("pageSize") ?? 12);
  const sortParam = (searchParams.get("sort") ?? "featured") as SortOption;

  const capitalize = (s?: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  const dynamicTitle =
    (searchParams.get("title") ??
      [collection, category].filter(Boolean).join(" / ")) ||
    "Collection";

  const crumbs = [
    { label: "Home", href: "/" },
    ...(collection
      ? [{ label: capitalize(collection), href: `/collections/${collection}` }]
      : []),
    ...(category ? [{ label: category }] : []),
  ];

  const {
    filters,
    setFilters,
    resetFilters,
    removeFilter,
    activeFilterCount,
    buildFilterParams,
  } = useProductFilters({
    collection: collection as "men" | "women" | "accessories" | undefined,
    categoryFromUrl: category,
    initialSort: sortParam,
  });

  const [viewMode, setViewMode] = useState<ViewMode>("grid-4");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDesktopFilterVisible, setIsDesktopFilterVisible] = useState(true);


  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentSort = (filters.sortBy ?? sortParam) as SortOption;
  const itemsPerPage = pageSize;

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const params = buildFilterParams({
        sort: currentSort,
        page: currentPage,
        pageSize: itemsPerPage,
      });

      const response =
        category && !params.categorySlugs
          ? await getProductsByCategory(category, params)
          : await getProducts(params);

      setProducts(response.products);
      setTotal(response.total);
      setTotalPages(response.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      console.error("Error fetching products:", err);
      setProducts([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [buildFilterParams, category, currentPage, currentSort, itemsPerPage]);

  useEffect(() => {
    fetchProducts();
  }, [
    fetchProducts,
    filters.sizes,
    filters.colors,
    filters.priceRange,
    filters.brands,
    filters.inStockOnly,
    filters.categories,
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, collection, category, isNew, pageSize]);

  const handleClearFilters = () => {
    resetFilters();
    setCurrentPage(1);
    setIsMobileFilterOpen(false);
  };

  const handleRemoveFilter = (type: keyof typeof filters, value?: string) => {
    removeFilter(type, value);
    setCurrentPage(1);
  };


  const paginatedProducts = useMemo(() => products, [products]);

  const hasNoResults = !isLoading && !error && paginatedProducts.length === 0;

  return (
    <MainLayout>
      <section className="bg-[#F9FAFB] pb-10 pt-6">
        <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-0">
          <Breadcrumb className="mb-4">
          <BreadcrumbList>
            {crumbs.map((c, idx) => (
              <Fragment key={`${c.label}-${idx}`}>
                <BreadcrumbItem>
                  {c.href ? (
                    <BreadcrumbLink
                      href={c.href}
                      className="text-[#666666] hover:text-[#D4AF37] transition-colors duration-300"
                    >
                      {c.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{c.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {idx < crumbs.length - 1 && <BreadcrumbSeparator />}
              </Fragment>
            ))}
          </BreadcrumbList>
          </Breadcrumb>

          <header className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9CA3AF]">
                {collection ? capitalize(collection) : "All menswear"}
              </p>
              <h1
                className="mt-2 font-['Playfair_Display'] text-3xl font-semibold tracking-tight text-[#111827] sm:text-4xl"
              >
                {dynamicTitle}
              </h1>
              <p
                className="mt-2 text-xs text-[#6B7280] sm:text-sm"
                style={{
                  fontFamily: FONT_SANS,
                }}
              >
                {isLoading
                  ? "Curating your selection..."
                  : `Showing ${total} handpicked pieces`}
              </p>
            </div>
            <div className="rounded-2xl bg-white/80 px-4 py-3 text-xs text-[#4B5563] shadow-sm ring-1 ring-gray-200 sm:text-sm">
              <p className="font-medium">
                Tailored luxury for the modern gentleman.
              </p>
              <p className="mt-1 text-xs text-[#9CA3AF]">
                Refine by size, color, brand and more to build your perfect edit.
              </p>
            </div>
          </header>
        </div>
      </section>

      <section className="bg-white pb-16 pt-6">
        <div className="mx-auto flex max-w-6xl gap-8 px-6 sm:px-8 lg:px-0">
          {isDesktopFilterVisible && (
            <aside className="hidden lg:block w-1/4 transition-all duration-500 ease-in-out">
              <div className="sticky top-4">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </aside>
          )}

          <main className="flex-1">
            <div className="mb-6">
              {activeFilterCount > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-black/10 pb-4">
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: FONT_SANS,
                    }}
                  >
                    Active Filters:
                  </span>

                  {filters.categories.map((categorySlug) => (
                    <Badge
                      key={categorySlug}
                      variant="secondary"
                      className="bg-black/5 text-black border border-black/20 hover:bg-black/10 transition-colors duration-300 cursor-pointer px-3 py-1"
                      onClick={() => handleRemoveFilter("categories", categorySlug)}
                    >
                      {CATEGORY_LABEL_MAP[categorySlug] ?? categorySlug}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}

                  {filters.sizes.map((size) => (
                    <Badge
                      key={size}
                      variant="secondary"
                      className="bg-black/5 text-black border border-black/20 hover:bg-black/10 transition-colors duration-300 cursor-pointer px-3 py-1"
                      onClick={() => handleRemoveFilter("sizes", size)}
                    >
                      {size}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}

                  {filters.colors.map((color) => (
                    <Badge
                      key={color}
                      variant="secondary"
                      className="bg-black/5 text-black border border-black/20 hover:bg-black/10 transition-colors duration-300 cursor-pointer px-3 py-1"
                      onClick={() => handleRemoveFilter("colors", color)}
                    >
                      {color}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}

                  {filters.brands.map((brand) => (
                    <Badge
                      key={brand}
                      variant="secondary"
                      className="bg-black/5 text-black border border-black/20 hover:bg-black/10 transition-colors duration-300 cursor-pointer px-3 py-1"
                      onClick={() => handleRemoveFilter("brands", brand)}
                    >
                      {brand}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}

                  {(filters.priceRange[0] !== 0 ||
                    filters.priceRange[1] !== 500) && (
                    <Badge
                      variant="secondary"
                      className="bg-black/5 text-black border border-black/20 hover:bg-black/10 transition-colors duration-300 cursor-pointer px-3 py-1"
                      onClick={() => handleRemoveFilter("priceRange")}
                    >
                      ${filters.priceRange[0]} - ${filters.priceRange[1]}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}

                  {filters.inStockOnly && (
                    <Badge
                      variant="secondary"
                      className="bg-black/5 text-black border border-black/20 hover:bg-black/10 transition-colors duration-300 cursor-pointer px-3 py-1"
                      onClick={() => handleRemoveFilter("inStockOnly")}
                    >
                      In Stock
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}

                  <button
                    onClick={handleClearFilters}
                    className="text-sm underline transition-all duration-300"
                    style={{
                      color: BRAND_GOLD,
                      fontFamily: FONT_SANS,
                    }}
                  >
                    Clear All
                  </button>
                </div>
              )}

                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-black/20 hover:border-[#D4AF37] transition-all duration-300"
                    style={{
                      fontFamily: FONT_SANS,
                    }}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    FILTERS
                  </button>

                  <button
                    onClick={() =>
                      setIsDesktopFilterVisible(!isDesktopFilterVisible)
                    }
                    className="hidden lg:flex items-center gap-2 px-4 py-2 border border-black/20 hover:border-[#D4AF37] transition-all duration-300"
                    style={{
                      fontFamily: FONT_SANS,
                    }}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    {isDesktopFilterVisible ? "HIDE FILTERS" : "SHOW FILTERS"}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#666666]">Sort by:</span>
                  <Select
                    value={currentSort}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, sortBy: value as SortOption }))
                    }
                  >
                    <SelectTrigger className="w-48 border-black/20 focus:border-[#D4AF37]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-1 border border-black/20 p-1">
                  <button
                    onClick={() => setViewMode("grid-4")}
                    className={`p-2 transition-all duration-300 ${
                      viewMode === "grid-4"
                        ? "bg-[#D4AF37]"
                        : "hover:bg-black/5"
                    }`}
                    aria-label="Grid 4 columns"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("grid-3")}
                    className={`p-2 transition-all duration-300 ${
                      viewMode === "grid-3"
                        ? "bg-[#D4AF37]"
                        : "hover:bg-black/5"
                    }`}
                    aria-label="Grid 3 columns"
                  >
                    <Grid className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-all duration-300 ${
                      viewMode === "list" ? "bg-[#D4AF37]" : "hover:bg-black/5"
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {isLoading && <LoadingState message="Loading products..." />}

            {error && !isLoading && (
              <ErrorState message={error} onRetry={fetchProducts} />
            )}

            {!isLoading && !error && (
              <div
                className={`
                  grid gap-6 mb-12 transition-all duration-500
                  ${
                    viewMode === "grid-4"
                      ? `grid-cols-1 sm:grid-cols-2 ${
                          isDesktopFilterVisible
                            ? "lg:grid-cols-3 xl:grid-cols-4"
                            : "lg:grid-cols-4 xl:grid-cols-5"
                        }`
                      : ""
                  }
                  ${
                    viewMode === "grid-3"
                      ? `grid-cols-1 sm:grid-cols-2 ${
                          isDesktopFilterVisible
                            ? "lg:grid-cols-3"
                            : "lg:grid-cols-4"
                        }`
                      : ""
                  }
                  ${viewMode === "list" ? "grid-cols-1" : ""}
                `}
              >
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToWishlist={(productId) =>
                      console.log("Add to wishlist:", productId)
                    }
                    onAddToCart={(productId) =>
                      console.log("Add to cart:", productId)
                    }
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 border-2 border-black/20 disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`
                        w-10 h-10 border-2 transition-all duration-300
                        ${
                          currentPage === pageNum
                            ? "border-[#D4AF37] bg-[#D4AF37] text-black"
                            : "border-black/20 text-[#666666] hover:border-[#D4AF37] hover:text-[#D4AF37]"
                        }
                      `}
                      style={{
                        fontFamily: FONT_SANS,
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="text-[#666666]">...</span>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-10 h-10 border-2 border-black/20 text-[#666666] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
                      style={{
                        fontFamily: FONT_SANS,
                      }}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border-2 border-black/20 disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {hasNoResults && (
              <EmptyState
                title="No products found matching your filters"
                actionLabel="Clear All Filters"
                onAction={handleClearFilters}
              />
            )}
          </main>
        </div>
      </section>

      <FilterSidebar
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
        isMobileOpen={isMobileFilterOpen}
        onMobileClose={() => setIsMobileFilterOpen(false)}
      />

    </MainLayout>
  );
}

