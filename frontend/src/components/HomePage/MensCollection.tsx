import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const products = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1603122101829-e56305b0a5f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbHV4dXJ5JTIwc3VpdHxlbnwxfHx8fDE3NjEzOTQzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    brand: "ARMANI",
    name: "Classic Navy Suit",
    price: 2850,
    category: "Suits",
    colors: ["#1e3a8a", "#000000", "#4b5563"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1727930198744-d7acc4296ad4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwYmxhemVyJTIwamFja2V0fGVufDF8fHx8MTc2MTMxMjgxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    brand: "HUGO BOSS",
    name: "Tailored Blazer",
    price: 1450,
    category: "Blazers",
    colors: ["#000000", "#1e3a8a", "#6b7280"],
    sizes: ["M", "L", "XL"]
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1758024699178-634329cb7cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZHJlc3MlMjBzaGlydHxlbnwxfHx8fDE3NjE0MTE2ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    brand: "RALPH LAUREN",
    name: "Premium Cotton Shirt",
    price: 385,
    category: "Shirts",
    colors: ["#ffffff", "#1e40af", "#f8f9fa"],
    sizes: ["S", "M", "L", "XL", "XXL"]
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1541840031508-326b77c9a17e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwdHJvdXNlcnMlMjBwYW50c3xlbnwxfHx8fDE3NjEzMjA5NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    brand: "CANALI",
    name: "Wool Dress Pants",
    price: 595,
    category: "Pants",
    colors: ["#000000", "#1e3a8a", "#4b5563"],
    sizes: ["30", "32", "34", "36", "38"]
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1658837407083-308b902ee99d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbGVhdGhlciUyMHNob2VzfGVufDF8fHx8MTc2MTMwOTQxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    brand: "SALVATORE FERRAGAMO",
    name: "Leather Oxford Shoes",
    price: 850,
    category: "Shoes",
    colors: ["#000000", "#8B4513"],
    sizes: ["8", "9", "10", "11", "12"]
  },
  {
    id: 6,
    image: "https://images.unsplash.com/photo-1727308532294-0a1a5bf4dbbb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwdGllJTIwYWNjZXNzb3JpZXN8ZW58MXx8fHwxNzYxNDExNjg0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    brand: "HERMÈS",
    name: "Silk Tie Collection",
    price: 250,
    category: "Accessories",
    colors: ["#1e3a8a", "#dc2626", "#D4AF37"],
    sizes: ["One Size"]
  },
  {
    id: 7,
    image: "https://images.unsplash.com/photo-1598915850252-fb07ad1e6768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZmFzaGlvbiUyMHN1aXQlMjBqYWNrZXR8ZW58MXx8fHwxNzYxNDExMDg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    brand: "VERSACE",
    name: "Wool Sport Jacket",
    price: 1950,
    category: "Blazers",
    colors: ["#1e3a8a", "#000000"],
    sizes: ["M", "L", "XL"]
  },
  {
    id: 8,
    image: "https://images.unsplash.com/photo-1557039834-2f2208c6973c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbHV4dXJ5JTIwZmFzaGlvbiUyMHN1aXR8ZW58MXx8fHwxNzYxNDEwOTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    brand: "TOM FORD",
    name: "Signature Suit",
    price: 4500,
    category: "Suits",
    colors: ["#000000", "#1e3a8a"],
    sizes: ["M", "L", "XL"]
  },
  {
    id: 9,
    image: "https://images.unsplash.com/photo-1603122101829-e56305b0a5f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbHV4dXJ5JTIwc3VpdHxlbnwxfHx8fDE3NjEzOTQzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    brand: "BRIONI",
    name: "Charcoal Suit",
    price: 3200,
    category: "Suits",
    colors: ["#4b5563", "#000000"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 10,
    image: "https://images.unsplash.com/photo-1758024699178-634329cb7cde?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZHJlc3MlMjBzaGlydHxlbnwxfHx8fDE3NjE0MTE2ODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    brand: "BROOKS BROTHERS",
    name: "Oxford Dress Shirt",
    price: 295,
    category: "Shirts",
    colors: ["#ffffff", "#e0f2fe", "#fef3c7"],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: 11,
    image: "https://images.unsplash.com/photo-1541840031508-326b77c9a17e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwdHJvdXNlcnMlMjBwYW50c3xlbnwxfHx8fDE3NjEzMjA5NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    brand: "ZEGNA",
    name: "Tailored Trousers",
    price: 695,
    category: "Pants",
    colors: ["#000000", "#4b5563", "#1e3a8a"],
    sizes: ["30", "32", "34", "36"]
  },
  {
    id: 12,
    image: "https://images.unsplash.com/photo-1658837407083-308b902ee99d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbGVhdGhlciUyMHNob2VzfGVufDF8fHx8MTc2MTMwOTQxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    brand: "CHURCH'S",
    name: "Brogues",
    price: 750,
    category: "Shoes",
    colors: ["#8B4513", "#000000"],
    sizes: ["8", "9", "10", "11"]
  }
];

const categories = ["All", "Suits", "Blazers", "Shirts", "Pants", "Shoes", "Accessories"];

export function MensCollection() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(["All"]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [sortBy, setSortBy] = useState("featured");

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

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategories.includes("All") || selectedCategories.includes(product.category);
    const priceMatch = product.price >= priceRange[0] && product.price <= priceRange[1];
    return categoryMatch && priceMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
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
          CATEGORY
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
          PRICE RANGE
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
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      {(selectedCategories.length > 0 && !selectedCategories.includes("All")) && (
        <Button
          variant="outline"
          className="w-full border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black"
          onClick={() => {
            setSelectedCategories(["All"]);
            setPriceRange([0, 5000]);
          }}
        >
          Clear All Filters
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
            <a href="#" className="hover:text-[#D4AF37] transition-colors">Home</a>
            <span>/</span>
            <span className="text-black">Men's Collection</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h1
            className="mb-4"
            style={{ fontSize: '48px', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
          >
            Men's Collection
          </h1>
          <p className="text-[#666666] max-w-2xl mx-auto" style={{ fontSize: '18px', lineHeight: 1.6 }}>
            Discover timeless elegance with our curated selection of premium menswear
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
                  Showing {sortedProducts.length} of {products.length} products
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
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-8">
                      <FilterContent />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-[#666666] hidden sm:block">Sort by:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name: A to Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedProducts.map(product => (
                <div
                  key={product.id}
                  className="group cursor-pointer bg-white rounded-sm overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative aspect-3/4 overflow-hidden">
                    <ImageWithFallback
                      src={product.image}
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
                        Quick Add
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
                      ${product.price.toLocaleString()}
                    </p>

                    {/* Color Dots */}
                    <div className="flex gap-2">
                      {product.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-6 h-6 rounded-full border-2 border-gray-200 hover:border-[#D4AF37] transition-colors cursor-pointer"
                          style={{ backgroundColor: color }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            {sortedProducts.length > 0 && (
              <div className="text-center mt-12">
                <Button
                  variant="outline"
                  className="px-10 py-6 border-2 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-colors"
                  style={{ borderColor: '#D4AF37', color: '#D4AF37' }}
                >
                  LOAD MORE
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
