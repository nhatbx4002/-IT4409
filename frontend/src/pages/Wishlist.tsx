import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import { Heart, Trash2 } from "lucide-react";
import { getWishlist, removeFromWishlist, addToWishlist, addToCart } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import type { WishlistItem as ApiWishlistItem } from "@/types/wishlist";
import type { ProductSummary } from "@/types/products";
import { WishlistProductCard } from "@/components/WishlistProductCard";
import { Button } from "@/components/ui/button";

const transformToProductSummary = (item: ApiWishlistItem): ProductSummary | null => {
  if (!item.product) return null;
  
  const product = item.product;
  const variants = product.variants || [];
  
  // Extract unique colors and sizes from variants
  const colors = Array.from(
    new Set(variants.filter(v => v.color).map(v => v.color))
  );
  
  const sizes = Array.from(
    new Set(variants.filter(v => v.size).map(v => v.size))
  );
  
  const hasStock = variants.some(v => v.stock_quantity > 0);

  const inStockVariants = variants.filter(v => v.stock_quantity > 0);
  const defaultVariant = (inStockVariants.length ? inStockVariants : variants)
    .sort((a, b) => (a.price || 0) - (b.price || 0))[0];
  
  return {
    id: product.id,
    name: product.name,
    brand: product.brand || "",
    description: product.description || "",
    price: product.base_price || 0,
    salePrice: product.sale_price || undefined,
    images: product.images || [],
    colors: colors.length > 0 ? colors : [],
    sizes: sizes.length > 0 ? sizes : [],
    tags: product.tags || [],
    rating: 0, // Rating calculated from reviews, not stored directly
    reviewCount: 0, // Review count calculated from reviews, not stored directly
    inStock: hasStock,
    isNew: product.is_new === true,
    defaultVariantId: defaultVariant?.id ?? null,
  };
};

export default function Wishlist() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "price-asc" | "price-desc">(
    "recent",
  );

  const user = getStoredUser();

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const response = await getWishlist(user.id);
        const transformedProducts = response.data
          .map(transformToProductSummary)
          .filter((item): item is ProductSummary => item !== null);
        setProducts(transformedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load wishlist");
        console.error("Error fetching wishlist:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchWishlist();
  }, [user?.id]);

  const itemCount = products.length;

  const sortedProducts = useMemo(() => {
    if (sortBy === "price-asc") {
      return [...products].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "price-desc") {
      return [...products].sort((a, b) => b.price - a.price);
    }
    return products;
  }, [products, sortBy]);

  const handleRemove = async (productId: number) => {
    try {
      await removeFromWishlist(productId);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      alert("Failed to remove item from wishlist");
    }
  };

  const handleAddToCart = async (productId: number) => {
    try {
      // Get the product from the products list
      const product = products.find(p => p.id === productId);
      if (!product) {
        alert("Product not found");
        return;
      }

      // For now, we'll use a default quantity and variant
      // In a real implementation, you'd show a modal to select variant/quantity
      const defaultVariantId = product.defaultVariantId;
      if (!defaultVariantId) {
        alert("Vui lòng chọn phiên bản sản phẩm");
        return;
      }
      
      // Add to cart
      await addToCart(defaultVariantId, 1);
      
      // Remove from wishlist after adding to cart
      await removeFromWishlist(productId);
      
      // Update products list
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      
      alert("Product moved to cart!");
    } catch (err) {
      console.error("Error moving to cart:", err);
      alert(err instanceof Error ? err.message : "Failed to move item to cart");
    }
  };

  const handleAddToWishlist = async (productId: number) => {
    // Already in wishlist, so this shouldn't be called
    console.log("Already in wishlist", productId);
  };

  return (
    <MainLayout>
      {/* Modern Clean White Background */}
      <section className="bg-white min-h-screen">
        <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
          {/* Header - Sans-serif, Modern */}
          <header className="mb-12">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl font-bold text-black md:text-5xl">
                    My Wishlist
                  </h1>
                </div>
                <p className="text-gray-600 text-base max-w-2xl">
                  Save your favorite items and come back to them anytime
                </p>
              </div>

              {/* Item Count & Sort */}
              <div className="flex flex-col gap-4 md:items-end">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-black text-lg">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </span>
                </p>
                
                {/* User Status */}
                {!user && (
                  <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
                    Please login to save your wishlist
                  </div>
                )}

                {/* Sort Dropdown */}
                <div className="flex items-center gap-3">
                  <label htmlFor="sort" className="text-sm font-medium text-gray-700">
                    Sort by
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:border-gray-400 focus:border-black focus:outline-none focus:ring-2 focus:ring-black/10"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </header>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-black border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading your wishlist...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !error && products.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="mt-6 text-2xl font-bold text-black">
                Your wishlist is empty
              </h2>
              <p className="mt-3 max-w-md text-gray-600">
                Start adding items you love by clicking the heart icon on products
              </p>
              <Button 
                className="mt-6 bg-black text-white hover:bg-gray-800 px-8 py-6 text-base font-semibold"
                onClick={() => navigate('/collections')}
              >
                Browse Products
              </Button>
            </div>
          )}

          {/* Product Grid using WishlistProductCard */}
          {!isLoading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {sortedProducts.map((product) => (
                <WishlistProductCard
                  key={product.id}
                  product={product}
                  onRemove={() => handleRemove(product.id)}
                  onMoveToCart={() => handleAddToCart(product.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
}

