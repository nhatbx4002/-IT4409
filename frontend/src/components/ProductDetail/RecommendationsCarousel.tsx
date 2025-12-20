import { useEffect, useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { getProducts, addToWishlist } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import type { ProductSummary, ProductDetail, ProductFilterParams } from "@/types/products";
import { ProductCard } from "@/components/ProductsCard";

interface RecommendationsCarouselProps {
  title?: string;
  product: ProductDetail;
  variant?: "similar" | "recent" | "category";
  excludeProductId?: number;
}

export function RecommendationsCarousel({ 
  title = "You May Also Like", 
  product, 
  variant = "similar",
  excludeProductId 
}: RecommendationsCarouselProps) {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = getStoredUser();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        const filters: ProductFilterParams = {
          page: 1,
          pageSize: 8,
        };

        if (variant === "similar" || variant === "category") {
          if (product.collection) {
            filters.collection = product.collection;
          }
          if (product.category?.slug) {
            filters.categorySlug = product.category.slug;
          }
        }

        if (variant === "recent") {
          filters.sort = "newest";
          if (product.collection) {
            filters.collection = product.collection;
          }
        }

        const response = await getProducts(filters);
        
        let filteredProducts = response.products;
        
        if (excludeProductId || product.id) {
          filteredProducts = filteredProducts.filter(
            (p) => p.id !== (excludeProductId || product.id)
          );
        }

        setProducts(filteredProducts.slice(0, 8));
      } catch (error) {
        console.error("Failed to fetch carousel products", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (product) {
      fetchProducts();
    }
  }, [product, variant, excludeProductId]);

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
      <section className="w-full space-y-6 px-4 sm:px-6 lg:px-10">
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
    <section className="w-full space-y-6 px-4 sm:px-6 lg:px-10">
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

