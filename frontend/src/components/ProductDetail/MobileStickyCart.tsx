import { useState, useEffect } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";
import type { ProductDetail } from "@/types/products";
import { addToCart } from "@/lib/api";
import { toast } from "sonner";

interface MobileStickyCartProps {
  product: ProductDetail;
}

export function MobileStickyCart({ product }: MobileStickyCartProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls past the hero section
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      setIsVisible(scrollPosition > windowHeight * 0.5);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = async () => {
    // Find the first available variant (in stock)
    const availableVariant = product.variants.find(
      (v) => v.stockQuantity > 0
    );

    if (!availableVariant) {
      toast.error("Product is out of stock");
      return;
    }

    if (!availableVariant.id) {
      toast.error("Invalid product variant");
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(availableVariant.id, 1);
      toast.success("Product added to cart successfully!");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add product to cart";
      toast.error(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const displayPrice = product.salePrice || product.price;
  const hasAvailableVariant = product.variants.some((v) => v.stockQuantity > 0);

  return (
    <div
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E5E5E5] shadow-lg transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="max-w-[1440px] mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Price */}
          <div className="flex flex-col">
            <span
              className="text-black font-bold"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "20px",
              }}
            >
              ${displayPrice}
            </span>
            {product.salePrice && (
              <span
                className="text-[#757575] line-through text-sm"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                ${product.price}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!hasAvailableVariant || isAddingToCart}
            className="flex-1 bg-[#C2A26F] text-black uppercase tracking-widest py-3 px-6 text-sm font-bold hover:bg-[#B8945F] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "1.5px" }}
          >
            {isAddingToCart ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ShoppingBag className="w-5 h-5" />
            )}
            {isAddingToCart ? "ADDING..." : hasAvailableVariant ? "ADD TO CART" : "OUT OF STOCK"}
          </button>
        </div>
      </div>
    </div>
  );
}

