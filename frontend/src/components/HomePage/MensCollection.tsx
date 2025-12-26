import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { getProducts } from "@/lib/api";
import type { ProductSummary, ProductFilterParams } from "@/types/products";
import { LoadingState, ErrorState, EmptyState } from "@/components/feedback/AsyncStates";
import { FONT_SANS, FONT_SERIF } from "@/theme/constants";

const categories = ["Tất cả", "Vest", "Áo sơ mi", "Quần", "Giày"];

export function MensCollection() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All"]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("featured");
  
  // API state
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const categorySlugMap: Record<string, string> = {
        "Suits": "suits",
        "Shirts": "shirts",
        "Pants": "pants",
        "Shoes": "shoes",
      };

      const selectedCategory = selectedCategories.find(c => c !== "All");
      const categorySlug = selectedCategory ? categorySlugMap[selectedCategory] : undefined;

      const filterParams: ProductFilterParams = {
        categorySlug: categorySlug,
        priceMin: priceRange[0] > 0 ? priceRange[0] : undefined,
        priceMax: priceRange[1] < 5000 ? priceRange[1] : undefined,
        sort: sortBy as "featured" | "newest" | "price-low" | "price-high" | "popular",
        page: 1,
        pageSize: 50,
      };

      const response = await getProducts(filterParams);
      setProducts(response.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  }, [priceRange, selectedCategories, sortBy]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const toggleCategory = (category: string) => {
    if (category === "All") {
      setSelectedCategories(["All"]);
    } else {
      const newCategories = selectedCategories.includes(category)
        ? selectedCategories.filter(c => c !== category)
        : [...selectedCategories.filter(c => c !== "All"), category];
      
      setSelectedCategories(newCategories.length === 0 ? ["All"] : newCategories);
    }
  };

  // Filter and sort products (client-side for category filter since we're using categorySlug in API)
  const filteredProducts = products.filter(product => {
    if (selectedCategories.includes("All")) return true;
    
    const productCategory = product.category?.name || "";
    return selectedCategories.some(cat => 
      cat === "All" || productCategory.toLowerCase().includes(cat.toLowerCase())
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.salePrice || a.price) - (b.salePrice || b.price);
      case "price-high":
        return (b.salePrice || b.price) - (a.salePrice || a.price);
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="mb-4 tracking-wider text-sm" style={{ fontWeight: 600 }}>
          DANH MỤC
        </h3>
        <div className="space-y-3">
          {categories.map(category => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
                className="border-[#D4AF37] data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
              />
              <label
                htmlFor={category}
                className="text-sm cursor-pointer hover:text-[#D4AF37] transition-colors"
              >
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="mb-4 tracking-wider text-sm" style={{ fontWeight: 600 }}>
          KHOẢNG GIÁ
        </h3>
        <div className="space-y-4">
          <Slider
            min={0}
            max={5000}
            step={100}
            value={priceRange}
            onValueChange={setPriceRange}
            className="**:[[role=slider]]:bg-[#D4AF37] **[[role=slider]]:border-[#D4AF37]"
          />
          <div className="flex items-center justify-between text-sm text-[#666666]">
            <span>{priceRange[0].toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</span>
            <span>{priceRange[1].toLocaleString('vi-VN', {style: 'currency', currency: 'VND'})}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedCategories.length > 0 && !selectedCategories.includes("Tất cả")) && (
        <Button
          variant="outline"
          className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
          onClick={() => {
            setSelectedCategories(["Tất cả"]);
            setPriceRange([0, 5000]);
          }}
        >
          Xoá tất cả bộ lọc
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 text-sm text-[#666666]">
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Trang chủ</a>
            <span>/</span>
            <span className="text-black">Bộ Sưu Tập Nam</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h1
            className="mb-4"
            style={{ fontSize: '48px', fontFamily: FONT_SERIF, fontWeight: 700 }}
          >
            Bộ Sưu Tập Nam
          </h1>
          <p className="text-[#666666] max-w-2xl mx-auto" style={{ fontSize: '18px', lineHeight: 1.6, fontFamily: FONT_SANS }}>
            Khám phá vẻ đẹp vượt thời gian với bộ sưu tập thời trang nam cao cấp được tuyển chọn
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex gap-12">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24">
              <FilterContent />
            </div>
          </aside>

          {/* Products */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-black/10">
              <div className="flex items-center gap-4">
                <p className="text-sm text-[#666666]">
                  {isLoading ? 'Đang tải...' : `Hiển thị ${sortedProducts.length} sản phẩm`}
                </p>
                
                {/* Mobile Filter Button */}
                <Sheet>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="lg:hidden border-[#D4AF37] text-[#D4AF37]"
                    >
                      <SlidersHorizontal className="h-4 w-4 mr-2" />
                      Bộ lọc
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Bộ lọc</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-[#666666] hidden sm:block">Sắp xếp:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Nổi bật</SelectItem>
                    <SelectItem value="price-low">Giá: Thấp đến Cao</SelectItem>
                    <SelectItem value="price-high">Giá: Cao đến Thấp</SelectItem>
                    <SelectItem value="name">Tên: A → Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && <LoadingState message="Đang tải sản phẩm..." />}

            {error && !isLoading && (
              <ErrorState message={error} onRetry={fetchProducts} />
            )}

            {/* Product Grid */}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedProducts.map(product => {
                  const displayPrice = product.salePrice || product.price;
                  const mainImage = product.images[0] || "";
                  
                  return (
                    <div
                      key={product.id}
                      className="group cursor-pointer bg-white rounded-sm overflow-hidden hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="relative aspect-3/4 overflow-hidden">
                        <ImageWithFallback
                          src={mainImage}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
                        
                        {/* Quick Add Button */}
                        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            className="w-full text-black uppercase tracking-wider"
                            style={{ backgroundColor: '#D4AF37', fontSize: '14px', fontWeight: 600 }}
                          >
                            Thêm Nhanh
                          </Button>
                        </div>
                      </div>

                      <div className="p-4">
                        <p
                          className="text-xs tracking-wider mb-1"
                          style={{ color: '#D4AF37', fontSize: '12px' }}
                        >
                          {product.brand}
                        </p>
                        <h3
                          className="mb-2 hover:text-[#D4AF37] transition-colors"
                          style={{ fontSize: '16px', fontWeight: 500 }}
                        >
                          {product.name}
                        </h3>
                        <p
                          className="mb-3"
                          style={{ fontSize: '18px', fontWeight: 600, fontFamily: "'Playfair Display', serif" }}
                        >
                          ${displayPrice.toLocaleString()}
                        </p>

                        {/* Color Dots */}
                        {product.colors.length > 0 && (
                          <div className="flex gap-2">
                            {product.colors.slice(0, 5).map((color, colorIndex) => (
                              <div
                                key={colorIndex}
                                className="w-6 h-6 rounded-full border-2 border-gray-200 hover:border-[#D4AF37] transition-colors cursor-pointer"
                                style={{ backgroundColor: color }}
                                title={color}
                              ></div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {!isLoading && !error && sortedProducts.length === 0 && (
              <EmptyState title="Không tìm thấy sản phẩm" />
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
