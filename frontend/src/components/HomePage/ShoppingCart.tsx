import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { ShoppingBag, Minus, Plus, X, Loader2, Check } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem, getProductDetail } from "@/lib/api";
import type { CartItem as ApiCartItem, CartResponse } from "@/types/cart";
import { isAuthenticated } from "@/lib/auth";
import { toast } from "sonner";
import { COLOR_OPTIONS } from "@/data/filter-options";

type CartItem = {
  id: number;
  cartItemId: number;
  image: string;
  name: string;
  brand: string;
  color: string;
  size: string;
  price: number;
  quantity: number;
  productId: number;
  productVariantId: number;
  stockQuantity: number;
  stockStatus: "in" | "low";
};

type VariantOption = {
  id: number;
  color: string;
  size: string;
  stockQuantity: number;
  price: number;
};

interface ShoppingCartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const mapApiCartItemToCartItem = (apiItem: ApiCartItem, index: number): CartItem => {
  return {
    id: index + 1,
    cartItemId: apiItem.cart_item_id,
    image: apiItem.image_url || "https://via.placeholder.com/420",
    name: apiItem.product_name,
    brand: "ARISTINO",
    color: apiItem.color || "Không có",
    size: apiItem.size || "Không có",
    price: apiItem.unit_price,
    quantity: apiItem.quantity,
    productId: apiItem.product_id,
    productVariantId: apiItem.product_variant_id,
    stockQuantity: apiItem.stock_quantity,
    stockStatus: apiItem.stock_quantity > 5 ? "in" : "low",
  };
};

const normalizeVariantOption = (variant: {
  id: number;
  color: string | null;
  size: string | null;
  stockQuantity: number;
  price: number;
}): VariantOption => ({
  id: variant.id,
  color: variant.color || "Không có",
  size: variant.size || "Không có",
  stockQuantity: variant.stockQuantity,
  price: variant.price,
});

const COLOR_HEX_MAP = COLOR_OPTIONS.reduce<Record<string, string>>((acc, option) => {
  acc[option.name.toLowerCase()] = option.hex;
  return acc;
}, {});

const getColorHex = (colorName: string): string => {
  const normalized = String(colorName || "").trim().toLowerCase();
  if (!normalized) return "#E5E7EB";
  if (normalized.startsWith("#")) return normalized;
  return COLOR_HEX_MAP[normalized] ?? "#E5E7EB";
};

