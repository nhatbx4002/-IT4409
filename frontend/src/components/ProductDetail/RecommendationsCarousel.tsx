import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getProducts } from "@/lib/api";
import type { ProductSummary } from "@/types/products";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export function RecommendationsCarousel() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getProducts({ page: 1, pageSize: 8 });
        setProducts(response.products);
      } catch (error) {
        console.error("Failed to fetch recommended products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <h2
          className="text-black mb-8 text-center"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "32px",
            fontWeight: 600,
          }}
        >
          You May Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="animate-pulse">
              <div className="bg-[#F8F8F8] aspect-[3/4] mb-4"></div>
              <div className="h-4 bg-[#F8F8F8] mb-2"></div>
              <div className="h-4 bg-[#F8F8F8] w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h2
        className="text-black mb-8 text-center"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "32px",
          fontWeight: 600,
        }}
      >
        You May Also Like
      </h2>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/4">
              <Link to={`/products/${product.id}`}>
                <div className="group relative bg-white transition-all duration-300 hover:shadow-lg">
                  {/* Image Container */}
                  <div
                    className="relative overflow-hidden bg-[#F8F8F8] mb-4"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <ImageWithFallback
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* SALE Badge */}
                    {product.salePrice && (
                      <div
                        className="absolute top-0 left-0 z-10 bg-[#D4AF37] text-black uppercase tracking-wider"
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          padding: "6px 12px",
                          fontFamily: "'Poppins', sans-serif",
                          letterSpacing: "1px",
                          borderRadius: "0 0 8px 0",
                        }}
                      >
                        SALE
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-2">
                    {/* Brand Name */}
                    <div
                      className="uppercase tracking-wider mb-1"
                      style={{
                        color: "#C2A26F",
                        fontSize: "11px",
                        fontWeight: 600,
                        fontFamily: "'Poppins', sans-serif",
                        letterSpacing: "1px",
                      }}
                    >
                      {product.brand}
                    </div>

                    {/* Product Name */}
                    <h3
                      className="text-black mb-2 line-clamp-2"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        fontSize: "18px",
                        fontWeight: 600,
                        lineHeight: "1.4",
                        minHeight: "50px",
                      }}
                    >
                      {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3 h-3 ${
                            idx < Math.floor(product.rating) ? "fill-current" : "fill-none"
                          }`}
                          style={{
                            color: idx < Math.floor(product.rating) ? "#C2A26F" : "#E0E0E0",
                            strokeWidth: idx < Math.floor(product.rating) ? 0 : 2,
                          }}
                        />
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      {product.salePrice && (
                        <span
                          className="text-[#757575] line-through text-sm"
                          style={{ fontFamily: "'Poppins', sans-serif" }}
                        >
                          ${product.price}
                        </span>
                      )}
                      <span
                        className="text-black font-bold"
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: "20px",
                        }}
                      >
                        ${product.salePrice || product.price}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden lg:flex -left-12" />
        <CarouselNext className="hidden lg:flex -right-12" />
      </Carousel>
    </div>
  );
}

