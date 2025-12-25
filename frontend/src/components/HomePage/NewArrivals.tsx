import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductsCard";
import type { ProductSummary } from "@/types/products";
import { getProducts, addToWishlist } from "@/lib/api";
import { LoadingState, ErrorState, EmptyState } from "@/components/feedback/AsyncStates";

export function NewArrivals() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewArrivals = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getProducts({
          sort: "newest",
          pageSize: 4,
          page: 1,
        });
        setProducts(response.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch new arrivals");
        console.error("Error fetching new arrivals:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewArrivals();
  }, []);

  const handleAddToWishlist = async (productId: number) => {
    try {
      await addToWishlist(productId);
      alert("Added to wishlist!");
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      alert("Failed to add to wishlist");
    }
  };

  return (
    <section className="py-24 bg-[#F5F5F5]">
      <div className="max-w-full mx-auto px-30">
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

        {/* Loading State */}
        {isLoading && <LoadingState itemCount={4} />}

        {/* Error State */}
        {error && !isLoading && <ErrorState message={error} />}

        {/* Empty State */}
        {!isLoading && !error && products.length === 0 && <EmptyState message="No new arrivals available" />}

        {/* Product Grid using reusable luxury ProductCard */}
        {!isLoading && !error && products.length > 0 && (
          <div className="mb-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToWishlist={() => handleAddToWishlist(product.id)}
                onAddToCart={(product) => {
                  // TODO: connect to cart API
                }}
                />
            ))}
          </div>
        )}

        {/* View All Button */}
        {!isLoading && !error && products.length > 0 && (
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => navigate("/collections?sort=newest")}
              className="px-10 py-6 border-2 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-colors"
              style={{ borderColor: '#D4AF37', color: '#D4AF37' }}
            >
              VIEW ALL
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