const resolveVariantSelection = (
  variants: VariantOption[],
  size: string,
  color: string
) => {
  const exact = variants.find(
    (variant) => variant.size === size && variant.color === color
  );
  if (exact) return exact;

  const sizeMatch = variants.find((variant) => variant.size === size);
  if (sizeMatch) return sizeMatch;

  const colorMatch = variants.find((variant) => variant.color === color);
  if (colorMatch) return colorMatch;

  return variants[0] || null;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export function ShoppingCart({ open, onOpenChange }: ShoppingCartProps) {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [variantsByProduct, setVariantsByProduct] = useState<Record<number, VariantOption[]>>({});

  useEffect(() => {
    const fetchCart = async () => {
      if (!open || !isAuthenticated()) {
        return;
      }

      try {
        setIsLoading(true);
        const cart = await getCart();
        setCartData(cart);
        setCartItems(cart.items.map((item, index) => mapApiCartItemToCartItem(item, index)));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load cart";
        toast.error(errorMessage);
        setCartItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [open]);

  useEffect(() => {
    const productIds = Array.from(new Set(cartItems.map((item) => item.productId)));
    const missingIds = productIds.filter((id) => !(id in variantsByProduct));
    if (missingIds.length === 0) return;

    let isCancelled = false;

    const fetchVariants = async () => {
      try {
        const details = await Promise.all(
          missingIds.map((id) => getProductDetail(String(id)))
        );
        if (isCancelled) return;

        setVariantsByProduct((prev) => {
          const next = { ...prev };
          details.forEach((detail, index) => {
            const productId = missingIds[index];
            if (!detail) return;
            next[productId] = detail.variants.map(normalizeVariantOption);
          });
          return next;
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Không thể tải danh sách phiên bản";
        toast.error(message);
      }
    };

    fetchVariants();

    return () => {
      isCancelled = true;
    };
  }, [cartItems, variantsByProduct]);

  const updateLocalQuantity = (cartItemId: number, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const updateQuantity = async (cartItemId: number, change: number) => {
    const item = cartItems.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    const previousQuantity = item.quantity;
    const nextQuantity = Math.max(1, item.quantity + change);
    if (nextQuantity === item.quantity) return;

    // Optimistic update
    updateLocalQuantity(cartItemId, nextQuantity);

    try {
      const updated = await updateCartItem(cartItemId, nextQuantity);
      if (updated.quantity !== nextQuantity) {
        updateLocalQuantity(cartItemId, updated.quantity);
        toast.info(`Chỉ còn ${updated.quantity} sản phẩm`);
      }
    } catch (err) {
      updateLocalQuantity(cartItemId, previousQuantity);
      const errorMessage = err instanceof Error ? err.message : "Không thể cập nhật số lượng";
      toast.error(errorMessage);
    }
  };

  const handleVariantChange = async (
    item: CartItem,
    next: { size?: string; color?: string }
  ) => {
    const variants = variantsByProduct[item.productId];
    if (!variants || variants.length === 0) {
      toast.error("Không có phiên bản cho sản phẩm này");
      return;
    }

    const targetVariant = resolveVariantSelection(
      variants,
      next.size ?? item.size,
      next.color ?? item.color
    );
    if (!targetVariant) {
      toast.error("Phiên bản được chọn không khả dụng");
      return;
    }

    if (targetVariant.id === item.productVariantId) {
      return;
    }

    const previousItem = { ...item };
    const optimisticUpdate: Pick<CartItem, "productVariantId" | "size" | "color" | "stockQuantity" | "stockStatus" | "price"> = {
      productVariantId: targetVariant.id,
      size: targetVariant.size,
      color: targetVariant.color,
      stockQuantity: targetVariant.stockQuantity,
      stockStatus: (targetVariant.stockQuantity > 5 ? "in" : "low") as CartItem["stockStatus"],
      price: targetVariant.price,
    };

    // Optimistic update
    setCartItems((prev) =>
      prev.map((entry) =>
        entry.cartItemId === item.cartItemId
          ? ({ ...entry, ...optimisticUpdate } as CartItem)
          : entry
      )
    );

    try {
      await updateCartItem(item.cartItemId, {
        productVariantId: targetVariant.id,
        quantity: item.quantity,
      });
    } catch (err) {
      setCartItems((prev) =>
        prev.map((entry) =>
          entry.cartItemId === item.cartItemId ? { ...previousItem } : entry
        )
      );
      const errorMessage = err instanceof Error ? err.message : "Không thể cập nhật phiên bản";
      toast.error(errorMessage);
    }
  };

  const removeItem = async (cartItemId: number) => {
    const previousItems = [...cartItems];

    // Optimistic update
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));

    try {
      await removeCartItem(cartItemId);
      const cart = await getCart();
      setCartData(cart);
      setCartItems(cart.items.map((item, index) => mapApiCartItemToCartItem(item, index)));
      toast.success("Đã xóa sản phẩm khỏi giỏ");
    } catch (err) {
      setCartItems(previousItems);
      const errorMessage = err instanceof Error ? err.message : "Không thể xóa sản phẩm";
      toast.error(errorMessage);
    }
  };

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  const isEmpty = cartItems.length === 0;

  const handleViewCart = () => {
    onOpenChange(false);
    navigate("/cart");
  };

  const handleCheckout = () => {
    onOpenChange(false);
    navigate("/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full border-l border-black/10 bg-white/95 p-0 backdrop-blur-xl transition-all duration-500 ease-in-out sm:max-w-lg"
      >
        {/* Header */}
        <SheetHeader className="border-b border-black/10 bg-white/80 px-8 py-6 backdrop-blur">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle 
                className="mb-2"
                style={{ 
                  fontSize: '28px', 
                  fontFamily: "'Playfair Display', serif", 
                  fontWeight: 600 
                }}
              >
                Your Bag
              </SheetTitle>
              <div 
                className="w-16 h-0.5" 
                style={{ backgroundColor: '#D4AF37' }}
              ></div>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="hover:text-[#D4AF37] transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <SheetDescription className="text-sm text-[#666666] mt-4">
            {isEmpty 
              ? 'Your shopping bag is currently empty' 
              : `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'} in your bag`
            }
          </SheetDescription>
        </SheetHeader>

        {/* Cart Content */}
        <div className="flex h-[calc(100vh-120px)] flex-col">
          {isLoading ? (
            <div className="flex flex-1 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#D4AF37]" />
            </div>
          ) : isEmpty ? (
            // Empty State
            <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
              <div
                className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[#F5F5F5]"
              >
                <ShoppingBag className="h-12 w-12 text-[#666666]" />
              </div>
              <h3 
                className="mb-2"
                style={{ 
                  fontSize: '24px', 
                  fontFamily: "'Playfair Display', serif", 
                  fontWeight: 500 
                }}
              >
                Your bag is empty
              </h3>
              <p className="mb-8 text-[#666666]" style={{ fontSize: '16px' }}>
                Start adding items to your shopping bag
              </p>
              <Button
                onClick={() => onOpenChange(false)}
                variant="outline"
                className="rounded-full border-2 border-[#D4AF37] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black"
              >
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto px-8 py-6">
                <div className="space-y-6">
                  {cartItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="animate-in fade-in slide-in-from-right-5 duration-300"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="h-32 w-24 shrink-0 overflow-hidden rounded-sm bg-[#F5F5F5]">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="flex flex-1 flex-col">
                          <div className="mb-2 flex justify-between">
                            <div className="flex-1">
                              <p
                                className="mb-1 text-xs tracking-[0.18em] text-[#D4AF37]"
                              >
                                {item.brand}
                              </p>
                              <h4
                                className="mb-1 font-['Playfair_Display'] text-[15px] font-semibold text-[#111827]"
                              >
                                {item.name}
                              </h4>
                            </div>
                            <button
                              onClick={() => removeItem(item.cartItemId)}
                              className="h-6 text-xs uppercase tracking-[0.18em] text-[#666666] transition-colors hover:text-[#D4AF37]"
                            >
                              Xóa
                            </button>
                          </div>

                          {/* Variant Controls */}
                          <VariantControls
                            size={item.size}
                            color={item.color}
                            variantOptions={variantsByProduct[item.productId] ?? []}
                            onSizeChange={(value) => handleVariantChange(item, { size: value })}
                            onColorChange={(value) => handleVariantChange(item, { color: value })}
                          />

                          {/* Stock Status */}
                          <span
                            className={`text-[10px] uppercase tracking-[0.2em] ${
                              item.stockStatus === "in" ? "text-[#10B981]" : "text-[#F97316]"
                            }`}
                          >
                            {item.stockStatus === "in" ? "Còn hàng" : "Sắp hết"}
                          </span>

                          <div className="mt-auto flex items-center justify-between">
                            {/* Quantity Selector */}
                            <div className="flex items-center rounded-full border border-gray-300 bg-white">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, -1)}
                                className="p-2 hover:bg-[#F5F5F5] transition-colors"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="px-4 text-sm font-medium">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, 1)}
                                className="p-2 hover:bg-[#F5F5F5] transition-colors"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>

                            {/* Line price */}
                            <p className="font-['Playfair_Display'] text-[18px] font-semibold text-[#111827]">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      {index < cartItems.length - 1 && (
                        <div className="mt-6 h-px bg-[#E5E7EB]" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-black/10 bg-[#F5F5F5] px-8 py-6">
                {/* Subtotal */}
                <div className="mb-6 border-b border-[#D4AF37]/20 pb-6">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.24em] text-[#6B7280]">
                      Tạm tính
                    </span>
                    <span
                      style={{
                        fontSize: '20px',
                        fontWeight: 600,
                        fontFamily: "'Playfair Display', serif"
                      }}
                    >
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  <p className="text-xs text-[#666666]">
                    Thuế và phí vận chuyển được tính tại thanh toán
                  </p>
                </div>

                {/* Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    className="rounded-full border-2 border-[#D4AF37] py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37] transition-colors hover:bg-[#D4AF37] hover:text-black"
                    onClick={handleViewCart}
                  >
                    Xem giỏ
                  </Button>
                  <Button
                    onClick={handleCheckout}
                    className="rounded-full bg-[#D4AF37] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-[#B6911F]"
                  >
                    Thanh toán
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                  <p className="text-xs text-[#666666]">
                    Miễn phí vận chuyển cho đơn hàng trên 2.000.000₫
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// VariantControls Component
interface VariantControlsProps {
  size: string;
  color: string;
  variantOptions: VariantOption[];
  onSizeChange: (value: string) => void;
  onColorChange: (value: string) => void;
}

const VariantControls = ({
  size,
  color,
  variantOptions,
  onSizeChange,
  onColorChange,
}: VariantControlsProps) => {
  const colors = Array.from(new Set(variantOptions.map((variant) => variant.color)));
  const sizes = Array.from(new Set(variantOptions.map((variant) => variant.size)));
  const colorOptions = colors.length > 0 ? colors : [color];
  const sizeOptions = sizes.length > 0 ? sizes : [size];

  const sizeStates = sizeOptions.map((option) => {
    const isAvailable = variantOptions.some(
      (variant) =>
        variant.size === option &&
        (variant.stockQuantity > 0 || option === size) &&
        (color ? variant.color === color : true)
    );
    return { value: option, isAvailable };
  });

  return (
    <div className="mb-2 space-y-2">
      {/* Color Selector */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#9CA3AF]">
          <span>Màu sắc</span>
          <span className="text-[#111827] normal-case tracking-normal text-xs">{color}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((option) => {
            const isActive = option === color;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onColorChange(option)}
                disabled={colorOptions.length <= 1}
                className={`relative h-6 w-6 rounded-full border-2 transition-all duration-200 ${
                  isActive ? "border-[#D4AF37] scale-110" : "border-transparent hover:border-[#D4AF37]"
                } ${colorOptions.length <= 1 ? "cursor-not-allowed opacity-60" : ""}`}
                style={{ backgroundColor: getColorHex(option) }}
                title={option}
                aria-label={option}
              >
                {isActive && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check className="h-3 w-3 text-white drop-shadow" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Size Selector */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#9CA3AF]">
          <span>Kích cỡ</span>
          <span className="text-[#111827] normal-case tracking-normal text-xs">{size}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {sizeStates.map(({ value, isAvailable }) => {
            const isActive = value === size;
            return (
              <button
                key={value}
                type="button"
                onClick={() => isAvailable && onSizeChange(value)}
                disabled={!isAvailable || sizeOptions.length <= 1}
                className={`h-7 min-w-[36px] rounded-lg border text-[10px] font-semibold uppercase tracking-[0.15em] transition-all ${
                  !isAvailable
                    ? "border-[#E5E7EB] bg-[#F9FAFB] text-[#9CA3AF] line-through cursor-not-allowed"
                    : isActive
                    ? "border-[#111827] bg-[#111827] text-white shadow-sm"
                    : "border-[#D1D5DB] bg-white text-[#111827] hover:border-[#D4AF37]"
                } ${sizeOptions.length <= 1 ? "cursor-not-allowed opacity-60" : ""}`}
              >
                {value}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
