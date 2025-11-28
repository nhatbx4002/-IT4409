import { useState, useEffect } from "react";
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
  Zap,
  Share2,
  Check,
  CreditCard,
} from "lucide-react";
import type { ProductDetail } from "@/types/products";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

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

const FALLBACK_SWATCHES = [
  { name: "Midnight Blue", hex: "#0F1F3D" },
  { name: "Navy", hex: "#0A0F2D" },
  { name: "Charcoal", hex: "#3A3A3A" },
  { name: "Black", hex: "#111111" },
  { name: "Gray", hex: "#A0A0A0" },
];

const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL"];

const formatColorLabel = (value: string | null) =>
  value ? value.replace(/-/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()) : "Select";

export function ProductHero({ product }: ProductHeroProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const availableVariants = selectedColor
    ? product.variants.filter((v) => v.color === selectedColor)
    : product.variants;

  const availableSizes = Array.from(
    new Set(availableVariants.map((v) => v.size).filter((s): s is string => !!s))
  ).sort();

  const availableColors = Array.from(
    new Set(product.variants.map((v) => v.color).filter((c): c is string => !!c))
  );

  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableColors, availableSizes, selectedColor, selectedSize]);

  const currentVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const displayPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice;
  const discountAmount = hasDiscount ? product.price - (product.salePrice || 0) : 0;
  const klarnaSplit = (displayPrice / 4).toFixed(2);

  const handleAddToCart = () => {
    console.log("Add to cart", { productId: product.id, color: selectedColor, size: selectedSize, quantity });
  };

  const handleBuyNow = () => {
    console.log("Buy now", { productId: product.id, color: selectedColor, size: selectedSize, quantity });
  };

  const handleAddToWishlist = () => {
    console.log("Add to wishlist", product.id);
  };

  const isVariantInStock = currentVariant ? currentVariant.stockQuantity > 0 : product.inStock;
  const primarySku = currentVariant?.sku || product.variants[0]?.sku || `AWS-${product.id}`;
  const colorSwatches =
    availableColors.length > 0
      ? availableColors.slice(0, 5).map((color) => ({
          name: formatColorLabel(color),
          value: color,
          hex: COLOR_HEX_MAP[color.toLowerCase()] || color,
        }))
      : FALLBACK_SWATCHES.map((swatch) => ({
          name: swatch.name,
          value: swatch.name.toLowerCase(),
          hex: swatch.hex,
        }));

  const combinedSizes = Array.from(new Set([...SIZE_ORDER, ...availableSizes]));
  const orderedSizes = combinedSizes.sort((a, b) => {
    const aIndex = SIZE_ORDER.indexOf(a);
    const bIndex = SIZE_ORDER.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });

  useEffect(() => {
    if (!selectedColor && colorSwatches.length > 0) {
      setSelectedColor(colorSwatches[0].value);
    }
    if (!selectedSize && orderedSizes.length > 0) {
      setSelectedSize(orderedSizes[0]);
    }
  }, [colorSwatches, orderedSizes, selectedColor, selectedSize]);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[55%_45%]">
      <div className="rounded-[24px] border border-white/40 bg-white/10 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl">
        <div className="relative mx-auto flex w-full max-w-[720px] flex-col items-center">
          <div
            className="relative w-full overflow-hidden rounded-[16px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
            style={{
              height: "min(900px, 90vh)",
              maxHeight: "900px",
            }}
          >
            <ImageWithFallback
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.name}
              className="h-full w-full object-cover"
            />

            <span className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#1A1A1A] shadow">
              <RotateCcw className="h-4 w-4 text-[#D4AF37]" />
              360° View
            </span>

            <button
              aria-label="Zoom image"
              className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1A1A1A] shadow-lg transition-transform hover:scale-105"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              aria-label="Add to wishlist"
              onClick={handleAddToWishlist}
              className="absolute right-6 top-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#D4AF37] shadow-lg transition-transform hover:scale-105"
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>

          {product.images.length > 1 && (
            <div className="mt-6 flex w-full justify-center gap-4 overflow-x-auto pb-2">
              {product.images.slice(0, 5).map((image, idx) => {
                const isActive = idx === selectedImageIndex;
                return (
                  <button
                    key={image}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`h-[120px] w-[120px] overflow-hidden rounded-[16px] border transition-all duration-300 ${
                      isActive ? "border-[#D4AF37] shadow-lg" : "border-[#E5E7EB] hover:border-[#D4AF37]"
                    }`}
                  >
                    <ImageWithFallback src={image} alt={`${product.name} view ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <aside className="rounded-[24px] border border-[#F1F1F1] bg-white/80 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.05)] backdrop-blur-xl lg:sticky lg:top-8">
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
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={`h-4 w-4 ${idx < Math.round(product.rating) ? "fill-[#D4AF37] text-[#D4AF37]" : "text-[#E5E7EB]"}`}
                      strokeWidth={idx < Math.round(product.rating) ? 0 : 1.5}
                    />
                  ))}
                </div>
                <button type="button" className="text-[13px] font-medium text-[#D4AF37] underline" onClick={() => document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" })}>
                  ({product.reviewCount} reviews)
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-end gap-4">
              <span className="text-[36px] font-bold text-[#1A1A1A]">${displayPrice.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-[24px] text-[#9CA3AF] line-through">${product.price.toFixed(2)}</span>
                  <span className="rounded-full bg-[#E11D48] px-4 py-1 text-[12px] font-semibold uppercase tracking-wide text-white">
                    -{Math.round((discountAmount / product.price) * 100)}% Off
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 text-[14px] text-[#6B7280]">
              <CreditCard className="h-4 w-4 text-[#D4AF37]" />
              <span>or 4 payments of ${klarnaSplit} with Klarna</span>
            </div>
          </div>

          {colorSwatches.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between text-[14px] font-medium text-[#1A1A1A]">
                <span>Color: <span className="text-[#6B7280]">{formatColorLabel(selectedColor)}</span></span>
                <span className="text-[#D4AF37]">Premium dye</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {colorSwatches.map((swatch) => {
                  const isActive = selectedColor === swatch.value || (!selectedColor && swatch === colorSwatches[0]);
                  return (
                    <button
                      key={swatch.value}
                      onClick={() => setSelectedColor(swatch.value)}
                      className={`relative h-12 w-12 rounded-full border-2 transition-all duration-300 ${isActive ? "border-[#D4AF37] scale-110" : "border-transparent hover:border-[#D4AF37]"}`}
                      style={{ backgroundColor: swatch.hex }}
                      aria-label={swatch.name}
                    >
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
                <span className="text-[14px] font-semibold text-[#1A1A1A]">Size</span>
                <button className="text-[13px] font-medium text-[#D4AF37] underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {orderedSizes.map((size) => {
                  const sizeVariant = availableVariants.find((variant) => variant.size === size);
                  const inStock = sizeVariant ? sizeVariant.stockQuantity > 0 : availableSizes.includes(size);
                  const isActive = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => inStock && setSelectedSize(size)}
                      disabled={!inStock}
                      className={`h-12 w-14 rounded-[8px] border text-[14px] font-semibold transition-all ${
                        !inStock
                          ? "border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] line-through cursor-not-allowed"
                          : isActive
                          ? "border-[#D4AF37] bg-[#D4AF37] text-black shadow-lg"
                          : "border-[#E5E7EB] bg-white text-[#1A1A1A] hover:border-[#D4AF37]"
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
            <span className="text-[14px] font-semibold text-[#1A1A1A]">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#E5E7EB] text-[#1A1A1A] transition hover:border-[#D4AF37] disabled:opacity-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <div className="flex h-11 w-16 items-center justify-center rounded-[8px] border border-[#E5E7EB] text-[16px] font-semibold">
                {quantity}
              </div>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                disabled={!isVariantInStock || (currentVariant && quantity >= currentVariant.stockQuantity)}
                className="flex h-11 w-11 items-center justify-center rounded-[8px] border border-[#E5E7EB] text-[#1A1A1A] transition hover:border-[#D4AF37] disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </section>

          <section className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-[60%_40%]">
              <button
                onClick={handleAddToCart}
                disabled={!isVariantInStock}
                className="flex h-14 items-center justify-center gap-3 rounded-[12px] bg-[#D4AF37] text-[14px] font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#C19A2F] disabled:opacity-60"
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={!isVariantInStock}
                className="flex h-14 items-center justify-center gap-2 rounded-[12px] bg-[#1A1A1A] text-[14px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-black disabled:opacity-60"
              >
                <Zap className="h-5 w-5 text-[#D4AF37]" />
                Buy Now
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAddToWishlist}
                className="flex flex-1 min-w-[180px] items-center justify-center gap-2 rounded-[12px] border border-[#E5E7EB] py-3 text-[14px] font-semibold text-[#1A1A1A] transition hover:border-[#D4AF37]"
              >
                <Heart className="h-4 w-4 text-[#D4AF37]" />
                Add to Wishlist
              </button>
              <button className="flex flex-1 min-w-[150px] items-center justify-center gap-2 rounded-[12px] border border-[#E5E7EB] py-3 text-[14px] font-semibold text-[#1A1A1A] transition hover:border-[#D4AF37]">
                <Share2 className="h-4 w-4 text-[#1A1A1A]" />
                Share
              </button>
            </div>
          </section>

          <section className="grid gap-4 border-t border-[#F3F4F6] pt-6 sm:grid-cols-3">
            {[
              { icon: Truck, title: "Free Shipping", desc: "Complimentary on all orders", iconColor: "#D4AF37" },
              { icon: RotateCcw, title: "Easy Returns", desc: "30-day hassle-free returns", iconColor: "#1A1A1A" },
              { icon: Shield, title: "Secure Payment", desc: "256-bit SSL encryption", iconColor: "#1A1A1A" },
            ].map((feature) => (
              <div key={feature.title} className="rounded-[16px] bg-[#F9FAFB] p-4 text-center shadow-sm">
                <feature.icon className="mx-auto mb-3 h-8 w-8" style={{ color: feature.iconColor }} />
                <p className="text-[14px] font-semibold text-[#1A1A1A]">{feature.title}</p>
                <p className="text-[13px] text-[#6B7280]">{feature.desc}</p>
              </div>
            ))}
          </section>
        </div>
      </aside>
    </div>
  );
}

