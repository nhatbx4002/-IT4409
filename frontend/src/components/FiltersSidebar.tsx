import { useState, useEffect } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import type { ProductFiltersState } from "@/types/products";
import { CATEGORY_OPTIONS, BRAND_OPTIONS, COLOR_OPTIONS, PRICE_RANGE, PRICE_STEP } from "@/data/filter-options";
import { FONT_SANS } from "@/theme/constants";

interface FilterSidebarProps {
  filters: ProductFiltersState;
  onFilterChange: (filters: ProductFiltersState) => void;
  onClearFilters: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function FilterSidebar({ 
  filters, 
  onFilterChange, 
  onClearFilters,
  isMobileOpen = false,
  onMobileClose
}: FilterSidebarProps) {
  const isMobile = typeof onMobileClose === "function";
  // Pending filters for "Apply" mode (mobile only)
  const [pendingFilters, setPendingFilters] = useState<ProductFiltersState>(filters);
  const activeFilters = isMobile ? pendingFilters : filters;
  
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'category', 'size', 'color', 'brand'
  ]);

  // Search states for expandable categories
  const [brandSearch, setBrandSearch] = useState('');
  const [showMoreBrands, setShowMoreBrands] = useState(false);
  const [showMoreCategories, setShowMoreCategories] = useState(false);

  // Update pending filters when actual filters change from outside
  useEffect(() => {
    if (isMobile) {
      setPendingFilters(filters);
    }
  }, [filters, isMobile]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('vi-VN').format(value) + '₫';

  const handleApplyFilters = () => {
    if (!isMobile) return;
    onFilterChange(pendingFilters);
    onMobileClose?.();
  };

  const handleCancel = () => {
    if (!isMobile) return;
    setPendingFilters(filters);
    onMobileClose?.();
  };

  // Get active count for each section using active filters
  const getFilterCount = (id: string) => {
    switch (id) {
      case 'category':
        return activeFilters.categories.length;
      case 'size':
        return activeFilters.sizes.length;
      case 'color':
        return activeFilters.colors.length;
      case 'brand':
        return activeFilters.brands.length;
      case 'price':
        return (activeFilters.priceRange[0] !== PRICE_RANGE[0] ||
          activeFilters.priceRange[1] !== PRICE_RANGE[1]) ? 1 : 0;
      default:
        return 0;
    }
  };

  const FilterSection = ({ 
    title, 
    id, 
    children 
  }: { 
    title: string; 
    id: string; 
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections.includes(id);
    const activeCount = getFilterCount(id);
    
    return (
      <div className="border-b border-black/8 last:border-0">
        <button
          onClick={() => toggleSection(id)}
          className="w-full py-4 flex items-center justify-between text-left transition-colors duration-200 hover:text-black"
        >
          <div className="flex items-center gap-2">
            <span
              className="text-black font-semibold"
              style={{
                fontFamily: FONT_SANS,
                fontSize: '15px'
              }}
            >
              {title}
            </span>
            {activeCount > 0 && (
              <span
                className="px-2.5 py-1 rounded-full text-xs text-black font-bold"
                style={{
                  backgroundColor: '#D4AF37',
                  fontFamily: FONT_SANS
                }}
              >
                {activeCount}
              </span>
            )}
          </div>
          <ChevronDown
            className={`w-5 h-5 text-black/70 transition-transform duration-300 ease-out ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>

        <div
          className="grid transition-[grid-template-rows] duration-400 ease-out"
          style={{
            gridTemplateRows: isExpanded ? '1fr' : '0fr',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div className="overflow-hidden">
            <div className="pb-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const filterContent = (
    <>
      {/* Category Filter */}
      <FilterSection title="Sản phẩm" id="category">
        <div className="space-y-3">
          {CATEGORY_OPTIONS.slice(0, showMoreCategories ? undefined : 5).map((category) => (
            <div key={category.slug} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.slug}`}
                checked={activeFilters.categories.includes(category.slug)}
                onCheckedChange={(checked) => {
                  const nextFilters = {
                    ...activeFilters,
                    categories: checked
                      ? [...activeFilters.categories, category.slug]
                      : activeFilters.categories.filter(c => c !== category.slug)
                  };
                  if (isMobile) {
                    setPendingFilters(nextFilters);
                  } else {
                    onFilterChange(nextFilters);
                  }
                }}
                className="border-2 border-black/20 data-[state=checked]:bg-black data-[state=checked]:border-black w-5 h-5"
              />
              <Label
                htmlFor={`category-${category.slug}`}
                className="cursor-pointer text-sm text-[#333333] hover:text-black transition-colors duration-200 ease-out font-medium"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </div>
        
        {CATEGORY_OPTIONS.length > 5 && (
          <button
            onClick={() => setShowMoreCategories(!showMoreCategories)}
            className="mt-3 text-xs font-semibold text-[#D4AF37] hover:text-[#C99D2B] transition-colors duration-200 ease-out hover:scale-105 active:scale-95 underline inline-block"
          >
            {showMoreCategories ? 'Thu gọn' : 'Xem thêm'}
          </button>
        )}
      </FilterSection>

      <Separator className="my-0" />

      {/* Size Filter */}
      <FilterSection title="Kích cỡ" id="size">
        <div className="grid grid-cols-3 gap-2">
          {[
            '29', '30', '31', '32', '33', '34', '35', '36', '38', '39',
            '40', '41', '42', '43', '44', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'
          ].map((size) => (
              <button
                key={size}
                onClick={() => {
                const nextFilters = {
                  ...activeFilters,
                  sizes: activeFilters.sizes.includes(size)
                    ? activeFilters.sizes.filter(s => s !== size)
                    : [...activeFilters.sizes, size]
                };
                if (isMobile) {
                  setPendingFilters(nextFilters);
                } else {
                  onFilterChange(nextFilters);
                }
              }}
              className={`
                py-2.5 px-1 rounded-lg border-2 font-semibold text-sm
                transition-all duration-200 ease-out
                hover:scale-105 active:scale-95
                ${activeFilters.sizes.includes(size)
                  ? 'border-black bg-black text-white shadow-md scale-105'
                  : 'border-black/15 text-black/70 hover:border-black/30 active:border-black'
                }
              `}
              style={{ fontFamily: FONT_SANS }}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <Separator className="my-0" />

      {/* Color Filter */}
      <FilterSection title="Màu sắc" id="color">
        <div className="flex gap-4 flex-wrap">
          {COLOR_OPTIONS.map((color) => (
            <div key={color.name} className="flex flex-col items-center gap-2">
              <button
                onClick={() => {
                  const nextFilters = {
                    ...activeFilters,
                    colors: activeFilters.colors.includes(color.name)
                      ? activeFilters.colors.filter(c => c !== color.name)
                      : [...activeFilters.colors, color.name]
                  };
                  if (isMobile) {
                    setPendingFilters(nextFilters);
                  } else {
                    onFilterChange(nextFilters);
                  }
                }}
                className={`
                  relative w-12 h-12 rounded-full border-3
                  transition-all duration-200 ease-out
                  hover:scale-110 active:scale-95
                  ${activeFilters.colors.includes(color.name)
                    ? 'border-black ring-2 ring-black ring-offset-2 shadow-lg scale-110'
                    : 'border-gray-300 hover:border-black/50'
                  }
                  ${['#FFFFFF', '#F5F5DC'].includes(color.hex) ? 'border-black/30' : ''}
                `}
                style={{
                  backgroundColor: color.hex,
                  boxShadow: ['#FFFFFF', '#F5F5DC'].includes(color.hex)
                    ? 'inset 0 0 0 1px rgba(0,0,0,0.1)'
                    : undefined
                }}
                title={color.name}
                aria-label={color.name}
              />
              <span className="text-xs text-black/70 font-medium text-center w-12 truncate">
                {color.name}
              </span>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator className="my-0" />

      {/* Price Range Filter */}
      <FilterSection title="Giá" id="price">
        <div className="space-y-4">
          {/* Price Display Labels */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex-1">
              <span className="text-xs text-black/50 uppercase tracking-wider font-semibold">Min</span>
              <div className="text-lg font-bold text-black">{formatCurrency(activeFilters.priceRange[0])}</div>
            </div>
            <div className="w-px h-8 bg-black/10" />
            <div className="flex-1 text-right">
              <span className="text-xs text-black/50 uppercase tracking-wider font-semibold">Max</span>
              <div className="text-lg font-bold text-black">{formatCurrency(activeFilters.priceRange[1])}</div>
            </div>
          </div>

          {/* Slider - Improved thickness and styling */}
          <div className="py-2">
            <Slider
              value={activeFilters.priceRange}
              onValueChange={(value) => {
                const nextFilters = {
                  ...activeFilters,
                  priceRange: value as [number, number]
                };
                if (isMobile) {
                  setPendingFilters(nextFilters);
                } else {
                  onFilterChange(nextFilters);
                }
              }}
              min={PRICE_RANGE[0]}
              max={PRICE_RANGE[1]}
              step={PRICE_STEP}
              className="[&_[role=slider]]:bg-black [&_[role=slider]]:border-black [&_[role=slider]]:w-5 [&_[role=slider]]:h-5 [&_[role=slider]]:shadow-md"
            />
          </div>

          {/* Price inputs for precise control */}
          <div className="flex gap-2 mt-3">
            <div className="flex-1">
              <Input
                type="number"
                min={PRICE_RANGE[0]}
                max={PRICE_RANGE[1]}
                value={activeFilters.priceRange[0]}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), activeFilters.priceRange[1]);
                  const nextFilters = {
                    ...activeFilters,
                    priceRange: [Math.max(val, PRICE_RANGE[0]), activeFilters.priceRange[1]]
                  };
                  if (isMobile) {
                    setPendingFilters(nextFilters);
                  } else {
                    onFilterChange(nextFilters);
                  }
                }}
                className="w-full px-3 py-2 border-2 border-black/15 rounded-lg text-sm font-medium focus:border-black focus:outline-none transition-colors"
                placeholder="Min"
              />
            </div>
            <div className="flex-1">
              <Input
                type="number"
                min={PRICE_RANGE[0]}
                max={PRICE_RANGE[1]}
                value={activeFilters.priceRange[1]}
                onChange={(e) => {
                  const val = Math.max(Number(e.target.value), activeFilters.priceRange[0]);
                  const nextFilters = {
                    ...activeFilters,
                    priceRange: [activeFilters.priceRange[0], Math.min(val, PRICE_RANGE[1])]
                  };
                  if (isMobile) {
                    setPendingFilters(nextFilters);
                  } else {
                    onFilterChange(nextFilters);
                  }
                }}
                className="w-full px-3 py-2 border-2 border-black/15 rounded-lg text-sm font-medium focus:border-black focus:outline-none transition-colors"
                placeholder="Max"
              />
            </div>
          </div>
        </div>
      </FilterSection>

      <Separator className="my-0" />

      {/* Brand Filter */}
      <FilterSection title="Nhãn hàng" id="brand">
        <div className="space-y-4">
          {/* Brand Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40" />
            <Input
              type="text"
              placeholder="Tìm nhãn hàng..."
              value={brandSearch}
              onChange={(e) => setBrandSearch(e.target.value.toLowerCase())}
              className="w-full pl-10 pr-3 py-2 border-2 border-black/15 rounded-lg text-sm focus:border-black focus:outline-none transition-colors bg-white"
            />
          </div>

          {/* Brand List */}
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2" style={{ scrollbarWidth: 'thin' }}>
            {BRAND_OPTIONS
              .filter(brand => brand.toLowerCase().includes(brandSearch))
              .slice(0, showMoreBrands ? undefined : 5)
              .map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={activeFilters.brands.includes(brand)}
                    onCheckedChange={(checked) => {
                      const nextFilters = {
                        ...activeFilters,
                        brands: checked
                          ? [...activeFilters.brands, brand]
                          : activeFilters.brands.filter(b => b !== brand)
                      };
                      if (isMobile) {
                        setPendingFilters(nextFilters);
                      } else {
                        onFilterChange(nextFilters);
                      }
                    }}
                    className="border-2 border-black/20 data-[state=checked]:bg-black data-[state=checked]:border-black w-5 h-5"
                  />
                  <Label
                    htmlFor={`brand-${brand}`}
                    className="cursor-pointer text-sm text-[#333333] hover:text-black transition-colors duration-200 ease-out font-medium"
                  >
                    {brand}
                  </Label>
                </div>
              ))}
          </div>

          {/* Show More/Less for Brands */}
          {BRAND_OPTIONS.filter(b => b.toLowerCase().includes(brandSearch)).length > 5 && (
            <button
              onClick={() => setShowMoreBrands(!showMoreBrands)}
              className="w-full mt-2 text-xs font-semibold text-[#D4AF37] hover:text-[#C99D2B] transition-all duration-200 ease-out hover:scale-105 active:scale-95 underline py-1"
            >
              {showMoreBrands ? 'Thu gọn' : 'Xem thêm'}
            </button>
          )}
        </div>
      </FilterSection>

      {/* Action Buttons - Primary Ghost Style */}
      {isMobile && (
        <div className="mt-8 pt-6 border-t border-black/10 flex gap-3 items-center">
          {/* Primary Button - Apply Filters */}
          <button
            onClick={handleApplyFilters}
            className="flex-1 py-3 bg-black text-white font-semibold text-sm transition-all duration-200 ease-out hover:bg-black/90 hover:scale-[1.02] active:scale-95 active:shadow-inner shadow-md rounded-lg"
            style={{
              fontFamily: FONT_SANS
            }}
          >
            LƯU
          </button>

          {/* Ghost Button - Clear/Cancel */}
          <button
            onClick={handleCancel}
            className="text-xs font-semibold text-black/60 hover:text-black transition-all duration-200 ease-out hover:scale-105 active:scale-95 underline decoration-1 underline-offset-2 py-3 px-4"
            style={{
              fontFamily: FONT_SANS
            }}
          >
            HUỶ
          </button>
        </div>
      )}
    </>
  );

  // Desktop version (no mobile props passed)
  if (isMobileOpen === undefined || onMobileClose === undefined) {
    return (
      <div className="bg-white rounded-2xl p-1 h-screen flex flex-col">
        <div className="mb-6">
          <h2 
            className="mb-3 text-black"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '-0.5px'
            }}
          >
            Bộ lọc
          </h2>
          <div 
            className="w-16 h-1 rounded-full"
            style={{ backgroundColor: '#000000' }}
          />
        </div>
        {filterContent}
      </div>
    );
  }

  // Mobile drawer version
  return (
    <>
      {/* Mobile Overlay - Smooth fade with backdrop blur */}
      <div
        className={`
          fixed inset-0 bg-black/50 backdrop-blur-sm z-40
          transition-opacity duration-300 ease-out
          ${isMobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      {/* Mobile Sidebar Drawer - Smooth slide with custom easing */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-80 bg-white z-50
          overflow-y-auto shadow-2xl
          will-change-transform
          ${isMobileOpen
            ? 'translate-x-0 shadow-black/20'
            : '-translate-x-full'
          }
        `}
        style={{
          transition: 'transform 0.4s cubic-bezier(0.32, 0.72, 0, 1)',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(212, 175, 55, 0.3) rgba(0, 0, 0, 0.03)'
        }}
      >
        {/* Mobile Header */}
        <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between z-10">
          <h2
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '28px',
              fontWeight: 700,
              letterSpacing: '-0.5px'
            }}
          >
            Bộ lọc
          </h2>
          <button
            onClick={onMobileClose}
            className="hover:text-black hover:bg-black/5 rounded-lg p-2 transition-all duration-200 ease-out hover:scale-110 active:scale-95"
            aria-label="Close filters"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {filterContent}
        </div>
      </div>
    </>
  );
}
