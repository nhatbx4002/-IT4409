import MainLayout from "@/layout/MainLayout";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
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

const INITIAL_ITEMS: CartItem[] = [
  {
    id: "lux-suit-01",
    brand: "ARISTINO",
    name: "Vest len Ý sang trọng",
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
    name: "Áo khoác Cashmere",
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
    name: "Giày da thủ công",
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
    name: "Áo sơ mi lụa cao cấp",
    price: 189,
    image:
      "https://images.unsplash.com/photo-1490337457136-328fj87583f9?auto=format&fit=crop&w=360&q=80",
  },
  {
    id: "rec-02",
    name: "Thắt lưng da Ý",
    price: 129,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=360&q=80",
  },
  {
    id: "rec-03",
    name: "Boot Chelsea da lộn",
    price: 349,
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=360&q=80",
  },
];

const FEATURE_LIST = [
  { icon: "🚚", copy: "Miễn phí vận chuyển cho đơn từ $200" },
  { icon: "🔒", copy: "Thanh toán an toàn tuyệt đối" },
  { icon: "↩️", copy: "Đổi trả dễ dàng trong 30 ngày" },
];

const PAYMENT_LOGOS = ["Visa", "Mastercard", "Amex", "PayPal"];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [promoState, setPromoState] = useState<"success" | "error" | null>(
    null,
  );

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
      <section className="bg-gradient-to-b from-[#F8F9FA] to-[#F5F6F7]">
        <div className="mx-auto max-w-[1200px] px-6 py-20 sm:px-8 lg:px-0">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,840px)_360px]">
            <div>
              <nav aria-label="Breadcrumb" className="text-sm text-[#9CA3AF]">
                Trang chủ <span className="mx-1">{">"}</span> Giỏ hàng
              </nav>
              <header className="mt-4">
                <h1 className="font-['Playfair_Display'] text-4xl font-bold text-[#1A1A1A]">
                  Giỏ hàng
                </h1>
                <p className="mt-2 text-sm text-[#6B7280]">
                  {itemCount} {itemCount === 1 ? "sản phẩm" : "sản phẩm"}
                </p>
              </header>
              <div className="mt-6 h-px w-full bg-[#E5E7EB]" />

              <div className="mt-6 space-y-4">
                {items.length > 0 ? (
                  items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onDecrease={() => handleQuantityChange(item.id, -1)}
                      onIncrease={() => handleQuantityChange(item.id, 1)}
                      onRemove={() => handleRemoveItem(item.id)}
                    />
                  ))
                ) : (
                  <EmptyCartState />
                )}
              </div>

              <PromoCodeCard
                className="mt-8"
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
      </section>
    </MainLayout>
  );
}

const stockStyles = {
  in: "text-[#10B981] bg-[#ECFDF5]",
  low: "text-[#F97316] bg-[#FFF7ED]",
};

