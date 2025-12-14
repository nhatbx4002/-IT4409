import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getProductById, addToWishlist } from "@/lib/api";
import { getViewedProductIds } from "@/lib/viewedProducts";
import { getStoredUser } from "@/lib/auth";
import type { ProductSummary } from "@/types/products";
import { ProductCard } from "@/components/ProductsCard";

interface ViewedProductsCarouselProps {
  title?: string;
  excludeProductId?: number;
}

export function ViewedProductsCarousel({ 
  title = "Recently Viewed", 
  excludeProductId 
}: ViewedProductsCarouselProps) {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = getStoredUser();

  useEffect(() => {
    const fetchViewedProducts = async () => {
      try {
        setIsLoading(true);
        
        const viewedIds = getViewedProductIds();
        
        if (viewedIds.length === 0) {
          setProducts([]);
          setIsLoading(false);
          return;
        }

        const filteredIds = excludeProductId 
          ? viewedIds.filter((id) => id !== excludeProductId)
          : viewedIds;

        if (filteredIds.length === 0) {
          setProducts([]);
          setIsLoading(false);
          return;
        }

        const productPromises = filteredIds
          .slice(0, 8)
          .map((id) => getProductById(id).catch(() => null));

        const results = await Promise.all(productPromises);
        const validProducts = results.filter(
          (p): p is ProductSummary => p !== null
        );

        setProducts(validProducts);
      } catch (error) {
        console.error("Failed to fetch viewed products", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchViewedProducts();
  }, [excludeProductId]);

  const handleAddToCart = (productId: number) => {
    console.log("Add to cart", productId);
  };

  const handleAddToWishlist = async (productId: number) => {
    if (!user) {
      alert("Please login to add items to wishlist");
      return;
    }
    try {
      await addToWishlist(productId);
      alert("Added to wishlist!");
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      alert("Failed to add to wishlist");
    }
  };

  if (isLoading) {
    return (
      <section className="mx-auto max-w-[1440px] space-y-6">
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

