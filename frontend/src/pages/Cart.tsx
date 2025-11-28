import MainLayout from "@/layout/MainLayout";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Check,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { useMemo, useState } from "react";

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

const INITIAL_ITEMS: CartItem[] = [
  {
    id: "lux-suit-01",
    brand: "ARISTINO",
    name: "Italian Wool Suit",
    size: "L",
    color: "Navy Blue",
    stockStatus: "in",
    price: 489,
    originalPrice: 599,
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=420&q=80",
    quantity: 1,
  },
  {
    id: "lux-coat-02",
    brand: "ARISTINO",
    name: "Cashmere Overcoat",
    size: "L",
    color: "Charcoal",
    stockStatus: "low",
    price: 579,
    image:
      "https://images.unsplash.com/photo-1490111718993-d98654ce6cf7?auto=format&fit=crop&w=420&q=80",
    quantity: 1,
  },
  {
    id: "lux-shoes-03",
    brand: "ARISTINO",
    name: "Handcrafted Leather Shoes",
    size: "42 EU",
    color: "Espresso",
    stockStatus: "in",
    price: 399,
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=420&q=80",
    quantity: 1,
  },
];

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
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [promoState, setPromoState] = useState<"success" | "error" | null>(
    null,
  );
  const [isPromoExpanded, setIsPromoExpanded] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items],
  );
  const discount = appliedPromo ? PROMO.amount : 0;
  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const tax = subtotal === 0 ? 0 : Math.round(subtotal * TAX_RATE);
  const total = Math.max(subtotal + shipping + tax - discount, 0);
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleQuantityChange = (id: string, delta: 1 | -1) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextQuantity = Math.max(item.quantity + delta, 1);
        return { ...item, quantity: nextQuantity };
      }),
    );
  };

  const handleSizeChange = (id: string, size: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, size } : item)),
    );
  };

  const handleColorChange = (id: string, color: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, color } : item)),
    );
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
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
                  <h1 className="font-['Playfair_Display'] text-[54px] leading-none text-[#000000]">
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

              <PromoCodeToggle
                className="mt-12"
                isExpanded={isPromoExpanded}
                onToggle={() => setIsPromoExpanded((prev) => !prev)}
                promoCode={promoCode}
                status={promoState}
                isApplied={appliedPromo}
                onChange={setPromoCode}
                onApply={handleApplyPromo}
              />
            </div>

            <OrderSummaryCard
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              discount={discount}
              total={total}
            />
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
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onSizeChange: (value: string) => void;
  onColorChange: (value: string) => void;
};

const CartItemCard = ({
  item,
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
          <p className="font-['Playfair_Display'] text-2xl text-[#333333]">
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
  onIncrease,
  onDecrease,
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) => (
  <div className="flex items-center gap-4 text-sm text-[#333333]">
    <button
      type="button"
      aria-label="Decrease quantity"
      disabled={quantity === 1}
      onClick={onDecrease}
      className="text-lg transition hover:text-[#000000] disabled:cursor-not-allowed disabled:opacity-30"
    >
      <Minus className="h-4 w-4" />
    </button>
    <span aria-label="Current quantity" className="text-base font-semibold">
      {quantity}
    </span>
    <button
      type="button"
      aria-label="Increase quantity"
      onClick={onIncrease}
      className="text-lg transition hover:text-[#000000]"
    >
      <Plus className="h-4 w-4" />
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
    <p className="text-lg font-semibold text-[#000000]">
      {formatCurrency(item.price * item.quantity)}
    </p>
    {item.originalPrice ? (
      <p className="text-sm text-[#999999] line-through">
        {formatCurrency(item.originalPrice)}
      </p>
    ) : null}
  </div>
);

const EmptyCartState = () => (
  <div className="flex flex-col items-center rounded-2xl border border-[#E5E7EB] bg-white px-8 py-16 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E5E7EB]/40 text-[#9CA3AF]">
      <ShoppingBag className="h-10 w-10" />
    </div>
    <p className="mt-6 text-xl text-[#6B7280]">Your cart is empty</p>
    <button
      type="button"
      className="mt-6 rounded-full bg-[#D4AF37] px-8 py-3 text-sm font-semibold uppercase text-black transition hover:bg-[#B6911F]"
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
      className="text-sm font-semibold text-[#333333] underline underline-offset-4 transition hover:text-[#000000]"
    >
      Do you have a promo code?
    </button>
    <div
      className={`overflow-hidden transition-all duration-300 ${
        isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      {isExpanded && (
        <div className="mt-4 border border-[#E5E5E5] p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              value={promoCode}
              onChange={(event) => onChange(event.target.value)}
              placeholder="Enter code"
              className="h-11 flex-1 border-b border-[#E5E5E5] bg-transparent px-1 text-sm text-[#333333] focus:border-[#C2A26F] focus:outline-none"
            />
            <button
              type="button"
              onClick={onApply}
              className="h-11 px-8 text-xs font-bold uppercase tracking-[0.3em] text-[#000000] transition"
              style={{ backgroundColor: "#C2A26F" }}
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
  tax,
  discount,
  total,
}: {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
}) => (
  <aside className="h-fit space-y-6 lg:sticky lg:top-5">
    <p className="text-xs uppercase tracking-[0.3em] text-[#999999]">
      Order Summary
    </p>
    <div className="space-y-4">
      <SummaryRow label="Subtotal" value={formatCurrency(subtotal)} />
      <SummaryRow
        label="Shipping"
        value={
          shipping === 0 && subtotal > 0 ? "Free" : formatCurrency(shipping)
        }
      />
      <SummaryRow label="Tax (estimated)" value={formatCurrency(tax)} />
      {discount > 0 && (
        <SummaryRow
          label="Discount"
          value={`-${formatCurrency(discount)}`}
          valueClass="text-[#10B981]"
        />
      )}
    </div>
    <div className="border-t-2 border-[#000000] pt-6">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.3em] text-[#999999]">
          Total
        </span>
        <div className="text-right">
          <p className="font-['Playfair_Display'] text-4xl text-[#000000]">
            {formatCurrency(total)}
          </p>
          <p className="text-xs text-[#999999]">USD</p>
        </div>
      </div>
    </div>
    <button
      type="button"
      className="mt-2 flex h-[55px] w-full items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-[#000000] transition hover:bg-[#D4B885]"
      style={{ backgroundColor: "#C2A26F" }}
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
  <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-[#999999]">
    <span>{label}</span>
    <span className={`text-[#333333] ${valueClass}`}>{value}</span>
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

