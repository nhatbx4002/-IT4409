import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { Button } from "@/components/ui/button";

export function NewArrivals() {
  const products = [
    {
      image: "https://images.unsplash.com/photo-1557039834-2f2208c6973c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbHV4dXJ5JTIwZmFzaGlvbiUyMHN1aXR8ZW58MXx8fHwxNzYxNDEwOTEzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      brand: "ARMANI",
      name: "Premium Wool Suit",
      price: "$2,850",
      colors: ["#000000", "#1e3a8a", "#6b7280"]
    },
    {
      image: "https://images.unsplash.com/photo-1598915850252-fb07ad1e6768?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwZmFzaGlvbiUyMHN1aXQlMjBqYWNrZXR8ZW58MXx8fHwxNzYxNDExMDg3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      brand: "HUGO BOSS",
      name: "Tailored Wool Blazer",
      price: "$1,450",
      colors: ["#000000", "#1e3a8a", "#4b5563"]
    },
    {
      image: "https://images.unsplash.com/photo-1666358777707-3fe5d9ea910f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbHV4dXJ5JTIwZHJlc3MlMjBzaGlydHxlbnwxfHx8fDE3NjE0MzExODJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      brand: "VERSACE",
      name: "Cotton Dress Shirt",
      price: "$425",
      colors: ["#ffffff", "#87CEEB", "#FFB6C1"]
    },
    {
      image: "https://images.unsplash.com/photo-1616406432452-07bc5938759d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbGVhdGhlciUyMGxvYWZlcnMlMjBzaG9lc3xlbnwxfHx8fDE3NjE0MzExODN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      brand: "GUCCI",
      name: "Leather Loafers",
      price: "$950",
      colors: ["#000000", "#8B4513", "#2F4F4F"]
    },
    {
      image: "https://images.unsplash.com/photo-1758525589572-02ab253d2acd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwd29vbCUyMGNvYXR8ZW58MXx8fHwxNzYxNDMxMTgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      brand: "BURBERRY",
      name: "Wool Overcoat",
      price: "$1,950",
      colors: ["#D2B48C", "#000000", "#8B4513"]
    },
    {
      image: "https://images.unsplash.com/photo-1751437730397-ef83024b5339?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZW5zJTIwbHV4dXJ5JTIwd2F0Y2h8ZW58MXx8fHwxNzYxNDMxMTgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      brand: "ROLEX",
      name: "Swiss Chronograph",
      price: "$8,500",
      colors: ["#D4AF37", "#C0C0C0", "#000000"]
    },
    {
      image: "https://images.unsplash.com/photo-1554301840-913d3250f757?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBhY2Nlc3NvcmllcyUyMHdhdGNoJTIwamV3ZWxyeXxlbnwxfHx8fDE3NjE0MTA5MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      brand: "MONTBLANC",
      name: "Leather Belt & Wallet Set",
      price: "$650",
      colors: ["#000000", "#8B4513", "#D4AF37"]
    },
    {
      image: "https://images.unsplash.com/photo-1759793499903-bfdba8350627?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBmYXNoaW9uJTIwcHJvZHVjdCUyMHNob2VzfGVufDF8fHx8MTc2MTQxMTA4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      brand: "PRADA",
      name: "Oxford Dress Shoes",
      price: "$825",
      colors: ["#000000", "#8B4513", "#2F4F4F"]
    }
  ];

  return (
    <section className="py-24 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 
            className="mb-4"
            style={{ fontSize: '36px', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
          >
            New Arrivals - Autumn Collection 2025
          </h2>
          <p 
            className="text-[#666666] max-w-2xl mx-auto"
            style={{ fontSize: '18px', lineHeight: 1.6 }}
          >
            Discover the latest additions to our exclusive collection
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {products.map((product, index) => (
            <div 
              key={index} 
              className="group cursor-pointer bg-white rounded-sm overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative aspect-3/4 overflow-hidden">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
              </div>
              
              <div className="p-4">
                <p 
                  className="text-xs tracking-wider mb-1" 
                  style={{ color: '#D4AF37', fontSize: '12px' }}
                >
                  {product.brand}
                </p>
                <h3 
                  className="mb-2" 
                  style={{ fontSize: '16px', fontWeight: 500 }}
                >
                  {product.name}
                </h3>
                <p 
                  className="mb-3"
                  style={{ fontSize: '18px', fontWeight: 600, fontFamily: "'Playfair Display', serif" }}
                >
                  {product.price}
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

        {/* View All Button */}
        <div className="text-center">
          <Button 
            variant="outline" 
            className="px-10 py-6 border-2 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-colors"
            style={{ borderColor: '#D4AF37', color: '#D4AF37' }}
          >
            VIEW ALL
          </Button>
        </div>
      </div>
    </section>
  );
}
