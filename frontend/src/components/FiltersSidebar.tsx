import { useState, useEffect } from "react";
import { ChevronDown, X } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import type { FilterState } from "@/types/products";

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
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
  // Pending filters for "Apply" mode
  const [pendingFilters, setPendingFilters] = useState<FilterState>(filters);
  
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'category', 'size', 'color', 'price', 'brand'
  ]);

  // Update pending filters when actual filters change from outside
  useEffect(() => {
    setPendingFilters(filters);
  }, [filters]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const categories = ['Shirts', 'Trousers', 'Suits', 'Outerwear'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = [
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Black', hex: '#000000' },
    { name: 'Navy', hex: '#000080' },
    { name: 'Light Blue', hex: '#ADD8E6' },
    { name: 'Gray', hex: '#808080' },
    { name: 'Beige', hex: '#F5F5DC' },
    { name: 'Pink', hex: '#FFB6C1' },
    { name: 'Olive', hex: '#808000' }
  ];
  const brands = ['ARISTINO', 'Premium Line', 'Classic Collection'];

  const handleApplyFilters = () => {
    onFilterChange(pendingFilters);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const handleCancel = () => {
    setPendingFilters(filters);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  // Get active count for each section using pending filters
  const getFilterCount = (id: string) => {
    switch (id) {
      case 'category':
        return pendingFilters.categories.length;
      case 'size':
        return pendingFilters.sizes.length;
      case 'color':
        return pendingFilters.colors.length;
      case 'brand':
        return pendingFilters.brands.length;
      case 'price':
        return (pendingFilters.priceRange[0] !== 0 || pendingFilters.priceRange[1] !== 500) ? 1 : 0;
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
      <div className="border-b border-black/10 last:border-0">
        <button
          onClick={() => toggleSection(id)}
          className="w-full py-4 flex items-center justify-between text-left transition-colors duration-300 hover:text-[#D4AF37]"
        >
          <div className="flex items-center gap-2">
            <span 
              className="text-black"
              style={{ 
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 500
              }}
            >
              {title}
            </span>
            {activeCount > 0 && (
              <span 
                className="px-2 py-0.5 rounded-full text-xs text-black"
                style={{ 
                  backgroundColor: '#D4AF37',
                  fontFamily: "'Poppins', sans-serif"
                }}
              >
                {activeCount}
              </span>
            )}
          </div>
          <ChevronDown 
            className={`w-5 h-5 transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </button>
        
        <div 
          className="overflow-hidden transition-all duration-500"
          style={{
            maxHeight: isExpanded ? '500px' : '0',
            opacity: isExpanded ? 1 : 0
          }}
        >
          <div className="pb-4">
            {children}
          </div>
        </div>
      </div>
    );
  };

  const filterContent = (
    <>
      {/* Category Filter */}
      <FilterSection title="Category" id="category">
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={pendingFilters.categories.includes(category)}
                onCheckedChange={(checked) => {
                  setPendingFilters({
                    ...pendingFilters,
                    categories: checked
                      ? [...pendingFilters.categories, category]
                      : pendingFilters.categories.filter(c => c !== category)
                  });
                }}
                className="border-2 border-black/20 data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
              />
              <Label
                htmlFor={`category-${category}`}
                className="cursor-pointer text-sm text-[#666666] hover:text-black transition-colors duration-300"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator className="my-0" />

      {/* Size Filter */}
      <FilterSection title="Size" id="size">
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => {
                setPendingFilters({
                  ...pendingFilters,
                  sizes: pendingFilters.sizes.includes(size)
                    ? pendingFilters.sizes.filter(s => s !== size)
                    : [...pendingFilters.sizes, size]
                });
              }}
              className={`
                py-2 border-2 transition-all duration-300
                ${pendingFilters.sizes.includes(size)
                  ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                  : 'border-black/20 text-[#666666] hover:border-[#D4AF37]'
                }
              `}
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterSection>

      <Separator className="my-0" />

      {/* Color Filter */}
      <FilterSection title="Color" id="color">
        <div className="flex gap-3 flex-wrap">
          {colors.map((color) => (
            <button
              key={color.name}
              onClick={() => {
                setPendingFilters({
                  ...pendingFilters,
                  colors: pendingFilters.colors.includes(color.name)
                    ? pendingFilters.colors.filter(c => c !== color.name)
                    : [...pendingFilters.colors, color.name]
                });
              }}
              className={`
                relative w-10 h-10 rounded-full border-2 transition-all duration-300
                ${pendingFilters.colors.includes(color.name)
                  ? 'border-[#D4AF37] ring-2 ring-[#D4AF37] ring-offset-2'
                  : 'border-gray-300 hover:border-[#D4AF37]'
                }
              `}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={color.name}
            />
          ))}
        </div>
      </FilterSection>

      <Separator className="my-0" />

      {/* Price Range Filter */}
      <FilterSection title="Price Range" id="price">
        <div className="space-y-4">
          <Slider
            value={pendingFilters.priceRange}
            onValueChange={(value) => {
              setPendingFilters({
                ...pendingFilters,
                priceRange: value as [number, number]
              });
            }}
            min={0}
            max={500}
            step={10}
            className="[&_[role=slider]]:bg-[#D4AF37] [&_[role=slider]]:border-[#D4AF37]"
          />
          <div className="flex items-center justify-between text-sm text-[#666666]">
            <span>${pendingFilters.priceRange[0]}</span>
            <span>${pendingFilters.priceRange[1]}+</span>
          </div>
        </div>
      </FilterSection>

      <Separator className="my-0" />

      {/* Brand Filter */}
      <FilterSection title="Brand" id="brand">
        <div className="space-y-3">
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={pendingFilters.brands.includes(brand)}
                onCheckedChange={(checked) => {
                  setPendingFilters({
                    ...pendingFilters,
                    brands: checked
                      ? [...pendingFilters.brands, brand]
                      : pendingFilters.brands.filter(b => b !== brand)
                  });
                }}
                className="border-2 border-black/20 data-[state=checked]:bg-[#D4AF37] data-[state=checked]:border-[#D4AF37]"
              />
              <Label
                htmlFor={`brand-${brand}`}
                className="cursor-pointer text-sm text-[#666666] hover:text-black transition-colors duration-300"
              >
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Action Buttons */}
      <div className="mt-8 pt-6 border-t border-black/10 space-y-3">
        <button
          onClick={handleApplyFilters}
          className="w-full py-3 transition-all duration-300 hover:opacity-90"
          style={{
            backgroundColor: '#D4AF37',
            color: '#000',
            fontFamily: "'Poppins', sans-serif",
            fontWeight: 600
          }}
        >
          APPLY FILTERS
        </button>
        <button
          onClick={handleCancel}
          className="w-full py-3 border-2 border-black/20 transition-all duration-300 hover:border-black hover:bg-black/5"
          style={{
            fontFamily: "'Poppins', sans-serif"
          }}
        >
          Cancel
        </button>
      </div>
    </>
  );

  // Desktop version (no mobile props passed)
  if (isMobileOpen === undefined || onMobileClose === undefined) {
    return (
      <div className="bg-white">
        <div className="mb-6">
          <h2 
            className="mb-2"
            style={{ 
              fontFamily: "'Playfair Display', serif",
              fontSize: '24px',
              fontWeight: 600
            }}
          >
            Filters
          </h2>
          <div 
            className="w-12 h-0.5"
            style={{ backgroundColor: '#D4AF37' }}
          />
        </div>
        {filterContent}
      </div>
    );
  }

  // Mobile drawer version
  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onMobileClose}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div 
        className={`
          fixed top-0 left-0 h-screen w-80 bg-white z-50
          overflow-y-auto transition-transform duration-500
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(212, 175, 55, 0.3) rgba(0, 0, 0, 0.03)'
        }}
      >
        {/* Mobile Header */}
        <div className="sticky top-0 bg-white border-b border-black/10 px-6 py-4 flex items-center justify-between z-10">
          <h2 
            style={{ 
              fontFamily: "'Playfair Display', serif",
              fontSize: '24px',
              fontWeight: 600
            }}
          >
            Filters
          </h2>
          <button 
            onClick={onMobileClose}
            className="hover:text-[#D4AF37] transition-colors duration-300"
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
