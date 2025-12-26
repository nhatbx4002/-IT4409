import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import MainLayout from "@/layout/MainLayout";
import { FilterSidebar } from "@/components/FiltersSidebar";
import { ProductCard } from "@/components/ProductsCard";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
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
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { addToCart, addToWishlist, getProducts, getCollectionBySlug, getCollectionProducts, getCollections } from "@/lib/api";
import type { ProductSummary, SortOption } from "@/types/products";
import type { Collection } from "@/types/collections";
import { useProductFilters } from "@/hooks/useProductFilters";
import { EmptyState, ErrorState, LoadingState } from "@/components/feedback/AsyncStates";
import {
  BRAND_GOLD,
  CATEGORY_LABEL_MAP,
  FONT_SANS,
} from "@/theme/constants";
import { PRICE_RANGE } from "@/data/filter-options";
import { toast } from "sonner";

export function Collections() {
  const { collection, category } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const isNew = searchParams.get("new") === "1";
  const pageSize = Number(searchParams.get("pageSize") ?? 12);
  const sortParam = (searchParams.get("sort") ?? "featured") as SortOption;

  const capitalize = (s?: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN').format(value) + '₫';

  // Vietnamese category slugs that should be treated as categories, not collections
  const VIETNAMESE_CATEGORY_SLUGS = ['ao', 'quan', 'nuoc-hoa', 'phu-kien', 'hang-moi'];

  // Determine if the collection parameter is actually a Vietnamese category
  const isVietnameseCategory = collection && VIETNAMESE_CATEGORY_SLUGS.includes(collection);
  const effectiveCategory = isVietnameseCategory ? collection : category;
  const effectiveCollection = isVietnameseCategory ? undefined : collection;

  const dynamicTitle =
    (searchParams.get("title") ??
      [collection, category].filter(Boolean).join(" / ")) ||
    "Collection";

  // State declarations
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isDesktopFilterVisible, setIsDesktopFilterVisible] = useState(true);
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [collectionData, setCollectionData] = useState<Collection | null>(null);
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [productCounts, setProductCounts] = useState<Record<number, number>>({});

  const {
    filters,
    setFilters,
    resetFilters,
    removeFilter,
    activeFilterCount,
    buildFilterParams,
  } = useProductFilters({
    collection: effectiveCollection as "men" | "women" | "accessories" | undefined,
    categoryFromUrl: effectiveCategory,
    initialSort: sortParam,
  });

  const crumbs = [
    { label: "Trang chủ", href: "/" },
    ...(collectionData
      ? [{ label: collectionData.name, href: `/collections/${collectionData.slug}` }]
      : collection
      ? [{ label: capitalize(collection), href: `/collections/${collection}` }]
      : []),
    ...(category ? [{ label: category }] : []),
  ];

  const currentSort = (filters.sortBy ?? sortParam) as SortOption;
  const itemsPerPage = pageSize;

  // Check if we should use collection API (has collection slug and not a Vietnamese category)
  const shouldUseCollectionAPI = effectiveCollection && !isVietnameseCategory;
  
  // Check if we're on the collections listing page (no collection slug)
  const isCollectionsListingPage = !collection && !category;

  // Fetch all collections for listing page
  const fetchCollections = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const collections = await getCollections();
      setAllCollections(collections);

      // Fetch product counts for each collection
      const counts: Record<number, number> = {};
      await Promise.all(
        collections.map(async (col) => {
          try {
            const response = await getCollectionProducts(col.slug, {
              page: 1,
              limit: 1,
            });
            counts[col.id] = response.total || 0;
          } catch (err) {
            console.error(`Error fetching count for collection ${col.slug}:`, err);
            counts[col.id] = 0;
          }
        })
      );
      setProductCounts(counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch collections");
      console.error("Error fetching collections:", err);
      setAllCollections([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (shouldUseCollectionAPI && effectiveCollection) {
        // Use collection API
        const [collection, collectionProducts] = await Promise.all([
          getCollectionBySlug(effectiveCollection),
          getCollectionProducts(effectiveCollection, {
            page: currentPage,
            limit: itemsPerPage,
          }),
        ]);

        setCollectionData(collection);
        setProducts(collectionProducts.products);
        setTotal(collectionProducts.total);
        // Calculate total pages
        const calculatedTotalPages = Math.ceil(collectionProducts.total / itemsPerPage);
        setTotalPages(calculatedTotalPages);
      } else {
        // Use regular product search
        const params = buildFilterParams({
          sort: currentSort,
          page: currentPage,
          pageSize: itemsPerPage,
        });

        const response = await getProducts(params);

        setProducts(response.products);
        setTotal(response.total);
        setTotalPages(response.totalPages);
        setCollectionData(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products");
      console.error("Error fetching products:", err);
      setProducts([]);
      setTotal(0);
      setTotalPages(0);
      setCollectionData(null);
    } finally {
      setIsLoading(false);
    }
  }, [shouldUseCollectionAPI, effectiveCollection, buildFilterParams, currentPage, currentSort, itemsPerPage]);

  useEffect(() => {
    if (isCollectionsListingPage) {
      fetchCollections();
    } else {
      fetchProducts();
    }
  }, [
    isCollectionsListingPage,
    fetchCollections,
    fetchProducts,
    // Only include filter dependencies if not using collection API
    ...(shouldUseCollectionAPI ? [] : [
      filters.sizes,
      filters.colors,
      filters.priceRange,
      filters.brands,
      filters.inStockOnly,
      filters.categories,
    ]),
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

  const handleAddToWishlist = async (productId: number) => {
    try {
      await addToWishlist(productId);
      toast.success("Đã thêm vào wishlist");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể thêm vào wishlist";
      toast.error(message);
    }
  };

  const handleAddToCart = async (product: ProductSummary) => {
    try {
      if (!product.defaultVariantId) {
        toast.error("Vui lòng chọn phiên bản sản phẩm");
        return;
      }

      await addToCart(product.defaultVariantId, 1);
      toast.success("Đã thêm vào giỏ");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể thêm vào giỏ";
      toast.error(message);
    }
  };

  // Render collections listing page
  if (isCollectionsListingPage) {
    return (
      <MainLayout>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          <div className="relative w-full px-4 py-10 sm:px-8 lg:px-12">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/"
                    className="text-white/80 hover:text-[#D4AF37] transition-colors duration-300"
                  >
                    Trang chủ
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-white/60" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white">Collections</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                  Bộ Sưu Tập
                </p>
                <h1 className="mt-1 font-['Playfair_Display'] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Tất Cả Collections
                </h1>
                <p
                  className="mt-2 text-xs text-white/80 sm:text-sm"
                  style={{
                    fontFamily: FONT_SANS,
                  }}
                >
                  {isLoading
                    ? "Đang tải..."
                    : `Hiển thị ${allCollections.length} collections`}
                </p>
              </div>
            </header>
          </div>
        </section>

        <section className="bg-white pb-16 pt-6">
          <div className="mx-auto w-full px-6 sm:px-8">
            {isLoading && <LoadingState message="Đang tải collections..." />}
            {error && !isLoading && (
              <ErrorState message={error} onRetry={fetchCollections} />
            )}
            {!isLoading && !error && allCollections.length === 0 && (
              <EmptyState
                title="Chưa có collections nào"
                actionLabel="Quay lại trang chủ"
                onAction={() => navigate("/")}
              />
            )}
            {!isLoading && !error && allCollections.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {allCollections.map((col) => (
                  <div
                    key={col.id}
                    onClick={() => navigate(`/collections/${col.slug}`)}
                    className="group cursor-pointer relative overflow-hidden aspect-3/4 bg-gray-100"
                  >
                    <ImageWithFallback
                      src={col.banner_image || "https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1800&q=80"}
                      alt={col.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300"></div>
                    
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        boxShadow: 'inset 0 0 0 3px #D4AF37'
                      }}
                    ></div>
                    
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                      {col.description && (
                        <p
                          className="text-sm tracking-[0.3em] uppercase mb-2 text-center"
                          style={{ color: '#D4AF37' }}
                        >
                          {col.description.length > 50
                            ? col.description.substring(0, 50) + '...'
                            : col.description}
                        </p>
                      )}
                      <h3
                        className="text-white text-center uppercase tracking-[0.2em] px-4"
                        style={{ fontSize: '24px', fontFamily: "'Playfair Display', serif", fontWeight: 500 }}
                      >
                        {col.name}
                      </h3>
                      {productCounts[col.id] !== undefined && (
                        <p className="text-xs text-gray-300 mt-2">
                          {productCounts[col.id]} sản phẩm
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="relative overflow-hidden">
        {collectionData?.banner_image ? (
          <>
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${collectionData.banner_image})` }} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503341504253-dff4815485f1?auto=format&fit=crop&w=1800&q=80')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </>
        )}
        <div className="relative w-full px-4 py-10 sm:px-8 lg:px-12">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              {crumbs.map((c, idx) => (
                <Fragment key={`${c.label}-${idx}`}>
                  <BreadcrumbItem>
                    {c.href ? (
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
                  {idx < crumbs.length - 1 && <BreadcrumbSeparator className="text-white/60" />}
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>

          <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
                {collectionData?.name || (collection ? capitalize(collection) : "Tất cả thời trang nam")}
              </p>
              <h1 className="mt-1 font-['Playfair_Display'] text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {collectionData?.name || dynamicTitle}
              </h1>
              {collectionData?.description && (
                <p
                  className="mt-2 text-sm text-white/90 sm:text-base max-w-2xl"
                  style={{
                    fontFamily: FONT_SANS,
                  }}
                >
                  {collectionData.description}
                </p>
              )}
              <p
                className="mt-2 text-xs text-white/80 sm:text-sm"
                style={{
                  fontFamily: FONT_SANS,
                }}
              >
                {isLoading
                  ? "Đang tổ chức lựa chọn..."
                  : `Hiển thị ${total} sản phẩm được lựa chọn`}
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 px-4 py-3 text-xs text-white shadow-sm ring-1 ring-white/20 sm:text-sm backdrop-blur">
              <p className="font-medium">
                Thời trang hàng hiệu, được thiết kế để chuyển động.
              </p>
              <p className="mt-1 text-xs text-white/80">
                Lướt qua các bộ lọc để tìm kiếm bộ trang phục hoàn hảo của bạn.
              </p>
            </div>
          </header>
        </div>
      </section>

      <section className="bg-white pb-16 pt-6">
        <div className="mx-auto flex w-full gap-8 px-6 sm:px-8">
          {!shouldUseCollectionAPI && (
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
          )}

          <main className="flex-1">
            <div className="mb-6">
              {!shouldUseCollectionAPI && activeFilterCount > 0 && (
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

                  {(filters.priceRange[0] !== PRICE_RANGE[0] ||
                    filters.priceRange[1] !== PRICE_RANGE[1]) && (
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
                    className="text-sm underline transition-all duration-300"
                    style={{
                      color: BRAND_GOLD,
                      fontFamily: FONT_SANS,
                    }}
                  >
                    Xoá hết
                  </button>
                </div>
              )}

                {!shouldUseCollectionAPI && (
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
                        BỘ LỌC
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
                        {isDesktopFilterVisible ? "ẨN BỘ LỌC" : "HIỆN BỘ LỌC"}
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm text-[#666666]">Sắp xếp theo:</span>
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
                          <SelectItem value="featured">Nổi bật</SelectItem>
                          <SelectItem value="newest">Mới nhất</SelectItem>
                          <SelectItem value="price-low">
                            Giá: Thấp đến Cao
                          </SelectItem>
                          <SelectItem value="price-high">
                            Giá: Cao đến Thấp
                          </SelectItem>
                          <SelectItem value="popular">Phổ biến nhất</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
            </div>

            <div className="min-h-[50vh]">
              {isLoading && <LoadingState message="Đang tải sản phẩm..." />}

              {error && !isLoading && (
                <ErrorState message={error} onRetry={fetchProducts} />
              )}

              {!isLoading && !error && !hasNoResults && (
                <div
                  className={`
                    grid gap-6 mb-12
                    grid-cols-1 sm:grid-cols-2
                    transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
                    ${isDesktopFilterVisible
                      ? "lg:grid-cols-3 xl:grid-cols-4"
                      : "lg:grid-cols-4 xl:grid-cols-5"
                    }
                  `}
                >
                  {paginatedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToWishlist={handleAddToWishlist}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              )}

              {hasNoResults && (
                <div className="min-h-[40vh] flex items-center justify-center">
                  <EmptyState
                    title="Không tìm thấy sản phẩm phù hợp với bộ lọc của bạn"
                    actionLabel="Xóa tất cả bộ lọc"
                    onAction={handleClearFilters}
                  />
                </div>
              )}
            </div>

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

          </main>
        </div>
      </section>

      {!shouldUseCollectionAPI && (
        <FilterSidebar
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={handleClearFilters}
          isMobileOpen={isMobileFilterOpen}
          onMobileClose={() => setIsMobileFilterOpen(false)}
        />
      )}

    </MainLayout>
  );
}
