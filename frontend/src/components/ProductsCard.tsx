import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import type { ProductSummary } from "@/types/products";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface ProductCardProps {
  product: ProductSummary;
  onAddToWishlist: (productId: number) => void;
  onAddToCart: (productId: number) => void;
}

export function ProductCard({
  product,
  onAddToWishlist,
  onAddToCart,
}: ProductCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const displayPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice;

  return (
    <div
      className={`group relative flex h-full max-h-[700px] flex-col rounded-2xl bg-white/95 ring-1 ring-gray-200 transition-all duration-500 ${isHovered ? "shadow-[0_18px_60px_rgba(15,23,42,0.25)] translate-y-[-2px]" : "shadow-[0_8px_30px_rgba(15,23,42,0.12)]"}`}
      onMouseEnter={() => {
        setIsHovered(true);
        if (product.images.length > 1) {
          setCurrentImageIndex(1);
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Image Container - 320x400px aspect ratio */}
      <div className="relative aspect-4/5 max-h-[400px] w-full shrink-0 overflow-hidden rounded-t-2xl bg-[#F8F8F8]">
        {/* Product Images */}
        <div className="relative w-full h-full">
          {product.images.map((image, idx) => (
            <ImageWithFallback
              key={idx}
              src={image}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${
                idx === currentImageIndex
                  ? "opacity-100 scale-100"
                  : "pointer-events-none opacity-0 scale-105"
              }`}
            />
          ))}
        </div>

        {/* NEW Badge - Top Left */}
        {product.isNew && (
          <div className="absolute left-3 top-3 z-10 rounded-full bg-black/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-sm">
            NEW
          </div>
        )}

        {/* SALE Badge */}
        {hasDiscount && (
          <div
            className={`absolute left-3 z-10 rounded-full bg-[#D4AF37] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-black shadow-sm ${product.isNew ? "top-8" : "top-3"}`}
          >
            SALE
          </div>
        )}

        {/* Circular Action Buttons - Centered Horizontally */}
        <div
          className={`absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 gap-3 transition-all duration-300 ${isHovered ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-95"}`}
        >
          {/* Quick View Button */}
          <button
            onClick={() => navigate(`/products/${product.id}`)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-black shadow-[0_8px_20px_rgba(15,23,42,0.35)] transition-colors duration-200 hover:bg-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="View Product Details"
          >
            <Eye className="w-4 h-4 text-black" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => onAddToWishlist(product.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-black shadow-[0_8px_20px_rgba(15,23,42,0.35)] transition-colors duration-200 hover:bg-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Add to Wishlist"
          >
            <Heart className="w-4 h-4 text-black" />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart(product.id)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-black shadow-[0_8px_20px_rgba(15,23,42,0.35)] transition-colors duration-200 hover:bg-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            aria-label="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/90 flex items-center justify-center backdrop-blur-sm">
            <span
              className="px-6 py-3 bg-black text-white uppercase tracking-wider"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "12px",
                fontWeight: 600,
              }}
            >
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content Area - 20px padding */}
      <div className="flex flex-1 flex-col overflow-hidden p-5">
        <div className="space-y-3 flex-1">
          {/* Brand Name - Gold, Uppercase, Letter-spacing */}
          <div className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
            {product.brand}
          </div>

          {/* Product Name - Playfair Display, 20px, Bold */}
          <h3
            className="min-h-[28px] overflow-hidden text-ellipsis font-['Playfair_Display'] text-[18px] font-semibold leading-snug text-[#111827] line-clamp-2"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* 5 Gold Stars Rating + Review Count */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-4 h-4 ${
                    idx < Math.floor(product.rating)
                      ? "fill-current"
                      : "fill-none"
                  }`}
                  style={{
                    color:
                      idx < Math.floor(product.rating) ? "#D4AF37" : "#E0E0E0",
                    strokeWidth: idx < Math.floor(product.rating) ? 0 : 2,
                  }}
                />
              ))}
            </div>
            <span className="text-[12px] text-[#9CA3AF]">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price - 24px Bold Black */}
          <div className="flex items-center gap-3 pt-1">
            {hasDiscount && (
              <span className="text-[14px] text-[#9CA3AF] line-through">
                ${product.price}
              </span>
            )}
            <span className="font-['Poppins'] text-[18px] font-semibold text-[#111827]">
              ${displayPrice}
            </span>
          </div>

          {/* Color Selector - "Colors:" label + 3 circular swatches (24px) */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-3 pt-2">
              <span className="text-[12px] font-medium text-[#111827]">
                Colors:
              </span>
              <div className="flex items-center gap-2">
                {product.colors.slice(0, 3).map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColorIndex(idx)}
                    className={`h-6 w-6 rounded-full border-2 transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
                    style={{
                      backgroundColor: color,
                      borderColor:
                        selectedColorIndex === idx ? "#D4AF37" : "#E5E7EB",
                      boxShadow:
                        selectedColorIndex === idx
                          ? "0 0 0 2px rgba(212,175,55,0.35)"
                          : "none",
                    }}
                    title={color}
                    aria-label={color}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-[11px] text-[#9CA3AF]">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hidden "Add to Cart" Button - Full-width, appears on hover */}
        <div
          className={`overflow-hidden pt-0 transition-all duration-300 ${isHovered ? "mt-4 max-h-16 opacity-100" : "mt-0 max-h-0 opacity-0"}`}
        >
          <button
            onClick={() => onAddToCart(product.id)}
            className="w-full rounded-full bg-black py-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-white transition-colors duration-200 hover:bg-[#D4AF37] hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!product.inStock}
          >
            {product.inStock ? "ADD TO CART" : "OUT OF STOCK"}
          </button>
        </div>
      </div>
    </div>
  );
}
