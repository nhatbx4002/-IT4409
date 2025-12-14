import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag } from "lucide-react"; // Đã đổi icon
import type { ProductSummary } from "@/types/products";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface WishlistProductCardProps {
  product: ProductSummary;
  onRemove: (productId: number) => void;
  onMoveToCart: (productId: number) => void;
}

export function WishlistProductCard({
  product,
  onRemove,
  onMoveToCart,
}: WishlistProductCardProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Chọn hiển thị màu (nếu có)
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const displayPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice;

  return (
    <div
      className="group relative flex h-full flex-col bg-white transition-all duration-300"
      onMouseEnter={() => {
        setIsHovered(true);
        if (product.images.length > 1) setCurrentImageIndex(1);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* 1. IMAGE CONTAINER - Clean, No Shadow, Sharp corners */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4F4F4] rounded-sm">
        
        {/* Product Images */}
        <div 
            className="relative h-full w-full cursor-pointer"
            onClick={() => navigate(`/products/${product.id}`)}
        >
          {product.images.map((image, idx) => (
            <ImageWithFallback
              key={idx}
              src={image}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-out ${
                idx === currentImageIndex
                  ? "opacity-100 scale-105" // Zoom nhẹ khi hover tạo cảm giác "thở"
                  : "pointer-events-none opacity-0 scale-100"
              }`}
            />
          ))}
        </div>

        {/* Badges - Giữ lại nhưng làm nhỏ gọn hơn */}
        {(product.isNew || hasDiscount) && (
          <div className="absolute left-0 top-3 flex flex-col gap-1 px-3">
             {product.isNew && (
              <span className="w-fit bg-white/90 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-black backdrop-blur-sm">
                New
              </span>
            )}
            {hasDiscount && (
              <span className="w-fit bg-[#D4AF37] px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                Sale
              </span>
            )}
          </div>
        )}

        {/* 2. REMOVE BUTTON - Góc trên bên phải */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(product.id);
          }}
          className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-red-50 hover:text-red-600"
          title="Remove from wishlist"
        >
          <Trash2 className="h-4 w-4 stroke-[1.5]" />
        </button>

        {/* Out of Stock Overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
            <span className="border border-black bg-black px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* 3. INFO AREA - Minimalist & Serif Typography */}
      <div className="flex flex-1 flex-col pt-4">
        {/* Brand */}
        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400">
          {product.brand}
        </div>

        {/* Name - Serif Font cho đồng bộ với tiêu đề Wishlist */}
        <h3
          onClick={() => navigate(`/products/${product.id}`)}
          className="cursor-pointer font-['Playfair_Display'] text-[18px] font-medium leading-tight text-[#111] hover:underline hover:decoration-1 hover:underline-offset-4"
        >
          {product.name}
        </h3>

        {/* Price & Colors Row */}
        <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <span className="font-['Poppins'] text-[16px] font-medium text-[#111]">
                ${displayPrice}
                </span>
                {hasDiscount && (
                <span className="text-[14px] text-gray-400 line-through decoration-1">
                    ${product.price}
                </span>
                )}
            </div>

            {/* Color circles - Nhỏ hơn và tinh tế hơn */}
            {product.colors.length > 0 && (
                <div className="flex -space-x-1">
                    {product.colors.slice(0, 3).map((color, idx) => (
                    <div
                        key={idx}
                        className={`h-4 w-4 rounded-full border border-white ring-1 ring-gray-200`}
                        style={{ backgroundColor: color }}
                    />
                    ))}
                    {product.colors.length > 3 && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-gray-100 text-[9px] text-gray-500 ring-1 ring-white">
                            +
                        </span>
                    )}
                </div>
            )}
        </div>

        {/* 4. MOVE TO CART BUTTON - Outlined style, Thanh thoát */}
        <button
            onClick={() => onMoveToCart(product.id)}
            disabled={!product.inStock}
            className="mt-4 w-full border border-black bg-white py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-black transition-all hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Move to Cart
        </button>
      </div>
    </div>
  );
}
