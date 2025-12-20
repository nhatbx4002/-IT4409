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
import { addToCart } from "@/lib/api";
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
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isImageFading, setIsImageFading] = useState(false);
  const [isHoverZoom, setIsHoverZoom] = useState(false);
  const [isZoomEnabled, setIsZoomEnabled] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  const { colors, sizes, colorImageMap, baseImages } = useMemo(() => {
    const colorSet = new Set<string>();
    const sizeSet = new Set<string>();
    const map: Record<string, string> = {};

    product.variants.forEach((variant) => {
      if (variant.color) {
        colorSet.add(variant.color);
        if (variant.imageUrl && !map[variant.color]) {
          map[variant.color] = variant.imageUrl;
        }
      }
      if (variant.size) {
        sizeSet.add(variant.size);
      }
    });

    return {
      colors: Array.from(colorSet),
      sizes: Array.from(sizeSet),
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

  const availableVariants = useMemo(
    () =>
      selectedColor
        ? product.variants.filter((v) => v.color === selectedColor)
        : product.variants,
    [product.variants, selectedColor]
  );

  const availableColors = useMemo(
    () =>
      colors.length > 0
        ? colors
        : Array.from(new Set(product.variants.map((v) => v.color).filter((c): c is string => !!c))),
    [colors, product.variants]
  );

  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
  }, [availableColors, selectedColor]);

  const orderedSizes = useMemo(() => {
    const combinedSizes = Array.from(new Set([...SIZE_ORDER, ...sizes]));
    return combinedSizes.sort((a, b) => {
      const aIndex = SIZE_ORDER.indexOf(a);
      const bIndex = SIZE_ORDER.indexOf(b);
      if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
      if (aIndex === -1) return 1;
      if (bIndex === -1) return -1;
      return aIndex - bIndex;
    });
  }, [sizes]);

  const sizeStates = useMemo(
    () =>
      orderedSizes.map((size) => {
        const variantForSize = availableVariants.find((variant) => variant.size === size);
        const inStock = variantForSize ? variantForSize.stockQuantity > 0 : false;
        return { size, inStock };
      }),
    [availableVariants, orderedSizes]
  );

  useEffect(() => {
    const existingSelectionValid = sizeStates.find(
      (state) => state.size === selectedSize && state.inStock
    );
    if (existingSelectionValid) return;

    const firstAvailable = sizeStates.find((state) => state.inStock);
    setSelectedSize(firstAvailable?.size ?? null);
  }, [selectedColor, sizeStates, selectedSize]);

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

  const currentVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  const displayPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice;
  const discountAmount = hasDiscount ? product.price - (product.salePrice || 0) : 0;
  const klarnaSplit = (displayPrice / 4).toFixed(2);

  const handleAddToCart = async () => {
    if (!currentVariant) {
      toast.error("Please select a color and size");
      return;
    }

    if (!currentVariant.id) {
      toast.error("Invalid product variant");
      return;
    }

    if (quantity <= 0) {
      toast.error("Quantity must be greater than 0");
      return;
    }

    if (currentVariant.stockQuantity < quantity) {
      toast.error(`Only ${currentVariant.stockQuantity} items available in stock`);
      return;
    }

    try {
      setIsAddingToCart(true);
      await addToCart(currentVariant.id, quantity);
      toast.success("Product added to cart successfully!");
      setQuantity(1);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to add product to cart";
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

  const isVariantInStock = currentVariant ? currentVariant.stockQuantity > 0 : false;
  const hasValidSelection = Boolean(selectedColor && selectedSize && currentVariant && isVariantInStock);
  const primarySku = currentVariant?.sku || product.variants[0]?.sku || `AWS-${product.id}`;
  const colorSwatches =
    availableColors.length > 0
      ? availableColors.map((color) => ({
          name: formatColorLabel(color),
          value: color,
          hex: COLOR_HEX_MAP[color.toLowerCase()] || color,
        }))
      : FALLBACK_SWATCHES.map((swatch) => ({
          name: swatch.name,
          value: swatch.name.toLowerCase(),
          hex: swatch.hex,
        }));

  useEffect(() => {
    if (!selectedColor && colorSwatches.length > 0) {
      setSelectedColor(colorSwatches[0].value);
    }
  }, [colorSwatches, orderedSizes, selectedColor, selectedSize]);

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
              <span className="font-['Playfair_Display'] text-[32px] font-semibold text-[#1A1A1A]">
                ${displayPrice.toFixed(2)}
              </span>
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
                <span className="uppercase tracking-[0.22em] text-[#6B7280]">
                  Color
                  <span className="ml-2 text-[#1A1A1A] normal-case tracking-normal">
                    {formatColorLabel(selectedColor)}
                  </span>
                </span>
                <span className="text-[#D4AF37]">Premium dye</span>
              </div>
              <div className="flex flex-wrap gap-4">
                {colorSwatches.map((swatch) => {
                  const isActive = selectedColor === swatch.value || (!selectedColor && swatch === colorSwatches[0]);
                  return (
                    <button
                      key={swatch.value}
                      onMouseEnter={() => {
                        setSelectedColor(swatch.value);
                        const colorImage = colorImageMap[swatch.value];
                        if (colorImage) {
                          const idx = galleryImages.indexOf(colorImage);
                          if (idx >= 0) setSelectedImageIndex(idx);
                        }
                      }}
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
                <span className="text-[13px] font-semibold uppercase tracking-[0.24em] text-[#6B7280]">
                  Size
                </span>
                <button className="text-[13px] font-medium text-[#D4AF37] underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-3">
                {sizeStates.map(({ size, inStock }) => {
                  const isActive = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => inStock && setSelectedSize(size)}
                      disabled={!inStock}
                      className={`h-11 min-w-[56px] rounded-lg border text-[13px] font-semibold uppercase tracking-[0.12em] transition-all ${
                        !inStock
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
            <span className="text-[14px] font-semibold text-[#1A1A1A]">Quantity</span>
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
                disabled={!isVariantInStock || (currentVariant && quantity >= currentVariant.stockQuantity)}
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
                {isAddingToCart ? "Adding..." : "Thêm vào giỏ hàng"}
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

