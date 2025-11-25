import { useState } from "react";
import { Heart, Eye, ShoppingBag, Star } from "lucide-react";
import type { ProductSummary } from "@/types/products";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface ProductCardProps {
  product: ProductSummary;
  onQuickView: (product: ProductSummary) => void;
  onAddToWishlist: (productId: number) => void;
  onAddToCart: (productId: number) => void;
}

export function ProductCard({
  product,
  onQuickView,
  onAddToWishlist,
  onAddToCart,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const displayPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice;

  return (
    <div
      className="group relative bg-white transition-all duration-500 flex flex-col"
      style={{
        borderRadius: "8px",
        boxShadow: isHovered
          ? "0 8px 24px rgba(0, 0, 0, 0.15)"
          : "0 4px 6px rgba(0, 0, 0, 0.1)",
        maxHeight: "700px",
        height: "100%",
      }}
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
      <div
        className="relative overflow-hidden bg-[#F8F8F8] shrink-0"
        style={{
          width: "100%",
          aspectRatio: "320/400",
          borderRadius: "8px 8px 0 0",
          maxHeight: "400px",
        }}
      >
        {/* Product Images */}
        <div className="relative w-full h-full">
          {product.images.map((image, idx) => (
            <ImageWithFallback
              key={idx}
              src={image}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                idx === currentImageIndex
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
              }`}
              style={{
                transform:
                  isHovered && idx === currentImageIndex
                    ? "scale(1.08)"
                    : "scale(1)",
              }}
            />
          ))}
        </div>

        {/* NEW Badge - Top Left */}
        {product.isNew && (
          <div
            className="absolute top-0 left-0 z-10 bg-black text-white uppercase tracking-wider"
            style={{
              fontSize: "11px",
              fontWeight: 600,
              padding: "6px 12px",
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "1px",
              borderRadius: "8px 0 8px 0",
            }}
          >
            NEW
          </div>
        )}

        {/* SALE Badge */}
        {hasDiscount && (
          <div
            className="absolute top-0 left-0 z-10 text-black uppercase tracking-wider"
            style={{
              backgroundColor: "#D4AF37",
              fontSize: "11px",
              fontWeight: 600,
              padding: "6px 12px",
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "1px",
              borderRadius: "8px 0 8px 0",
              marginTop: product.isNew ? "36px" : "0",
            }}
          >
            SALE
          </div>
        )}

        {/* Circular Action Buttons - Centered Horizontally */}
        <div
          className="absolute left-50 top-35 -translate-x-1/2 -translate-y-1/2 z-10 flex gap-3 transition-all duration-500"
          style={{
            opacity: isHovered ? 1 : 0,
            transform: isHovered
              ? "translate(-50%, -50%) scale(1)"
              : "translate(-50%, -50%) scale(0.8)",
          }}
        >
          {/* Quick View Button */}
          <button
            onClick={() => onQuickView(product)}
            className="flex items-center justify-center bg-white transition-all duration-300 hover:scale-110 group/btn"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#D4AF37";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFF";
            }}
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4 text-black" />
          </button>

          {/* Wishlist Button */}
          <button
            onClick={() => onAddToWishlist(product.id)}
            className="flex items-center justify-center bg-white transition-all duration-300 hover:scale-110 group/btn"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#D4AF37";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFF";
            }}
            aria-label="Add to Wishlist"
          >
            <Heart className="w-4 h-4 text-black" />
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={() => onAddToCart(product.id)}
            className="flex items-center justify-center bg-white transition-all duration-300 hover:scale-110 group/btn"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#D4AF37";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#FFF";
            }}
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
      <div className="p-5 flex-1 flex flex-col overflow-hidden">
        <div className="space-y-3 flex-1">
          {/* Brand Name - Gold, Uppercase, Letter-spacing */}
          <div
            className="uppercase tracking-wider"
            style={{
              color: "#D4AF37",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "1.5px",
            }}
          >
            {product.brand}
          </div>

          {/* Product Name - Playfair Display, 20px, Bold */}
          <h3
            className="text-black line-clamp-1 overflow-hidden text-ellipsis"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "20px",
              fontWeight: 600,
              lineHeight: "1.4",
              minHeight: "28px",
            }}
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
            <span
              className="text-[#999999]"
              style={{
                fontSize: "13px",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              ({product.reviewCount})
            </span>
          </div>

          {/* Price - 24px Bold Black */}
          <div className="flex items-center gap-3 pt-1">
            {hasDiscount && (
              <span
                className="text-[#999999] line-through"
                style={{
                  fontSize: "18px",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                ${product.price}
              </span>
            )}
            <span
              className="text-black"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: "24px",
                fontWeight: 700,
              }}
            >
              ${displayPrice}
            </span>
          </div>

          {/* Color Selector - "Colors:" label + 3 circular swatches (24px) */}
          {product.colors.length > 0 && (
            <div className="flex items-center gap-3 pt-2">
              <span
                className="text-black"
                style={{
                  fontSize: "13px",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 500,
                }}
              >
                Colors:
              </span>
              <div className="flex items-center gap-2">
                {product.colors.slice(0, 3).map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColorIndex(idx)}
                    className="transition-all duration-300 hover:scale-110"
                    style={{
                      width: "24px",
                      height: "24px",
                      borderRadius: "50%",
                      backgroundColor: color,
                      border:
                        selectedColorIndex === idx
                          ? "2px solid #D4AF37"
                          : "2px solid #E0E0E0",
                      boxShadow:
                        selectedColorIndex === idx
                          ? "0 0 0 2px rgba(212, 175, 55, 0.2)"
                          : "none",
                    }}
                    title={color}
                    aria-label={color}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span
                    className="text-[#999999]"
                    style={{
                      fontSize: "12px",
                      fontFamily: "'Poppins', sans-serif",
                    }}
                  >
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Hidden "Add to Cart" Button - Full-width, appears on hover */}
        <div
          className="transition-all duration-500 overflow-hidden"
          style={{
            maxHeight: isHovered ? "60px" : "0",
            opacity: isHovered ? 1 : 0,
            marginTop: isHovered ? "16px" : "0",
          }}
        >
          <button
            onClick={() => onAddToCart(product.id)}
            className="w-full bg-black text-white uppercase tracking-widest transition-all duration-300 hover:bg-[#D4AF37] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              padding: "14px 0",
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "1.5px",
              borderRadius: "4px",
            }}
            disabled={!product.inStock}
          >
            {product.inStock ? "ADD TO CART" : "OUT OF STOCK"}
          </button>
        </div>
      </div>
    </div>
  );
}
