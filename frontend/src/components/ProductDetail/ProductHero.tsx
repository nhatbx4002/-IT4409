import { useState, useRef, useEffect } from "react";
import { Star, Heart, Minus, Plus, Truck, RotateCcw, Shield } from "lucide-react";
import type { ProductDetail } from "@/types/products";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

interface ProductHeroProps {
  product: ProductDetail;
}

export function ProductHero({ product }: ProductHeroProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [api, setApi] = useState<CarouselApi>();
  const imageRef = useRef<HTMLDivElement>(null);

  // Get available variants for selected color
  const availableVariants = selectedColor
    ? product.variants.filter((v) => v.color === selectedColor)
    : product.variants;

  // Get available sizes for selected color
  const availableSizes = Array.from(
    new Set(availableVariants.map((v) => v.size).filter((s): s is string => !!s))
  ).sort();

  // Get available colors
  const availableColors = Array.from(
    new Set(product.variants.map((v) => v.color).filter((c): c is string => !!c))
  );

  // Initialize selected color and size
  useEffect(() => {
    if (availableColors.length > 0 && !selectedColor) {
      setSelectedColor(availableColors[0]);
    }
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableColors, availableSizes, selectedColor, selectedSize]);

  // Sync carousel with selected image index
  useEffect(() => {
    if (!api) return;
    api.scrollTo(selectedImageIndex);
  }, [api, selectedImageIndex]);

  // Update selected index when carousel changes
  useEffect(() => {
    if (!api) return;
    const onSelect = () => {
      setSelectedImageIndex(api.selectedScrollSnap());
    };
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Get current variant
  const currentVariant = product.variants.find(
    (v) => v.color === selectedColor && v.size === selectedSize
  );

  // Get display price
  const displayPrice = product.salePrice || product.price;
  const hasDiscount = !!product.salePrice;
  const discountAmount = hasDiscount ? product.price - (product.salePrice || 0) : 0;

  // Handle image zoom on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setZoomPosition({ x, y });
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart
    console.log("Add to cart", { productId: product.id, color: selectedColor, size: selectedSize, quantity });
  };

  const handleBuyNow = () => {
    // TODO: Implement buy now
    console.log("Buy now", { productId: product.id, color: selectedColor, size: selectedSize, quantity });
  };

  const handleAddToWishlist = () => {
    // TODO: Implement add to wishlist
    console.log("Add to wishlist", product.id);
  };

  const isVariantInStock = currentVariant ? currentVariant.stockQuantity > 0 : product.inStock;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      {/* Left Column - Product Media (7 columns on desktop) */}
      <div className="lg:col-span-7">
        {/* Desktop: Main Image with Zoom */}
        <div
          ref={imageRef}
          className="hidden lg:block relative w-full bg-[#F8F8F8] mb-4 overflow-hidden"
          style={{ aspectRatio: "3/4" }}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
        >
          <ImageWithFallback
            src={product.images[selectedImageIndex] || product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300"
            style={{
              transform: isZoomed ? `scale(1.5) translate(${zoomPosition.x - 50}%, ${zoomPosition.y - 50}%)` : "scale(1)",
            }}
          />
        </div>

        {/* Mobile: Image Carousel with Dots */}
        {product.images.length > 1 && (
          <div className="lg:hidden mb-4">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {product.images.map((image, idx) => (
                  <CarouselItem key={idx}>
                    <div
                      className="relative w-full bg-[#F8F8F8] overflow-hidden"
                      style={{ aspectRatio: "3/4" }}
                    >
                      <ImageWithFallback
                        src={image}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            {/* Dot Navigation */}
            <div className="flex justify-center gap-2 mt-4">
              {product.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedImageIndex(idx);
                    api?.scrollTo(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    selectedImageIndex === idx
                      ? "bg-black w-6"
                      : "bg-[#E0E0E0]"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mobile: Single Image (if only one image) */}
        {product.images.length === 1 && (
          <div className="lg:hidden relative w-full bg-[#F8F8F8] mb-4 overflow-hidden" style={{ aspectRatio: "3/4" }}>
            <ImageWithFallback
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Thumbnail Gallery */}
        {product.images.length > 1 && (
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
            {product.images.slice(0, 6).map((image, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`shrink-0 w-20 h-20 border-2 transition-all duration-300 ${
                  selectedImageIndex === idx
                    ? "border-black opacity-100"
                    : "border-[#E0E0E0] opacity-70 hover:opacity-100"
                }`}
              >
                <ImageWithFallback
                  src={image}
                  alt={`${product.name} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            className="flex-1 border border-[#E0E0E0] bg-white text-black uppercase tracking-wider py-3 px-6 text-sm font-medium hover:bg-[#F8F8F8] transition-colors duration-300"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            360° View
          </button>
          <button
            className="flex-1 border border-[#E0E0E0] bg-white text-black uppercase tracking-wider py-3 px-6 text-sm font-medium hover:bg-[#F8F8F8] transition-colors duration-300"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            View on Model
          </button>
        </div>
      </div>

      {/* Right Column - Product Info (5 columns on desktop, sticky) */}
      <div className="lg:col-span-5">
        <div className="sticky top-8">
          {/* Brand Name */}
          <div
            className="uppercase tracking-wider mb-2"
            style={{
              color: "#C2A26F",
              fontSize: "12px",
              fontWeight: 600,
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: "1.5px",
            }}
          >
            {product.brand}
          </div>

          {/* Product Title */}
          <h1
            className="text-black mb-4"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "32px",
              fontWeight: 600,
              lineHeight: "1.3",
            }}
          >
            {product.name}
          </h1>

          {/* Rating Summary */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, idx) => (
                <Star
                  key={idx}
                  className={`w-4 h-4 ${
                    idx < Math.floor(product.rating) ? "fill-current" : "fill-none"
                  }`}
                  style={{
                    color: idx < Math.floor(product.rating) ? "#C2A26F" : "#E0E0E0",
                    strokeWidth: idx < Math.floor(product.rating) ? 0 : 2,
                  }}
                />
              ))}
            </div>
            <a
              href="#reviews"
              className="underline text-[#757575] text-sm"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              ({product.reviewCount} Reviews)
            </a>
          </div>

          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              {hasDiscount && (
                <span
                  className="text-[#757575] line-through"
                  style={{
                    fontSize: "20px",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  ${product.price}
                </span>
              )}
              <span
                className="text-black"
                style={{
                  fontSize: "32px",
                  fontWeight: 700,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                ${displayPrice}
              </span>
            </div>
            {hasDiscount && (
              <div
                className="inline-block bg-yellow-100 text-black px-3 py-1 text-sm font-medium"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                Save ${discountAmount.toFixed(2)}
              </div>
            )}
          </div>

          {/* Color Selector */}
          {availableColors.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <label
                  className="text-black text-sm font-medium"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Color:
                </label>
                <span
                  className="text-[#757575] text-sm"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  {selectedColor || "Select"}
                </span>
              </div>
              <div className="flex gap-3 flex-wrap">
                {availableColors.map((color) => {
                  // Try to find a variant with this color to get its image
                  const colorVariant = product.variants.find((v) => v.color === color);
                  const isSelected = selectedColor === color;

                  return (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        // Update image if variant has specific image
                        if (colorVariant?.imageUrl) {
                          const imageIndex = product.images.findIndex((img) => img === colorVariant.imageUrl);
                          if (imageIndex >= 0) {
                            setSelectedImageIndex(imageIndex);
                          }
                        }
                      }}
                      className={`relative w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                        isSelected ? "border-black scale-110" : "border-[#E0E0E0]"
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        boxShadow: isSelected ? "0 0 0 2px rgba(0,0,0,0.1)" : "none",
                      }}
                      title={color}
                      aria-label={color}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {availableSizes.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label
                  className="text-black text-sm font-medium"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Size
                </label>
                <a
                  href="#size-guide"
                  className="text-[#757575] text-sm underline"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Size Guide
                </a>
              </div>
              <div className="flex gap-2 flex-wrap">
                {availableSizes.map((size) => {
                  const sizeVariant = availableVariants.find((v) => v.size === size);
                  const isInStock = sizeVariant ? sizeVariant.stockQuantity > 0 : false;
                  const isSelected = selectedSize === size;

                  return (
                    <button
                      key={size}
                      onClick={() => isInStock && setSelectedSize(size)}
                      disabled={!isInStock}
                      className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                        isSelected
                          ? "bg-black text-white"
                          : isInStock
                          ? "bg-white text-black border border-[#E0E0E0] hover:border-black"
                          : "bg-[#F5F5F5] text-[#999999] border border-[#E0E0E0] line-through cursor-not-allowed"
                      }`}
                      style={{ fontFamily: "'Poppins', sans-serif" }}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <label
              className="block text-black text-sm font-medium mb-3"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              Quantity
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-10 border border-[#E0E0E0] flex items-center justify-center hover:bg-[#F8F8F8] transition-colors duration-300"
                disabled={quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span
                className="text-black text-lg font-medium w-12 text-center"
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-10 border border-[#E0E0E0] flex items-center justify-center hover:bg-[#F8F8F8] transition-colors duration-300"
                disabled={!isVariantInStock || (currentVariant && quantity >= currentVariant.stockQuantity)}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Main Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={!isVariantInStock}
              className="w-full bg-[#C2A26F] text-black uppercase tracking-widest py-4 px-6 text-sm font-bold hover:bg-[#B8945F] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "1.5px" }}
            >
              ADD TO CART
            </button>
            <button
              onClick={handleBuyNow}
              disabled={!isVariantInStock}
              className="w-full bg-black text-white uppercase tracking-widest py-4 px-6 text-sm font-bold hover:bg-[#333333] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "1.5px" }}
            >
              BUY NOW
            </button>
            <button
              onClick={handleAddToWishlist}
              className="w-full border border-[#E0E0E0] bg-white text-black uppercase tracking-widest py-4 px-6 text-sm font-medium hover:bg-[#F8F8F8] transition-colors duration-300 flex items-center justify-center gap-2"
              style={{ fontFamily: "'Poppins', sans-serif", letterSpacing: "1.5px" }}
            >
              <Heart className="w-4 h-4" />
              Add to Wishlist
            </button>
          </div>

          {/* Service Icons */}
          <div className="space-y-3 pt-6 border-t border-[#E5E5E5]">
            <div className="flex items-center gap-3 text-sm text-[#757575]">
              <Truck className="w-5 h-5 shrink-0" />
              <span style={{ fontFamily: "'Poppins', sans-serif" }}>Free shipping on orders over $100</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#757575]">
              <RotateCcw className="w-5 h-5 shrink-0" />
              <span style={{ fontFamily: "'Poppins', sans-serif" }}>30-day return policy</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#757575]">
              <Shield className="w-5 h-5 shrink-0" />
              <span style={{ fontFamily: "'Poppins', sans-serif" }}>Secure payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

