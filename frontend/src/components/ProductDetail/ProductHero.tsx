import { useState, useEffect, useMemo } from "react";
import {
  Star,
  Heart,
  Minus,
  Plus,
  Truck,
  RotateCcw,
  Shield,
  Search,
  ShoppingBag,
  Share2,
  Check,
  CreditCard,
  Loader2,
  MapPin,
} from "lucide-react";
import type { ProductDetail } from "@/types/products";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { addToCart, getProductReviews } from "@/lib/api";
import { formatVnd } from "@/lib/formatCurrency";
import { toast } from "sonner";

interface ProductHeroProps {
  product: ProductDetail;
}

const COLOR_HEX_MAP: Record<string, string> = {
  "midnight blue": "#0F1F3D",
  navy: "#0A0F2D",
  charcoal: "#3A3A3A",
  black: "#111111",
  gray: "#A0A0A0",
  grey: "#A0A0A0",
  brown: "#5C4433",
};

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

// Component to render star rating with half star support
const StarRating = ({ rating, size = "h-4 w-4" }: { rating: number; size?: string }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5 && rating % 1 < 1;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {/* Full stars */}
      {Array.from({ length: fullStars }).map((_, idx) => (
        <Star
          key={`full-${idx}`}
          className={`${size} fill-[#D4AF37] text-[#D4AF37]`}
          strokeWidth={0}
        />
      ))}
      
      {/* Half star */}
      {hasHalfStar && (
        <div className="relative inline-block" style={{ width: '1rem', height: '1rem' }}>
          {/* Empty star background */}
          <Star
            className={`${size} absolute inset-0 text-[#E5E7EB]`}
            strokeWidth={1.5}
          />
          {/* Half filled star */}
          <div 
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: 'inset(0 50% 0 0)' }}
          >
            <Star
              className={`${size} fill-[#D4AF37] text-[#D4AF37]`}
              strokeWidth={0}
            />
          </div>
        </div>
      )}
      
      {/* Empty stars */}
      {Array.from({ length: emptyStars }).map((_, idx) => (
        <Star
          key={`empty-${idx}`}
          className={`${size} text-[#E5E7EB]`}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
};

export function ProductHero({ product }: ProductHeroProps) {
  const productDetail = product as ProductDetail & {
    availableColors?: string[];
    availableSizes?: string[];
    minPrice?: number;
    maxPrice?: number;
  };

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isImageFading, setIsImageFading] = useState(false);
  const [isHoverZoom, setIsHoverZoom] = useState(false);
  const [isZoomEnabled, setIsZoomEnabled] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [ratingStats, setRatingStats] = useState<{ averageRating: number; totalReviews: number } | null>(null);

  const { colorImageMap, baseImages } = useMemo(() => {
    const map: Record<string, string> = {};

    product.variants.forEach((variant) => {
      if (variant.color) {
        if (variant.imageUrl && !map[variant.color]) {
          map[variant.color] = variant.imageUrl;
        }
      }
    });

    return {
      colorImageMap: map,
      baseImages: product.images || [],
    };
  }, [product]);

  const galleryImages = useMemo(() => {
    const variantImages = product.variants
      .map((v) => v.imageUrl)
      .filter((img): img is string => Boolean(img));

    const prioritized = selectedColor && colorImageMap[selectedColor]
      ? [colorImageMap[selectedColor]]
      : [];

    const merged = [...prioritized, ...variantImages, ...baseImages].filter(Boolean);
    return merged.filter((img, idx) => merged.indexOf(img) === idx);
  }, [baseImages, colorImageMap, product.variants, selectedColor]);

  const selectedVariant = useMemo(
    () =>
      product.variants.find(
        (v) => v.color === selectedColor && v.size === selectedSize
      ) || null,
    [product.variants, selectedColor, selectedSize]
  );

  const orderedSizes = useMemo(() => {
    const combinedSizes = Array.from(new Set(productDetail.availableSizes ?? []));
    return combinedSizes.sort((a, b) => {
      const aIndex = SIZE_ORDER.indexOf(a);
      const bIndex = SIZE_ORDER.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [productDetail.availableSizes]);

  const sizeStates = useMemo(
    () =>
      orderedSizes.map((size) => {
        const isAvailable = selectedColor
          ? product.variants.some(
              (variant) =>
                variant.color === selectedColor &&
                variant.size === size &&
                variant.stockQuantity > 0
            )
          : product.variants.some(
              (variant) => variant.size === size && variant.stockQuantity > 0
            );
        return { size, isAvailable };
      }),
    [orderedSizes, product.variants, selectedColor]
  );

  useEffect(() => {
    if (!selectedColor || !selectedSize) return;
    const stillAvailable = product.variants.some(
      (variant) =>
        variant.color === selectedColor &&
        variant.size === selectedSize &&
        variant.stockQuantity > 0
    );
    if (!stillAvailable) {
      setSelectedSize(null);
    }
  }, [product.variants, selectedColor, selectedSize]);

  useEffect(() => {
    if (selectedImageIndex >= galleryImages.length) {
      setSelectedImageIndex(0);
    }
  }, [galleryImages.length, selectedImageIndex]);

  useEffect(() => {
    setSelectedImageIndex(0);
  }, [selectedColor]);

  useEffect(() => {
    setIsImageFading(true);
    const timeout = setTimeout(() => setIsImageFading(false), 180);
    return () => clearTimeout(timeout);
  }, [selectedImageIndex, galleryImages]);

  const minPrice = typeof productDetail.minPrice === "number" ? productDetail.minPrice : product.price;
  const maxPrice = typeof productDetail.maxPrice === "number" ? productDetail.maxPrice : product.price;

  // Price is now from product level, not variant level
  const displayPriceText = product.salePrice
    ? `${formatVnd(product.salePrice)}`
    : `${formatVnd(product.price)}`;

  const stockStatusText = selectedVariant
    ? selectedVariant.stockQuantity === 0
      ? "Hết hàng"
      : selectedVariant.stockQuantity <= 5
      ? `Sắp hết (Còn ${selectedVariant.stockQuantity} sản phẩm)`
      : "Còn hàng"
    : "Vui lòng chọn màu sắc và kích cỡ";

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.error("Vui lòng chọn màu sắc và kích cỡ");
      return;
    }

    if (!selectedVariant.id) {
      toast.error("Invalid product variant");
      return;
    }

    if (quantity <= 0) {
      toast.error("Số lượng phải lớn hơn 0");
      return;
    }

    if (selectedVariant.stockQuantity < quantity) {
      toast.error(`Chỉ còn ${selectedVariant.stockQuantity} sản phẩm trong kho`);
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(selectedVariant.id, quantity);
      toast.success("Đã thêm sản phẩm vào giỏ hàng!");
      setQuantity(1);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Thêm sản phẩm vào giỏ hàng thất bại";
      toast.error(errorMessage);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    console.log("Buy now", { productId: product.id, color: selectedColor, size: selectedSize, quantity });
  };

  const handleAddToWishlist = () => {
    console.log("Add to wishlist", product.id);
  };

  const isVariantInStock = selectedVariant ? selectedVariant.stockQuantity > 0 : false;
  const hasValidSelection = Boolean(selectedColor && selectedSize && selectedVariant && isVariantInStock);
  const primarySku = selectedVariant?.sku || product.variants[0]?.sku || `AWS-${product.id}`;
  const colorSwatches =
    (productDetail.availableColors ?? []).map((color) => ({
      name: color,
      value: color,
      hex: COLOR_HEX_MAP[color.toLowerCase()] || color,
    }));

  const defaultColor = useMemo(() => {
    if (productDetail.availableColors && productDetail.availableColors.length > 0) {
      return productDetail.availableColors[0];
    }
    const firstVariantColor = product.variants.find((variant) => variant.color)?.color ?? null;
    return firstVariantColor;
  }, [product.variants, productDetail.availableColors]);

  useEffect(() => {
    if (!selectedColor && defaultColor) {
      setSelectedColor(defaultColor);
    }
  }, [defaultColor, selectedColor]);

  // Load rating stats from reviews API
  useEffect(() => {
    const loadRatingStats = async () => {
      try {
        const data = await getProductReviews(product.id, { page: 1, pageSize: 1 });
        setRatingStats({
          averageRating: data.ratingStats?.averageRating || 0,
          totalReviews: data.total || 0,
        });
      } catch (error) {
        console.error("Failed to load rating stats", error);
        setRatingStats({
          averageRating: product.rating || 0,
          totalReviews: product.reviewCount || 0,
        });
      }
    };

    if (product?.id) {
      loadRatingStats();
    }
  }, [product?.id, product.rating, product.reviewCount]);

  const leadImage = galleryImages[selectedImageIndex] || galleryImages[0];
  const secondaryImages = galleryImages.filter((_, idx) => idx !== selectedImageIndex);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[60%_40%]">
      <div className="rounded-[24px] border border-white/40 bg-white/60 p-5 shadow-[0_25px_70px_rgba(0,0,0,0.06)] backdrop-blur-xl">
        <div className="space-y-5">
          <div className="space-y-5">
            <div
              className="relative overflow-hidden rounded-[18px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
              onMouseEnter={() => setIsHoverZoom(true)}
              onMouseLeave={() => setIsHoverZoom(false)}
              onMouseMove={(e) => {
                const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                setZoomPosition({
                  x: Math.min(100, Math.max(0, x)),
                  y: Math.min(100, Math.max(0, y)),
                });
              }}
            >
              <ImageWithFallback
                key={leadImage}
                src={leadImage}
                alt={product.name}
                className={`h-full w-full object-contain bg-[#F5F5F5] transition-opacity duration-300 ${isImageFading ? "opacity-0" : "opacity-100"}`}
                style={{ height: "min(76vh, 860px)" }}
              />

              {/* Hover zoom overlay */}
              <div
                className={`pointer-events-none absolute inset-0 transition-opacity duration-200 ${
                  isHoverZoom && isZoomEnabled ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  backgroundImage: `url(${leadImage})`,
                  backgroundSize: "200% 200%",
                  backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />

              <button
                aria-label="Zoom image"
                onClick={() => setIsZoomEnabled((prev) => !prev)}
                className={`absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1A1A1A] shadow-lg transition-transform hover:scale-105 ${
                  isZoomEnabled ? "ring-2 ring-[#D4AF37]" : ""
                }`}
                title={isZoomEnabled ? "Disable hover zoom" : "Enable hover zoom"}
              >
                <Search className="h-5 w-5" />
              </button>
            </div>

            {galleryImages.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((image, idx) => {
                  const isActive = idx === selectedImageIndex;
                  return (
                    <button
                      key={image}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative h-[120px] min-w-[120px] overflow-hidden rounded-[12px] border bg-white shadow-sm transition hover:-translate-y-1 ${
                        isActive ? "border-[#D4AF37] shadow-md" : "border-[#E5E7EB]"
                      }`}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`${product.name} view ${idx + 1}`}
                        className="h-full w-full object-contain bg-[#F5F5F5]"
                      />
                      {isActive && (
                        <span className="absolute left-2 top-2 rounded-full bg-[#D4AF37] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-black shadow">
                          Đang xem
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <aside className="rounded-[24px] border border-[#F1F1F1] bg-white/80 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.05)] backdrop-blur-xl lg:sticky lg:top-6">
        <div className="space-y-8">
          <div className="space-y-3">
            <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#D4AF37]">
              {product.brand || "Aristino Collection"}
            </p>
            <h1 className="font-['Playfair_Display'] text-[40px] font-semibold leading-tight text-[#1A1A1A]">
              {product.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#6B7280]">
              <span>SKU: {primarySku}</span>
              <div className="flex items-center gap-2">
                <StarRating rating={ratingStats?.averageRating || product.rating || 0} />
                <button 
                  type="button" 
                  className="text-[13px] font-medium text-[#D4AF37] underline hover:text-[#C19A2F] transition-colors" 
                  onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })}
                >
                  ({ratingStats?.totalReviews || product.reviewCount || 0} đánh giá)
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-end gap-4">
              <span className="font-['Playfair_Display'] text-[32px] font-semibold text-[#1A1A1A]">
                {displayPriceText}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[14px] text-[#6B7280]">
              <CreditCard className="h-4 w-4 text-[#D4AF37]" />
              <span>{stockStatusText}</span>
            </div>
          </div>

          {colorSwatches.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between text-[14px] font-medium text-[#1A1A1A]">
                <span className="uppercase tracking-[0.22em] text-[#6B7280]">
                  Màu sắc
                  <span className="ml-2 text-[#1A1A1A] normal-case tracking-normal">
                    {selectedColor || "Chưa chọn"}
                  </span>
                </span>
                <span className="text-[#D4AF37]">Premium dye</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {colorSwatches.map((swatch) => {
                  const isActive = selectedColor === swatch.value || (!selectedColor && swatch === colorSwatches[0]);
                  const swatchImage = colorImageMap[swatch.value];
                  return (
                    <button
                      key={swatch.value}
                      onMouseEnter={() => {
                        setSelectedColor(swatch.value);
                        if (swatchImage) {
                          const idx = galleryImages.indexOf(swatchImage);
                          if (idx >= 0) setSelectedImageIndex(idx);
                        }
                      }}
                      onClick={() => setSelectedColor(swatch.value)}
                      className={`relative h-12 w-12 overflow-hidden rounded-full border-2 transition-all duration-300 ${isActive ? "border-[#D4AF37] scale-110" : "border-transparent hover:border-[#D4AF37]"}`}
                      style={
                        swatchImage
                          ? {
                              backgroundImage: `url(${swatchImage})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                          : { backgroundColor: swatch.hex }
                      }
                      aria-label={swatch.name}
                    >
                      {swatchImage && (
                        <span className="absolute inset-0 bg-black/10" aria-hidden="true" />
                      )}
                      {isActive && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <Check className="h-5 w-5 text-white drop-shadow" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          {orderedSizes.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-semibold uppercase tracking-[0.24em] text-[#6B7280]">
                  Kích cỡ
                </span>
                <button className="text-[13px] font-medium text-[#D4AF37] underline">Hướng dẫn chọn size</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizeStates.map(({ size, isAvailable }) => {
                  const isActive = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`h-11 min-w-[56px] rounded-lg border text-[13px] font-semibold uppercase tracking-[0.12em] transition-all ${
                        !isAvailable
                          ? "border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] line-through cursor-not-allowed"
                          : isActive
                          ? "border-[#111827] bg-[#111827] text-white shadow-sm"
                          : "border-gray-300 bg-white text-[#1A1A1A] hover:border-[#D4AF37]"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </section>
          )}

          <section className="space-y-3">
            <span className="text-[14px] font-semibold text-[#1A1A1A]">Số lượng</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-[#1A1A1A] transition hover:border-[#D4AF37] disabled:opacity-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="flex h-10 min-w-[44px] items-center justify-center rounded-full border border-gray-300 text-[15px] font-semibold">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                disabled={
                  !isVariantInStock || (selectedVariant ? quantity >= selectedVariant.stockQuantity : false)
                }
                className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 text-[#1A1A1A] transition hover:border-[#D4AF37] disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[60%_40%]">
              <button
                onClick={handleAddToCart}
                disabled={!hasValidSelection || isAddingToCart}
                className="flex h-14 items-center justify-center gap-3 rounded-[12px] bg-[#D4AF37] text-[14px] font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#C19A2F] disabled:opacity-60"
              >
                {isAddingToCart ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ShoppingBag className="h-5 w-5" />
                )}
                {isAddingToCart ? "Đang thêm..." : "Thêm vào giỏ hàng"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!hasValidSelection}
                className="flex h-14 items-center justify-center gap-2 rounded-[12px] bg-[#1A1A1A] text-[14px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-black disabled:opacity-60"
              >
                <MapPin className="h-5 w-5 text-[#D4AF37]" />
                Tìm tại cửa hàng
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddToWishlist}
                className="flex flex-1 min-w-[180px] items-center justify-center gap-2 rounded-[12px] border border-[#E5E7EB] py-3 text-[14px] font-semibold text-[#1A1A1A] transition hover:border-[#D4AF37]"
              >
                <Heart className="h-4 w-4 text-[#D4AF37]" />
                Thêm vào yêu thích
              </button>
              <button className="flex flex-1 min-w-[150px] items-center justify-center gap-2 rounded-[12px] border border-[#E5E7EB] py-3 text-[14px] font-semibold text-[#1A1A1A] transition hover:border-[#D4AF37]">
                <Share2 className="h-4 w-4 text-[#1A1A1A]" />
                Chia sẻ
              </button>
            </div>
          </section>

          <section className="grid gap-4 border-t border-[#F3F4F6] pt-6 sm:grid-cols-3">
            {[
              { icon: Truck, title: "Miễn phí vận chuyển", desc: "Miễn phí cho mọi đơn hàng", iconColor: "#D4AF37" },
              { icon: RotateCcw, title: "Đổi trả dễ dàng", desc: "Đổi trả trong 30 ngày không phiền phức", iconColor: "#1A1A1A" },
              { icon: Shield, title: "Thanh toán an toàn", desc: "Mã hóa SSL 256-bit bảo mật", iconColor: "#1A1A1A" },
            ].map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div key={feature.title} className="rounded-[16px] bg-[#F9FAFB] p-4 text-center shadow-sm">
                  <IconComponent className="mx-auto mb-3 h-8 w-8" style={{ color: feature.iconColor }} />
                  <p className="text-[14px] font-semibold text-[#1A1A1A]">{feature.title}</p>
                  <p className="text-[13px] text-[#6B7280]">{feature.desc}</p>
                </div>
              );
            })}
          </section>
        </div>
      </aside>

    </div>
  );
}