type CartItemCardProps = {
  item: CartItem;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

const CartItemCard = ({
  item,
  onIncrease,
  onDecrease,
  onRemove,
}: CartItemCardProps) => (
  <article className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.06)] sm:flex-row sm:p-6">
    <img
      src={item.image}
      alt={item.name}
      className="h-[150px] w-[120px] rounded-xl object-cover"
    />
    <div className="flex flex-1 flex-col gap-3">
      <div>
        <p className="text-xs tracking-[0.2em] text-[#D4AF37]">{item.brand}</p>
        <p className="font-semibold text-lg text-[#111827]">{item.name}</p>
        <p className="text-sm text-[#6B7280]">
          Kích cỡ: {item.size} • Màu sắc: {item.color}
        </p>
      </div>
      <span
        className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${stockStyles[item.stockStatus]}`}
      >
        {item.stockStatus === "in" ? "Còn hàng" : "Sắp hết"}
      </span>
    </div>
    <div className="flex flex-col justify-between gap-4 sm:items-center">
      <QuantityControl
        quantity={item.quantity}
        onIncrease={onIncrease}
        onDecrease={onDecrease}
      />
      <PriceStack item={item} onRemove={onRemove} />
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
  <div className="flex items-center gap-2">
    <button
      type="button"
      aria-label="Giảm số lượng"
      disabled={quantity === 1}
      onClick={onDecrease}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D1D5DB] text-sm text-[#111827] transition hover:border-[#B6BBC6] disabled:cursor-not-allowed disabled:opacity-40"
    >
      <Minus className="h-4 w-4" />
    </button>
    <input
      readOnly
      value={quantity}
      aria-label="Số lượng hiện tại"
      className="h-9 w-12 rounded-lg border border-[#D1D5DB] text-center text-sm font-medium text-[#111827]"
    />
    <button
      type="button"
      aria-label="Tăng số lượng"
      onClick={onIncrease}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D1D5DB] text-sm text-[#111827] transition hover:border-[#B6BBC6]"
    >
      <Plus className="h-4 w-4" />
    </button>
  </div>
);

const PriceStack = ({
  item,
  onRemove,
}: {
  item: CartItem;
  onRemove: () => void;
}) => (
  <div className="min-w-[120px] text-right">
    <p className="text-lg font-semibold text-[#1A1A1A]">
      {formatCurrency(item.price * item.quantity)}
    </p>
    {item.originalPrice ? (
      <p className="text-sm text-[#9CA3AF] line-through">
        {formatCurrency(item.originalPrice)}
      </p>
    ) : null}
    <button
      type="button"
      aria-label={`Xóa ${item.name}`}
      onClick={onRemove}
      className="mt-2 inline-flex items-center justify-end text-sm text-[#9CA3AF] transition hover:text-[#DC2626]"
    >
      <Trash2 className="mr-1 h-4 w-4" />
      Xóa
    </button>
  </div>
);

const EmptyCartState = () => (
  <div className="flex flex-col items-center rounded-2xl bg-white px-8 py-16 text-center shadow-[0_2px_8px_rgba(0,0,0,0.06)]">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#E5E7EB]/40 text-[#9CA3AF]">
      <ShoppingBag className="h-10 w-10" />
    </div>
    <p className="mt-6 text-xl text-[#6B7280]">Giỏ hàng của bạn đang trống</p>
    <button
      type="button"
      className="mt-6 rounded-full bg-[#D4AF37] px-8 py-3 text-sm font-semibold uppercase text-black transition hover:bg-[#B6911F]"
    >
      Tiếp tục mua sắm
    </button>
    <div className="mt-8 w-full">
      <p className="text-sm font-medium text-[#1A1A1A]">Gợi ý cho bạn</p>
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

const PromoCodeCard = ({
  promoCode,
  status,
  isApplied,
  onChange,
  onApply,
  className = "",
}: {
  promoCode: string;
  status: "success" | "error" | null;
  isApplied: boolean;
  onChange: (value: string) => void;
  onApply: () => void;
  className?: string;
}) => (
  <div
    className={`rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${className}`}
  >
    <p className="text-base font-semibold text-[#1A1A1A]">Mã khuyến mãi</p>
    <p className="text-sm text-[#6B7280]">
      Nhập mã thành viên để nhận ưu đãi đặc biệt.
    </p>
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:gap-0">
      <input
        value={promoCode}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Nhập mã khuyến mãi"
        className="h-[52px] flex-1 rounded-full border border-[#D1D5DB] px-5 text-sm text-[#111827] focus:border-[#D4AF37] focus:outline-none sm:rounded-r-none sm:border-r-0"
      />
      <button
        type="button"
        onClick={onApply}
        className="flex h-[52px] items-center justify-center rounded-full bg-[#D4AF37] px-8 text-sm font-semibold uppercase tracking-wide text-black transition hover:-translate-y-0.5 hover:bg-[#B6911F] sm:rounded-l-none sm:border-l sm:border-l-white"
      >
        Áp dụng
      </button>
    </div>
    {status === "success" && isApplied && (
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#D1FAE5] px-4 py-3 text-sm font-medium text-[#065F46]">
        <CheckCircle2 className="h-5 w-5" />
        {PROMO.label}
      </div>
    )}
    {status === "error" && (
      <div className="mt-3 flex items-center gap-2 text-sm text-[#DC2626]">
        <AlertCircle className="h-4 w-4" />
        Mã không hợp lệ
      </div>
    )}
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
  <aside className="h-fit rounded-2xl bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.06)] lg:sticky lg:top-28">
    <div>
      <p className="text-lg font-semibold text-[#1A1A1A]">Tóm tắt đơn hàng</p>
      <div className="my-4 h-px bg-[#E5E7EB]" />
    </div>
    <div className="space-y-3 text-sm">
      <SummaryRow label="Tạm tính" value={formatCurrency(subtotal)} />
      <SummaryRow
        label="Phí vận chuyển"
        value={
          shipping === 0 && subtotal > 0 ? "Miễn phí" : formatCurrency(shipping)
        }
      />
      <SummaryRow label="Thuế (ước tính)" value={formatCurrency(tax)} />
      {discount > 0 && (
        <SummaryRow
          label="Giảm giá"
          value={`-${formatCurrency(discount)}`}
          valueClass="text-[#10B981]"
        />
      )}
    </div>
    <div className="my-5 h-px bg-[#E5E7EB]" />
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold tracking-[0.2em] text-[#374151]">
        TỔNG CỘNG
      </span>
      <div className="text-right">
        <p className="text-2xl font-bold text-[#1A1A1A]">
          {formatCurrency(total)}
        </p>
        <p className="text-xs text-[#6B7280]">VND</p>
      </div>
    </div>
    <ul className="mt-6 space-y-4">
      {FEATURE_LIST.map((feature) => (
        <li key={feature.copy} className="flex items-center gap-3 text-sm">
          <span className="text-lg">{feature.icon}</span>
          <span className="text-[#4B5563]">{feature.copy}</span>
        </li>
      ))}
    </ul>
    <button
      type="button"
      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#D4AF37] py-4 text-sm font-bold uppercase tracking-wide text-black transition hover:-translate-y-0.5 hover:bg-[#B6911F]"
    >
      Tiến hành thanh toán
      <ArrowRight className="h-4 w-4" />
    </button>
    <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
      {PAYMENT_LOGOS.map((logo) => (
        <div
          key={logo}
          className="flex h-8 items-center justify-center rounded-md border border-[#E5E7EB] px-3 text-xs text-[#6B7280]"
        >
          {logo}
        </div>
      ))}
    </div>
    <button
      type="button"
      className="mt-6 w-full text-center text-sm font-semibold text-[#D4AF37] transition hover:text-[#B6911F]"
    >
      ← Tiếp tục mua sắm
    </button>
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
    <span className="text-[#6B7280]">{label}</span>
    <span className={`font-medium text-[#1F2937] ${valueClass}`}>{value}</span>
  </div>
);

