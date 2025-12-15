import MainLayout from "@/layout/MainLayout";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Check,
  Minus,
  Plus,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { ProductsCarousel } from "@/components/Cart/ProductsCarousel";
import { ViewedProductsCarousel } from "@/components/Cart/ViewedProductsCarousel";
import { getCart, updateCartItem, removeCartItem } from "@/lib/api";
import type { CartItem as ApiCartItem, CartResponse } from "@/types/cart";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";

type CartItem = {
  id: string;
  brand: string;
  name: string;
  size: string;
  color: string;
  stockStatus: "in" | "low";
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  cartItemId: number;
};

type RecommendedProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
};

const TAX_RATE = 0.1;
const SHIPPING_FEE = 15;
const FREE_SHIPPING_THRESHOLD = 200;
const PROMO = { code: "LUXE50", label: "Code applied! -$50", amount: 50 };
const SIZE_OPTIONS = ["S", "M", "L", "XL"];
const COLOR_OPTIONS = [
  { label: "Navy Blue", value: "Navy Blue", swatch: "#1A365D" },
  { label: "Charcoal", value: "Charcoal", swatch: "#2F2F2F" },
  { label: "Espresso", value: "Espresso", swatch: "#4B2E2B" },
  { label: "Ivory", value: "Ivory", swatch: "#F4F1DE", border: "#E5E7EB" },
];

const mapApiCartItemToCartItem = (apiItem: ApiCartItem): CartItem => {
  return {
    id: `cart-item-${apiItem.cart_item_id}`,
    cartItemId: apiItem.cart_item_id,
    brand: "ARISTINO",
    name: apiItem.product_name,
    size: apiItem.size || "N/A",
    color: apiItem.color || "N/A",
    stockStatus: apiItem.stock_quantity > 5 ? "in" : "low",
    price: apiItem.unit_price,
    originalPrice: undefined,
    image: apiItem.image_url || "https://via.placeholder.com/420",
    quantity: apiItem.quantity,
  };
};

const RECOMMENDED: RecommendedProduct[] = [
  {
    id: "rec-01",
    name: "Tailored Silk Shirt",
    price: 189,
    image:
      "https://images.unsplash.com/photo-1490337457136-328fj87583f9?auto=format&fit=crop&w=360&q=80",
  },
  {
    id: "rec-02",
    name: "Italian Leather Belt",
    price: 129,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=360&q=80",
  },
  {
    id: "rec-03",
    name: "Suede Chelsea Boots",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=360&q=80",
  },
];

