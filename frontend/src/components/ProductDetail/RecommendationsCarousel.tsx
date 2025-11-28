import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { getProducts } from "@/lib/api";
import type { ProductSummary } from "@/types/products";

interface RecommendationsCarouselProps {
  title: string;
  variant?: "similar" | "recent";
}

export function RecommendationsCarousel({ title, variant = "similar" }: RecommendationsCarouselProps) {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getProducts({
          page: variant === "recent" ? 2 : 1,
          pageSize: 8,
          collection: "men",
        });
        setProducts(response.products);
      } catch (error) {
        console.error("Failed to fetch carousel products", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [variant]);

  const handleQuickAdd = (productId: number) => {
    console.log("Quick add to cart", productId);
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-[1440px] space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-['Playfair_Display'] text-[28px] font-semibold text-[#1A1A1A]">{title}</h2>
          <div className="h-10 w-20 rounded-full border border-[#E5E7EB] bg-white" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[420px] rounded-[24px] border border-[#F3F4F6] bg-[#F9FAFB] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="mx-auto max-w-[1440px] space-y-6">
      <h2 className="font-['Playfair_Display'] text-[28px] font-semibold text-[#1A1A1A]">{title}</h2>

      <Carousel
        opts={{
          align: "start",
          slidesToScroll: 1,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem key={product.id} className="pl-4 sm:basis-1/2 lg:basis-1/4">
              <div className="flex h-[420px] flex-col rounded-[24px] border border-[#E5E7EB] bg-white/90 p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                <Link to={`/products/${product.id}`} className="block">
                  <div className="relative mb-4 h-[260px] overflow-hidden rounded-[16px] bg-[#F7F7F8]">
                    <ImageWithFallback src={product.images[0]} alt={product.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" />
                    {product.discountPercent && (
                      <span className="absolute left-4 top-4 rounded-full bg-[#D4AF37] px-3 py-1 text-[12px] font-semibold text-black">
                        -{product.discountPercent}%
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] uppercase tracking-[0.3em] text-[#D4AF37]">{product.brand}</p>
                  <h3 className="mt-2 line-clamp-2 font-['Playfair_Display'] text-[18px] font-semibold text-[#1A1A1A]">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-3 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-3.5 w-3.5 ${idx < Math.round(product.rating) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#E5E7EB]"}`}
                      strokeWidth={idx < Math.round(product.rating) ? 0 : 1}
                    />
                  ))}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {product.salePrice && (
                    <span className="text-[13px] text-[#9CA3AF] line-through">${product.price.toFixed(2)}</span>
                  )}
                  <span className="text-[18px] font-semibold text-[#1A1A1A]">${(product.salePrice || product.price).toFixed(2)}</span>
                </div>
                <button
                  onClick={() => handleQuickAdd(product.id)}
                  className="mt-auto flex items-center justify-center gap-2 rounded-[14px] border border-[#E5E7EB] py-3 text-[13px] font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Quick Add
                </button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 top-1/2 hidden -translate-x-1/2 rounded-full border border-[#E5E7EB] bg-white text-[#1A1A1A] hover:border-[#D4AF37] lg:flex" />
        <CarouselNext className="right-0 top-1/2 hidden translate-x-1/2 rounded-full border border-[#E5E7EB] bg-white text-[#1A1A1A] hover:border-[#D4AF37] lg:flex" />
      </Carousel>
    </section>
  );
}

