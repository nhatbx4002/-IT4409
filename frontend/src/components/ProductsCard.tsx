import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import type { ProductSummary } from "@/types/products";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { formatVnd } from "@/lib/formatCurrency";

interface ProductCardProps {
  product: ProductSummary;
  onAddToWishlist: (productId: number) => void;
  onAddToCart: (product: ProductSummary) => void;
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

  const setImageByIndex = (idx: number) => {
    const safeIndex = Math.min(Math.max(idx, 0), product.images.length - 1);
    setCurrentImageIndex(safeIndex);
  };

  return (
    <div
      className={`group relative flex h-full max-h-[640px] flex-col transition-all duration-500 ${isHovered ? "translate-y-[-2px]" : ""}`}
      onMouseEnter={() => {
        setIsHovered(true);
        if (product.images.length > 1) {
          setImageByIndex(1);
        }
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setImageByIndex(0);
      }}
    >
      {/* Image Container - 320x400px aspect ratio */}
      <div className="relative aspect-4/5 max-h-[400px] w-full shrink-0 overflow-hidden rounded-t-2xl bg-white/80 backdrop-blur-sm">
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

        {/* Wishlist top-right */}
        <button
          onClick={() => onAddToWishlist(product.id)}
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-black shadow-[0_8px_20px_rgba(15,23,42,0.25)] transition-colors duration-200 hover:bg-[#D4AF37] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
          aria-label="Add to Wishlist"
        >
          <Heart className="w-4 h-4 text-black" />
        </button>

        {/* Hover actions slide-up */}
        <div
          className={`absolute inset-x-3 bottom-3 z-20 transform-gpu rounded-2xl bg-white/90 px-3 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur transition-all duration-300 ${
            isHovered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between gap-2 text-sm text-[#111827]">
            <button
              onClick={() => navigate(`/products/${product.id}`)}
              className="flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#111827] transition hover:text-[#D4AF37]"
            >
              <Eye className="h-4 w-4" />
              View detail
            </button>
            <button
              onClick={() => onAddToCart(product)}
              className="inline-flex items-center gap-2 rounded-full bg-[#111827] px-3 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-black"
              disabled={!product.inStock}
            >
              <ShoppingBag className="h-4 w-4 text-[#D4AF37]" />
              {product.inStock ? "Add" : "Out"}
            </button>
          </div>
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
      <div className="flex flex-1 flex-col overflow-hidden p-5 bg-transparent">
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
                {formatVnd(product.price)}
              </span>
            )}
            <span className="font-['Poppins'] text-[18px] font-semibold text-[#111827]">
              {formatVnd(displayPrice)}
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
                    onMouseEnter={() => {
                      setSelectedColorIndex(idx);
                      setImageByIndex(Math.min(idx + 1, product.images.length - 1));
                    }}
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
      </div>
    </div>
  );
}