const PAYMENT_LOGOS = ["Visa", "Mastercard", "Amex", "PayPal"];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [promoState, setPromoState] = useState<"success" | "error" | null>(
    null,
  );
  const [isPromoExpanded, setIsPromoExpanded] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated()) {
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const cart = await getCart();
        setCartData(cart);
        setItems(cart.items.map(mapApiCartItemToCartItem));
        if (cart.applied_promotion_code) {
          setAppliedPromo(true);
          setPromoCode(cart.applied_promotion_code);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load cart";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  const subtotal = useMemo(
    () => cartData?.subtotal_amount || 0,
    [cartData],
  );
  const discount = useMemo(
    () => (appliedPromo ? cartData?.discount_amount || 0 : 0),
    [appliedPromo, cartData],
  );
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = Math.max(subtotal + shipping - discount, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleQuantityChange = async (id: string, delta: 1 | -1) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const nextQuantity = Math.max(item.quantity + delta, 1);
    if (nextQuantity === item.quantity) return;

    try {
      setUpdatingItems((prev) => new Set(prev).add(item.cartItemId));
      await updateCartItem(item.cartItemId, nextQuantity);
      
      // Refresh cart data
      const cart = await getCart();
      setCartData(cart);
      setItems(cart.items.map(mapApiCartItemToCartItem));
      toast.success("Cart updated successfully");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update quantity";
      toast.error(errorMessage);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.cartItemId);
        return newSet;
      });
    }
  };

  const handleSizeChange = (id: string, size: string) => {
    // Note: Changing size/color would require changing the variant, which is a more complex operation
    // For now, we'll just update the display but show a message
    toast.info("To change size or color, please remove this item and add the desired variant");
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, size } : item)),
    );
  };

  const handleColorChange = (id: string, color: string) => {
    // Note: Changing size/color would require changing the variant, which is a more complex operation
    // For now, we'll just update the display but show a message
    toast.info("To change size or color, please remove this item and add the desired variant");
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, color } : item)),
    );
  };

  const handleRemoveItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    try {
      setUpdatingItems((prev) => new Set(prev).add(item.cartItemId));
      await removeCartItem(item.cartItemId);
      
      // Refresh cart data
      const cart = await getCart();
      setCartData(cart);
      setItems(cart.items.map(mapApiCartItemToCartItem));
      toast.success("Item removed from cart");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to remove item";
      toast.error(errorMessage);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(item.cartItemId);
        return newSet;
      });
    }
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      setPromoState("error");
      setAppliedPromo(false);
      return;
    }

    if (promoCode.trim().toUpperCase() === PROMO.code) {
      setAppliedPromo(true);
      setPromoState("success");
      return;
    }

    setAppliedPromo(false);
    setPromoState("error");
  };

  if (isLoading) {
    return (
      <MainLayout>
        <section className="bg-white">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-black" />
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  if (error && items.length === 0) {
    return (
      <MainLayout>
        <section className="bg-white">
          <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
              <p className="text-lg text-[#6B7280] mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-md bg-black px-6 py-3 font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
              >
                Retry
              </button>
            </div>
          </div>
        </section>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[minmax(0,780px)_360px]">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="text-xs uppercase tracking-[0.3em] text-[#999999]"
              >
                Home <span className="mx-1">/</span> Shopping Bag
              </nav>
              <header className="mt-8 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#999999]">
                    Aristino
                  </p>
                  <h1 className="text-4xl font-bold leading-none text-black sm:text-5xl">
                    Shopping Bag
                  </h1>
                </div>
                <p className="text-sm text-[#999999]">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>
              </header>
              <div className="mt-10 h-px w-full bg-[#E5E5E5]" />

              <div className="mt-10 divide-y divide-[#E5E5E5]">
                {items.length > 0 ? (
                  items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      isUpdating={updatingItems.has(item.cartItemId)}
                      onDecrease={() => handleQuantityChange(item.id, -1)}
                      onIncrease={() => handleQuantityChange(item.id, 1)}
                      onRemove={() => handleRemoveItem(item.id)}
                      onSizeChange={(value) => handleSizeChange(item.id, value)}
                      onColorChange={(value) =>
                        handleColorChange(item.id, value)
                      }
                    />
                  ))
                ) : (
                  <EmptyCartState />
                )}
              </div>
            </div>

            <OrderSummaryCard
              subtotal={subtotal}
              shipping={shipping}
              discount={discount}
              total={total}
              promoCode={promoCode}
              promoState={promoState}
              appliedPromo={appliedPromo}
              isPromoExpanded={isPromoExpanded}
              onPromoCodeChange={setPromoCode}
              onApplyPromo={handleApplyPromo}
              onTogglePromo={() => setIsPromoExpanded((prev) => !prev)}
            />
          </div>

          {/* Product Carousels */}
          <div className="mt-20 space-y-16">
            <ProductsCarousel 
              title="Other Products" 
              filters={{ sort: "newest" }}
            />
            <ViewedProductsCarousel title="Recently Viewed" />
          </div>
        </div>
        <SiteFooter />
      </section>
    </MainLayout>
  );
}

const stockStyles = {
  in: "text-[#10B981]",
  low: "text-[#F97316]",
};

type CartItemCardProps = {
  item: CartItem;
  isUpdating?: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onSizeChange: (value: string) => void;
  onColorChange: (value: string) => void;
};

const CartItemCard = ({
  item,
  isUpdating = false,
  onIncrease,
  onDecrease,
  onRemove,
  onSizeChange,
  onColorChange,
}: CartItemCardProps) => (
  <article className="grid grid-cols-[120px_minmax(0,1fr)] gap-8 py-10">
    <div className="group overflow-hidden">
      <img
        src={item.image}
        alt={item.name}
        className="h-[180px] w-full object-cover transition duration-300 group-hover:scale-105"
      />
    </div>
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#999999]">
            {item.brand}
          </p>
          <p className="text-2xl font-bold text-black">
            {item.name}
          </p>
        </div>
        <button
          type="button"
          aria-label={`Remove ${item.name}`}
          onClick={onRemove}
          className="text-[11px] uppercase tracking-[0.3em] text-[#999999] underline underline-offset-4 transition hover:text-[#000000]"
        >
          Remove
        </button>
      </div>
      <div className="space-y-3">
        <p className="text-xs text-[#999999]">
          Color: {item.color} / Size: {item.size}
        </p>
        <VariantControls
          size={item.size}
          color={item.color}
          onSizeChange={onSizeChange}
          onColorChange={onColorChange}
        />
        <span
          className={`text-[11px] uppercase tracking-[0.3em] ${stockStyles[item.stockStatus]}`}
        >
          {item.stockStatus === "in" ? "In Stock" : "Low Stock"}
        </span>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-6">
        <QuantityControl
          quantity={item.quantity}
          isUpdating={isUpdating}
          onIncrease={onIncrease}
          onDecrease={onDecrease}
        />
        <PriceStack item={item} />
      </div>
    </div>
  </article>
);

const QuantityControl = ({
  quantity,
  isUpdating = false,
  onIncrease,
  onDecrease,
}: {
  quantity: number;
  isUpdating?: boolean;
  onIncrease: () => void;
  onDecrease: () => void;
}) => (
  <div className="flex items-center gap-4 text-sm text-[#333333]">
    <button
      type="button"
      aria-label="Decrease quantity"
      disabled={quantity === 1 || isUpdating}
      onClick={onDecrease}
      className="text-lg transition hover:text-[#000000] disabled:cursor-not-allowed disabled:opacity-30"
    >
      {isUpdating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Minus className="h-4 w-4" />
      )}
    </button>
    <span aria-label="Current quantity" className="text-base font-semibold">
      {quantity}
    </span>
    <button
      type="button"
      aria-label="Increase quantity"
      disabled={isUpdating}
      onClick={onIncrease}
      className="text-lg transition hover:text-[#000000] disabled:cursor-not-allowed disabled:opacity-30"
    >
      {isUpdating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
    </button>
  </div>
);

const VariantControls = ({
  size,
  color,
  onSizeChange,
  onColorChange,
}: {
  size: string;
  color: string;
  onSizeChange: (value: string) => void;
  onColorChange: (value: string) => void;
}) => (
  <div className="mt-2 flex flex-wrap gap-4 text-xs text-[#999999]">
    <label className="flex items-center gap-2">
      <span>Size</span>
      <select
        value={size}
        onChange={(event) => onSizeChange(event.target.value)}
        className="border-b border-[#E5E5E5] bg-transparent px-1 py-0.5 text-[#333333] focus:border-[#C2A26F] focus:outline-none"
      >
        {SIZE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
    <div className="flex items-center gap-2">
      <span>Color</span>
      <div className="flex items-center gap-2">
        {COLOR_OPTIONS.map((option) => {
          const isSelected = option.value === color;
          return (
            <button
              key={option.value}
              type="button"
              aria-label={option.label}
              aria-pressed={isSelected}
              onClick={() => onColorChange(option.value)}
              className={`relative flex h-7 w-7 items-center justify-center rounded-full border border-[#E5E5E5] transition ${
                isSelected ? "border-[#C2A26F]" : "border-[#E5E5E5]"
              }`}
            >
              <span
                className="h-5 w-5 rounded-full"
                style={{
                  backgroundColor: option.swatch,
                  border: option.border ? `1px solid ${option.border}` : "none",
                }}
              />
              {isSelected && (
                <Check className="absolute h-3 w-3 text-white drop-shadow" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

const PriceStack = ({
  item,
}: {
  item: CartItem;
}) => (
  <div className="text-right">
    <p className="text-lg font-bold text-black">
      {formatCurrency(item.price * item.quantity)}
    </p>
    {item.originalPrice ? (
      <p className="text-sm text-[#999999] line-through">
        {formatCurrency(item.originalPrice)}
      </p>
    ) : null}
  </div>
);

const EmptyCartState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center rounded-2xl border border-[#E5E7EB] bg-white px-8 py-16 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E5E7EB]/40 text-[#9CA3AF]">
        <ShoppingBag className="h-10 w-10" />
      </div>
      <p className="mt-6 text-xl text-[#6B7280]">Your cart is empty</p>
      <button
        type="button"
        onClick={() => navigate("/collections")}
        className="mt-6 rounded-md bg-black px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
      >
        Continue Shopping
      </button>
      <div className="mt-8 w-full">
        <p className="text-sm font-medium text-[#1A1A1A]">Recommended for you</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {RECOMMENDED.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-[#E5E7EB] bg-white/60 p-3 text-left"
            >
              <img
                src={product.image}
                alt={product.name}
                className="h-32 w-full rounded-lg object-cover"
              />
              <p className="mt-3 text-sm font-medium text-[#1A1A1A]">
                {product.name}
              </p>
              <p className="text-sm text-[#6B7280]">
                {formatCurrency(product.price)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PromoCodeToggle = ({
  promoCode,
  status,
  isApplied,
  onChange,
  onApply,
  className = "",
  isExpanded,
  onToggle,
}: {
  promoCode: string;
  status: "success" | "error" | null;
  isApplied: boolean;
  onChange: (value: string) => void;
  onApply: () => void;
  className?: string;
  isExpanded: boolean;
  onToggle: () => void;
}) => (
  <div className={className}>
    <button
      type="button"
      onClick={onToggle}
      className="text-xs font-medium text-[#333333] underline underline-offset-4 transition hover:text-[#000000]"
    >
      Do you have a promo code?
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${
        isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      {isExpanded && (
        <div className="mt-3 border border-[#E5E5E5] p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <input
              value={promoCode}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Enter code"
              className="h-9 flex-1 border-b border-[#E5E5E5] bg-transparent px-1 text-xs text-[#333333] focus:border-[#D4AF37] focus:outline-none"
            />
            <button
              type="button"
              onClick={onApply}
              className="h-9 rounded-md bg-gray-800 px-4 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-gray-900"
            >
              Apply
            </button>
          </div>
          {status === "success" && isApplied && (
            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-[#065F46]">
              <CheckCircle2 className="h-4 w-4" />
              {PROMO.label}
            </div>
          )}
          {status === "error" && (
            <div className="mt-2 flex items-center gap-2 text-xs text-[#DC2626]">
              <AlertCircle className="h-4 w-4" />
              Invalid code
            </div>
          )}
        </div>
      )}
    </div>
  </div>
);

const OrderSummaryCard = ({
  subtotal,
  shipping,
  discount,
  total,
  promoCode,
  promoState,
  appliedPromo,
  isPromoExpanded,
  onPromoCodeChange,
  onApplyPromo,
  onTogglePromo,
}: {
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  promoCode: string;
  promoState: "success" | "error" | null;
  appliedPromo: boolean;
  isPromoExpanded: boolean;
  onPromoCodeChange: (value: string) => void;
  onApplyPromo: () => void;
  onTogglePromo: () => void;
}) => (
  <aside className="h-fit space-y-6 rounded-lg border border-gray-200 bg-gray-50 p-6 lg:sticky lg:top-5">
    <h2 className="text-xl font-bold text-black">
      Order Summary
    </h2>
    <div className="space-y-4">
      <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
      <SummaryRow
        label="Shipping"
        value={
          shipping === 0 && subtotal > 0 ? "Free" : formatCurrency(shipping)
        }
      />
      {discount > 0 && (
        <SummaryRow
          label="Discount"
          value={`-${formatCurrency(discount)}`}
          valueClass="text-[#10B981]"
        />
      )}
    </div>

    <PromoCodeToggle
      promoCode={promoCode}
      status={promoState}
      isApplied={appliedPromo}
      onChange={onPromoCodeChange}
      onApply={onApplyPromo}
      isExpanded={isPromoExpanded}
      onToggle={onTogglePromo}
    />
    <div className="space-y-3 border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-black">
          Tổng cộng
        </span>
        <div className="text-right">
          <p className="text-xl font-bold text-black">
            {formatCurrency(total)}
          </p>
          <p className="mt-1 text-xs text-gray-500">(Đã bao gồm VAT)</p>
        </div>
      </div>
    </div>
    <button
      type="button"
      onClick={() => navigate("/checkout")}
      className="mt-2 flex h-[55px] w-full items-center justify-center gap-2 rounded-md bg-black text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
    >
      Proceed to Checkout
      <ArrowRight className="h-4 w-4" />
    </button>
    <div className="flex flex-wrap items-center gap-3 text-xs text-[#999999]">
      {PAYMENT_LOGOS.map((logo) => (
        <div key={logo} className="px-3 py-2">
          {logo}
        </div>
      ))}
    </div>
  </aside>
);

const SummaryRow = ({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: string;
  valueClass?: string;
}) => (
  <div className="flex items-center justify-between text-sm">
    <span className="text-gray-600">{label}</span>
    <span className={`font-medium text-black ${valueClass}`}>{value}</span>
  </div>
);

const SiteFooter = () => (
  <footer className="mt-20 bg-[#000000] py-16 text-center text-[#999999]">
    <div className="mx-auto max-w-[1200px] px-4">
      <p className="text-sm uppercase tracking-[0.4em] text-white">
        Aristino
      </p>
      <p className="mt-4 text-xs">
        © {new Date().getFullYear()} Aristino. All rights reserved.
      </p>
    </div>
  </footer>
);

