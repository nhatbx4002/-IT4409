import { useCallback, useEffect, useMemo, useState } from "react";
import { Fragment } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight, Search } from "lucide-react";
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
import { addToCart, addToWishlist, getProducts } from "@/lib/api";
import type { ProductSummary, SortOption } from "@/types/products";
import { useProductFilters } from "@/hooks/useProductFilters";
import { EmptyState, ErrorState, LoadingState } from "@/components/feedback/AsyncStates";
import {
  BRAND_GOLD,
  CATEGORY_LABEL_MAP,
  FONT_SANS,
} from "@/theme/constants";
import { PRICE_RANGE } from "@/data/filter-options";
import { toast } from "sonner";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const pageSize = Number(searchParams.get("pageSize") ?? 12);
  const sortParam = (searchParams.get("sort") ?? "featured") as SortOption;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN').format(value) + '₫';

  const capitalize = (s?: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : "";

  const dynamicTitle = query ? `"${query}"` : "Tìm kiếm";

  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Tìm kiếm" },
  ];

  const {
    filters,
    setFilters,
    resetFilters,
    removeFilter,
    activeFilterCount,
    buildFilterParams,
  } = useProductFilters({
    collection: undefined,
    categoryFromUrl: undefined,
    initialSort: sortParam,
  });

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
    if (!query) {
      setProducts([]);
      setTotal(0);
      setTotalPages(0);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = buildFilterParams({
        q: query,
        sort: currentSort,
        page: currentPage,
        pageSize: itemsPerPage,
      });

      const response = await getProducts(params);

      setProducts(response.products || []);
      setTotal(response.total || 0);
      setTotalPages(Math.ceil((response.total || 0) / itemsPerPage));
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Không thể tải kết quả tìm kiếm";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [query, buildFilterParams, currentSort, currentPage, itemsPerPage]);

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
  }, [filters, query, pageSize]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearFilters = () => {
    resetFilters();
    setCurrentPage(1);
    setIsMobileFilterOpen(false);
  };

  const handleAddToCart = async (product: ProductSummary) => {
    try {
      await addToCart({
        product_id: product.id,
        product_variant_id: product.defaultVariantId || product.variants?.[0]?.id,
        quantity: 1,
      });
      toast.success("Đã thêm vào giỏ hàng");
    } catch (err) {
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    try {
      await addToWishlist(productId);
      toast.success("Đã thêm vào yêu thích");
    } catch (err) {
      toast.error("Không thể thêm vào yêu thích");
    }
  };

  if (!query) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="text-center">
            <Search className="mx-auto h-20 w-20 text-gray-400 mb-6" />
            <h2 className="text-3xl font-semibold text-gray-900 mb-3">
              Tìm kiếm sản phẩm
            </h2>
            <p className="text-gray-600 text-lg">
              Nhập từ khóa để tìm kiếm sản phẩm mong muốn
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section
        className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black"
        style={{ fontFamily: FONT_SANS }}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative mx-auto px-6 py-16 sm:px-8 lg:px-12 xl:px-16">
          {/* Breadcrumb */}
          <Breadcrumb className="mb-8">
            <BreadcrumbList className="flex items-center space-x-1">
              {crumbs.map((c, idx) => (
                <Fragment key={idx}>
                  {idx > 0 && <BreadcrumbSeparator className="text-white/60" />}
                  <BreadcrumbItem>
                    {idx !== crumbs.length - 1 ? (
                      <BreadcrumbLink
                        href={c.href}
                        className="text-white/80 hover:text-[#D4AF37] transition-colors duration-300"
                      >
                        {c.label}
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="text-white">{c.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                TÌM KIẾM
              </p>
              <h1 className="mt-1 font-['Playfair_Display'] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Kết quả: {dynamicTitle}
              </h1>
              <p
                className="mt-2 text-xs text-white/80 sm:text-sm"
                style={{
                  fontFamily: FONT_SANS,
                }}
              >
                {isLoading
                  ? "Đang tìm kiếm..."
                  : total > 0
                  ? `Tìm thấy ${total} sản phẩm`
                  : "Không tìm thấy sản phẩm nào"}
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-3 text-xs text-white shadow-sm ring-1 ring-white/20 sm:text-sm backdrop-blur">
              <p className="font-medium">
                Tìm kiếm thông minh, nhanh chóng.
              </p>
              <p className="mt-1 text-xs text-white/80">
                Sử dụng bộ lọc để tìm sản phẩm hoàn hảo.
              </p>
            </div>
          </header>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-white pb-16 pt-6">
        <div className="mx-auto flex w-full gap-8 px-6 sm:px-8">
          {/* Filters Sidebar */}
          <aside
            className={`
              hidden lg:block sticky top-0 self-start
              transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isDesktopFilterVisible
                ? 'w-1/4 opacity-100 translate-x-0'
                : 'w-0 opacity-0 -translate-x-4 overflow-hidden'
              }
            `}
          >
            <div className={`
              transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
              ${isDesktopFilterVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
            `}>
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={handleClearFilters}
              />
            </div>
          </aside>

          {/* Products Section */}
          <main className="flex-1">
            {/* Active Filters & Toolbar */}
            <div className="mb-6">
              {activeFilterCount > 0 && (
                <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-black/10 pb-4">
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: FONT_SANS,
                    }}
                  >
                    Bộ lọc đang chọn:
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

                  {(filters.priceRange[0] !== PRICE_RANGE[0] || filters.priceRange[1] !== PRICE_RANGE[1]) && (
                    <Badge
                      variant="secondary"
                      className="bg-black/5 text-black border border-black/20 hover:bg-black/10 transition-colors duration-300 cursor-pointer px-3 py-1"
                      onClick={() => handleRemoveFilter("priceRange")}
                    >
                      {formatCurrency(filters.priceRange[0])} - {formatCurrency(filters.priceRange[1])}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}

                  {filters.inStockOnly && (
                    <Badge
                      variant="secondary"
                      className="bg-black/5 text-black border border-black/20 hover:bg-black/10 transition-colors duration-300 cursor-pointer px-3 py-1"
                      onClick={() => handleRemoveFilter("inStockOnly")}
                    >
                      Còn hàng
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}

                  <button
                    onClick={handleClearFilters}
                    className="text-xs font-medium text-black/60 hover:text-black underline underline-offset-2 transition-colors"
                  >
                    Xóa tất cả
                  </button>
                </div>
              )}

              {/* Toolbar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-black/20 rounded-lg hover:border-[#D4AF37] transition-colors"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span className="text-sm font-medium">Bộ lọc</span>
                    {activeFilterCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-[#D4AF37] text-white"
                      >
                        {activeFilterCount}
                      </Badge>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm text-black/60 hidden sm:inline">
                    {total > 0 ? `${total} sản phẩm` : "Không có sản phẩm"}
                  </span>
                  <Select
                    value={currentSort}
                    onValueChange={(value) =>
                      setFilters((prev) => ({ ...prev, sortBy: value as SortOption }))
                    }
                  >
                    <SelectTrigger className="w-40 border-black/20">
                      <SelectValue placeholder="Sắp xếp" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Nổi bật</SelectItem>
                      <SelectItem value="newest">Mới nhất</SelectItem>
                      <SelectItem value="price-low">Giá thấp đến cao</SelectItem>
                      <SelectItem value="price-high">Giá cao đến thấp</SelectItem>
                      <SelectItem value="popular">Phổ biến</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && <LoadingState itemCount={itemsPerPage} />}

            {/* Error State */}
            {error && !isLoading && <ErrorState message={error} />}

            {/* Empty State */}
            {!isLoading && !error && products.length === 0 && (
              <EmptyState message={`Không tìm thấy sản phẩm nào cho "${query}"`} />
            )}

            {/* Products Grid */}
            {!isLoading && !error && products.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToWishlist={() => handleAddToWishlist(product.id)}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="group relative flex items-center gap-2 px-6 py-3 border border-black/10 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#D4AF37] transition-all duration-300"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="text-sm font-medium">Trước</span>
                    </button>

                    <div className="hidden sm:flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        const showFirstOrLastDot = page === 1 || page === totalPages;
                        const showStartDot = page === 2 && currentPage > 4;
                        const showEndDot = page === totalPages - 1 && currentPage < totalPages - 3;
                        const showPage =
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1) ||
                          (currentPage <= 3 && page <= 4) ||
                          (currentPage >= totalPages - 2 && page >= totalPages - 3);

                        if (showPage) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`
                                relative min-w-[40px] h-10 rounded-lg font-medium text-sm transition-all duration-300
                                ${currentPage === page
                                  ? 'bg-[#D4AF37] text-white shadow-md'
                                  : 'border border-black/10 hover:border-[#D4AF37] hover:text-[#D4AF37]'
                                }
                              `}
                            >
                              {page}
                            </button>
                          );
                        } else if (showStartDot || showEndDot) {
                          return (
                            <span key={page} className="px-2 text-black/40">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    {/* Mobile Pagination */}
                    <div className="sm:hidden">
                      <span className="text-sm text-black/60">
                        Trang {currentPage} / {totalPages}
                      </span>
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="group relative flex items-center gap-2 px-6 py-3 border border-black/10 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:border-[#D4AF37] transition-all duration-300"
                    >
                      <span className="text-sm font-medium">Sau</span>
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </section>

      {/* Mobile Filter Sidebar */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileFilterOpen(false)}
          />
          <div className="fixed right-0 top-0 h-full w-80 overflow-y-auto bg-white shadow-2xl">
            <div className="sticky top-0 z-10 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Bộ lọc</h2>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={() => {
                  handleClearFilters();
                  setIsMobileFilterOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}
