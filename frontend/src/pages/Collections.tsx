import { useState, useEffect } from "react";
import {
  Grid,
  List,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { allProducts } from "../data/products";
import type {
  Product,
  FilterState,
  SortOption,
  ViewMode,
} from "@/types/products";

export function Collections() {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    sizes: [],
    colors: [],
    priceRange: [0, 500],
    brands: [],
    inStockOnly: false,
  });

  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<ViewMode>("grid-4");
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] =
    useState(false);
  const [isDesktopFilterVisible, setIsDesktopFilterVisible] =
    useState(true);
  const [selectedProduct, setSelectedProduct] =
    useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const itemsPerPage = 12;

  // Filter products
  const filteredProducts = allProducts.filter((product) => {
    // Category filter
    if (
      filters.categories.length > 0 &&
      !filters.categories.includes(product.category)
    ) {
      return false;
    }

    // Size filter
    if (
      filters.sizes.length > 0 &&
      !filters.sizes.some((size) =>
        product.sizes.includes(size),
      )
    ) {
      return false;
    }

    // Color filter
    if (
      filters.colors.length > 0 &&
      !filters.colors.some((color) =>
        product.colors.some((pc) => pc.name === color),
      )
    ) {
      return false;
    }

    // Price filter
    const price = product.salePrice || product.price;
    if (
      price < filters.priceRange[0] ||
      price > filters.priceRange[1]
    ) {
      return false;
    }

    // Brand filter
    if (
      filters.brands.length > 0 &&
      !filters.brands.includes(product.brand)
    ) {
      return false;
    }

    // In stock filter
    if (filters.inStockOnly && !product.inStock) {
      return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      case "price-low":
        return (
          (a.salePrice || a.price) - (b.salePrice || b.price)
        );
      case "price-high":
        return (
          (b.salePrice || b.price) - (a.salePrice || a.price)
        );
      case "popular":
        return b.reviewCount - a.reviewCount;
      default:
        return 0;
    }
  });

  // Paginate products
  const totalPages = Math.ceil(
    sortedProducts.length / itemsPerPage,
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      sizes: [],
      colors: [],
      priceRange: [0, 500],
      brands: [],
      inStockOnly: false,
    });
    setCurrentPage(1); // Reset to first page when clearing filters
    setIsMobileFilterOpen(false); // Close mobile filter drawer
  };

  const handleRemoveFilter = (
    type: keyof FilterState,
    value?: string,
  ) => {
    if (
      type === "categories" ||
      type === "sizes" ||
      type === "colors" ||
      type === "brands"
    ) {
      setFilters({
        ...filters,
        [type]: filters[type].filter(
          (item: string) => item !== value,
        ),
      });
      setCurrentPage(1); // Reset to first page when removing a filter
    } else if (type === "priceRange") {
      setFilters({
        ...filters,
        priceRange: [0, 500],
      });
      setCurrentPage(1);
    } else if (type === "inStockOnly") {
      setFilters({
        ...filters,
        inStockOnly: false,
      });
      setCurrentPage(1);
    }
  };

  const getActiveFilterCount = () => {
    return (
      filters.categories.length +
      filters.sizes.length +
      filters.colors.length +
      filters.brands.length +
      (filters.inStockOnly ? 1 : 0) +
      (filters.priceRange[0] !== 0 ||
      filters.priceRange[1] !== 500
        ? 1
        : 0)
    );
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleAddToWishlist = (productId: string) => {
    console.log("Add to wishlist:", productId);
    // Implement wishlist logic
  };

  const handleAddToCart = (productId: string) => {
    console.log("Add to cart:", productId);
    // Implement cart logic
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/"
                className="text-[#666666] hover:text-[#D4AF37] transition-colors duration-300"
              >
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/men"
                className="text-[#666666] hover:text-[#D4AF37] transition-colors duration-300"
              >
                Men
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Shirts</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Page Header */}
        <div className="mb-6">
          <h1
            className="mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "36px",
              fontWeight: 600,
              letterSpacing: "-0.5px",
            }}
          >
            Men's Shirts
          </h1>
          <p className="text-sm text-[#666666]">
            Showing {sortedProducts.length} products
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Desktop Only */}
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

          {/* Main Content */}
          <main className="flex-1">
            {/* Sort & Filter Bar */}
            <div className="mb-6">
              {/* Active Filters Row */}
              {getActiveFilterCount() > 0 && (
                <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-black/10">
                  <span
                    className="text-sm"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Active Filters:
                  </span>

                  {filters.categories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className="bg-black/5 text-black border border-black/20 hover:bg-black/10 transition-colors duration-300 cursor-pointer px-3 py-1"
                      onClick={() =>
                        handleRemoveFilter(
                          "categories",
                          category,
                        )
                      }
                    >
                      {category}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  ))}

                  {filters.sizes.map((size) => (
                    <Badge
                      key={size}
                      variant="secondary"
                      className="bg-black/5 text-black border border-black/20 hover:bg-black/10 transition-colors duration-300 cursor-pointer px-3 py-1"
                      onClick={() =>
                        handleRemoveFilter("sizes", size)
                      }
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
                      onClick={() =>
                        handleRemoveFilter("colors", color)
                      }
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
                      onClick={() =>
                        handleRemoveFilter("brands", brand)
                      }
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
                      onClick={() =>
                        handleRemoveFilter("priceRange")
                      }
                    >
                      ${filters.priceRange[0]} - $
                      {filters.priceRange[1]}
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}

                  {filters.inStockOnly && (
                    <Badge
                      variant="secondary"
                      className="bg-black/5 text-black border border-black/20 hover:bg-black/10 transition-colors duration-300 cursor-pointer px-3 py-1"
                      onClick={() =>
                        handleRemoveFilter("inStockOnly")
                      }
                    >
                      In Stock
                      <X className="w-3 h-3 ml-1" />
                    </Badge>
                  )}

                  <button
                    onClick={handleClearFilters}
                    className="text-sm underline transition-all duration-300"
                    style={{
                      color: "#D4AF37",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    Clear All
                  </button>
                </div>
              )}

              {/* Top Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Filter Toggle Buttons */}
                <div className="flex items-center gap-3">
                  {/* Mobile Filter Button */}
                  <button
                    onClick={() => setIsMobileFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-black/20 hover:border-[#D4AF37] transition-all duration-300"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    FILTERS
                  </button>

                  {/* Desktop Filter Toggle */}
                  <button
                    onClick={() =>
                      setIsDesktopFilterVisible(
                        !isDesktopFilterVisible,
                      )
                    }
                    className="hidden lg:flex items-center gap-2 px-4 py-2 border border-black/20 hover:border-[#D4AF37] transition-all duration-300"
                    style={{
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    {isDesktopFilterVisible
                      ? "HIDE FILTERS"
                      : "SHOW FILTERS"}
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#666666]">
                    Sort by:
                  </span>
                  <Select
                    value={sortBy}
                    onValueChange={(value) =>
                      setSortBy(value as SortOption)
                    }
                  >
                    <SelectTrigger className="w-48 border-black/20 focus:border-[#D4AF37]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">
                        Featured
                      </SelectItem>
                      <SelectItem value="newest">
                        Newest
                      </SelectItem>
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="popular">
                        Most Popular
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* View Toggle */}
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
                    <Grid
                      className="w-4 h-4"
                      strokeWidth={2.5}
                    />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-[#D4AF37]"
                        : "hover:bg-black/5"
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div
              className={`
                grid gap-6 mb-12 transition-all duration-500
                ${viewMode === "grid-4" ? `grid-cols-1 sm:grid-cols-2 ${isDesktopFilterVisible ? "lg:grid-cols-3 xl:grid-cols-4" : "lg:grid-cols-4 xl:grid-cols-5"}` : ""}
                ${viewMode === "grid-3" ? `grid-cols-1 sm:grid-cols-2 ${isDesktopFilterVisible ? "lg:grid-cols-3" : "lg:grid-cols-4"}` : ""}
                ${viewMode === "list" ? "grid-cols-1" : ""}
              `}
            >
              {paginatedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={handleQuickView}
                  onAddToWishlist={handleAddToWishlist}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.max(1, prev - 1),
                    )
                  }
                  disabled={currentPage === 1}
                  className="p-2 border-2 border-black/20 disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from(
                  { length: Math.min(totalPages, 5) },
                  (_, i) => {
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
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  },
                )}

                {totalPages > 5 &&
                  currentPage < totalPages - 2 && (
                    <>
                      <span className="text-[#666666]">
                        ...
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage(totalPages)
                        }
                        className="w-10 h-10 border-2 border-black/20 text-[#666666] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                        }}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(totalPages, prev + 1),
                    )
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 border-2 border-black/20 disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* No Results */}
            {sortedProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-xl text-[#666666] mb-4">
                  No products found matching your filters
                </p>
                <button
                  onClick={handleClearFilters}
                  className="px-6 py-3 border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Sidebar */}
      <FilterSidebar
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
        isMobileOpen={isMobileFilterOpen}
        onMobileClose={() => setIsMobileFilterOpen(false)}
      />

      {/* Quick View Modal */}
      <Dialog
        open={isQuickViewOpen}
        onOpenChange={setIsQuickViewOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "28px",
              }}
            >
              Quick View
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="aspect-[3/4] bg-gray-soft">
                <img
                  src={selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-[#666666] mb-2">
                    {selectedProduct.brand}
                  </p>
                  <h3
                    className="mb-4"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: "24px",
                    }}
                  >
                    {selectedProduct.name}
                  </h3>
                  <p
                    className="text-black"
                    style={{
                      fontSize: "28px",
                      fontWeight: 600,
                    }}
                  >
                    $
                    {selectedProduct.salePrice ||
                      selectedProduct.price}
                  </p>
                </div>
                <p className="text-[#666666]">
                  Premium quality shirt crafted with attention
                  to detail. Perfect for both formal and casual
                  occasions.
                </p>
                <button
                  className="w-full py-3 bg-[#D4AF37] text-black hover:bg-black hover:text-white transition-all duration-300"
                  style={{
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
      <BackToTop />
    </div>
  );
}