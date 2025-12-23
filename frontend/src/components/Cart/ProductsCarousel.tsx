import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getProducts } from "@/lib/api";
import type { ProductSummary, ProductFilterParams } from "@/types/products";
import { ProductCard } from "@/components/ProductsCard";

interface ProductsCarouselProps {
  title: string;
  filters?: ProductFilterParams;
}

export function ProductsCarousel({ title, filters = {} }: ProductsCarouselProps) {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await getProducts({
          page: 1,
          pageSize: 8,
          ...filters,
        });
        setProducts(response.products);
      } catch (error) {
        console.error("Failed to fetch carousel products", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [filters]);

  const handleAddToCart = (product: ProductSummary) => {
    console.log("Add to cart", product);
  };

  const handleAddToWishlist = (productId: number) => {
    console.log("Add to wishlist", productId);
  };

  if (isLoading) {
    return (
      <section className="w-full space-y-6 py-12 px-4 sm:px-6 lg:px-10 xl:px-16">
        <h2 className="font-['Playfair_Display'] text-[28px] font-semibold text-[#1A1A1A]">{title}</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-[600px] rounded-[8px] border border-[#F3F4F6] bg-[#F9FAFB] animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!products.length) {
    return null;
  }

  return (
    <section className="w-full space-y-6 py-12 px-4 sm:px-6 lg:px-10 xl:px-16">
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
              <ProductCard
                product={product}
                onAddToCart={handleAddToCart}
                onAddToWishlist={handleAddToWishlist}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 top-1/2 hidden -translate-x-1/2 rounded-full border border-[#E5E7EB] bg-white text-[#1A1A1A] hover:border-[#D4AF37] lg:flex" />
        <CarouselNext className="right-0 top-1/2 hidden translate-x-1/2 rounded-full border border-[#E5E7EB] bg-white text-[#1A1A1A] hover:border-[#D4AF37] lg:flex" />
      </Carousel>
    </section>
  );
}

