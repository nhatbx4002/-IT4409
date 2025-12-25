import MainLayout from "@/layout/MainLayout";
import {
  AlertCircle,
  ArrowRight,
  Check,
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Loader2,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { ProductsCarousel } from "@/components/Cart/ProductsCarousel";
import { ViewedProductsCarousel } from "@/components/Cart/ViewedProductsCarousel";
import { getCart, getProductDetail, updateCartItem, removeCartItem } from "@/lib/api";
import type { CartItem as ApiCartItem, CartResponse } from "@/types/cart";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";
import { COLOR_OPTIONS } from "@/data/filter-options";

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
  productId: number;
  productVariantId: number;
  stockQuantity: number;
};

type RecommendedProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type VariantOption = {
  id: number;
  color: string;
  size: string;
  stockQuantity: number;
  price: number;
};

const SHIPPING_FEE = 15000;

const mapApiCartItemToCartItem = (apiItem: ApiCartItem): CartItem => {
  return {
    id: `cart-item-${apiItem.cart_item_id}`,
    cartItemId: apiItem.cart_item_id,
    brand: "ARISTINO",
    name: apiItem.product_name,
    size: apiItem.size || "Không có",
    color: apiItem.color || "Không có",
    stockStatus: apiItem.stock_quantity > 5 ? "in" : "low",
    price: apiItem.unit_price,
    originalPrice: undefined,
    image: apiItem.image_url || "https://via.placeholder.com/420",
    quantity: apiItem.quantity,
    productId: apiItem.product_id,
    productVariantId: apiItem.product_variant_id,
    stockQuantity: apiItem.stock_quantity,
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


const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);

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

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartData, setCartData] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [variantsByProduct, setVariantsByProduct] = useState<Record<number, VariantOption[]>>({});

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
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Không thể tải giỏ hàng";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCart();
  }, [navigate]);

  useEffect(() => {
    const productIds = Array.from(new Set(items.map((item) => item.productId)));
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
  }, [items, variantsByProduct]);

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items],
  );
  const shipping = subtotal > 0 ? SHIPPING_FEE : 0;
  const total = subtotal + shipping;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const refreshCartData = async () => {
    const cart = await getCart();
    setCartData(cart);
    setItems(cart.items.map(mapApiCartItemToCartItem));
  };

  const updateLocalQuantity = (cartItemId: number, quantity: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const handleQuantityChange = async (id: string, delta: 1 | -1) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const previousQuantity = item.quantity;
    const nextQuantity = Math.max(item.quantity + delta, 1);
    if (nextQuantity === item.quantity) return;

    // Optimistic update - instant UI change
    updateLocalQuantity(item.cartItemId, nextQuantity);

    // Background API call
    try {
      const updated = await updateCartItem(item.cartItemId, nextQuantity);
      // Only update if server returned different value (e.g., stock limit)
      if (updated.quantity !== nextQuantity) {
        updateLocalQuantity(item.cartItemId, updated.quantity);
        toast.info(`Chỉ còn ${updated.quantity} sản phẩm`);
      }
    } catch (err) {
      // Revert on error
      updateLocalQuantity(item.cartItemId, previousQuantity);
      const errorMessage = err instanceof Error ? err.message : "Không thể cập nhật số lượng";
      toast.error(errorMessage);
    }
  };

  const handleQuantitySet = async (item: CartItem, nextQuantity: number) => {
    const safeQuantity = Math.max(1, Math.floor(nextQuantity));
    if (!Number.isFinite(safeQuantity) || safeQuantity === item.quantity) {
      return;
    }

    const previousQuantity = item.quantity;

    // Optimistic update - instant UI change
    updateLocalQuantity(item.cartItemId, safeQuantity);

    // Background API call
    try {
      const updated = await updateCartItem(item.cartItemId, safeQuantity);
      // Only update if server returned different value (e.g., stock limit)
      if (updated.quantity !== safeQuantity) {
        updateLocalQuantity(item.cartItemId, updated.quantity);
        toast.info(`Chỉ còn ${updated.quantity} sản phẩm`);
      }
    } catch (err) {
      // Revert on error
      updateLocalQuantity(item.cartItemId, previousQuantity);
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

    // Optimistic update - instant UI change
    setItems((prev) =>
      prev.map((entry) =>
        entry.cartItemId === item.cartItemId
          ? ({ ...entry, ...optimisticUpdate } as CartItem)
          : entry
      )
    );

    // Background API call
    try {
      await updateCartItem(item.cartItemId, {
        productVariantId: targetVariant.id,
        quantity: item.quantity,
      });
    } catch (err) {
      // Revert on error
      setItems((prev) =>
        prev.map((entry) =>
          entry.cartItemId === item.cartItemId ? { ...previousItem } : entry
        )
      );
      const errorMessage = err instanceof Error ? err.message : "Không thể cập nhật phiên bản";
      toast.error(errorMessage);
    }
  };

  const handleRemoveItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    const previousItems = [...items];

    // Optimistic update - remove instantly from UI
    setItems((prev) => prev.filter((i) => i.id !== id));

    // Background API call
    try {
      await removeCartItem(item.cartItemId);
      await refreshCartData();
      toast.success("Đã xóa sản phẩm khỏi giỏ");
    } catch (err) {
      // Revert on error
      setItems(previousItems);
      const errorMessage = err instanceof Error ? err.message : "Không thể xóa sản phẩm";
      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <section className="bg-white">
          <div className="w-full px-4 py-20 sm:px-6 lg:px-10 xl:px-16">
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
          <div className="w-full px-4 py-20 sm:px-6 lg:px-10 xl:px-16">
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle className="h-12 w-12 text-red-600 mb-4" />
              <p className="text-lg text-[#6B7280] mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="rounded-md bg-black px-6 py-3 font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
              >
                Thử lại
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
        <div className="w-full px-4 py-20 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid gap-16 lg:grid-cols-[2fr_1fr]">
            <div>
              <nav
                aria-label="Breadcrumb"
                className="text-xs uppercase tracking-[0.3em] text-[#999999]"
              >
                Trang chủ <span className="mx-1">/</span> Giỏ hàng
              </nav>
              <header className="mt-8 flex items-end justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.4em] text-[#999999]">
                    Aristino
                  </p>
                  <h1 className="text-4xl font-bold leading-none text-black sm:text-5xl">
                    Giỏ hàng
                  </h1>
                </div>
                <p className="text-sm text-[#999999]">
                  {itemCount} {itemCount === 1 ? "sản phẩm" : "sản phẩm"}
                </p>
              </header>
              <div className="mt-10 h-px w-full bg-[#E5E5E5]" />

      <div className="mt-10 divide-y divide-[#E5E5E5]">
        {items.length > 0 ? (
          items.map((item) => (
            <CartItemCard
              key={item.id}
              item={item}
              variantOptions={variantsByProduct[item.productId] ?? []}
              onDecrease={() => handleQuantityChange(item.id, -1)}
              onIncrease={() => handleQuantityChange(item.id, 1)}
              onQuantitySet={(nextQuantity) => handleQuantitySet(item, nextQuantity)}
              onVariantChange={(next) => handleVariantChange(item, next)}
              onRemove={() => handleRemoveItem(item.id)}
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
              total={total}
              navigate={navigate}
            />
          </div>

          {/* Product Carousels */}
          <div className="mt-20 space-y-16">
            <ProductsCarousel 
              title="Sản phẩm khác" 
              filters={{ sort: "newest" }}
            />
            <ViewedProductsCarousel title="Đã xem gần đây" />
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
  variantOptions: VariantOption[];
  onIncrease: () => void;
  onDecrease: () => void;
  onQuantitySet: (quantity: number) => void;
  onVariantChange: (next: { size?: string; color?: string }) => void;
  onRemove: () => void;
};

const CartItemCard = ({
  item,
  variantOptions,
  onIncrease,
  onDecrease,
  onQuantitySet,
  onVariantChange,
  onRemove,
}: CartItemCardProps) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate(`/products/${item.productId}`);
  };

  return (
    <article className="grid grid-cols-[120px_minmax(0,1fr)] gap-8 py-10">
      <div className="group overflow-hidden cursor-pointer" onClick={handleProductClick}>
        <img
          src={item.image}
          alt={item.name}
          className="h-[180px] w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-col gap-6">
        <div className="flex items-start justify-between gap-6">
          <div className="cursor-pointer hover:opacity-70 transition-opacity" onClick={handleProductClick}>
            <p className="text-xs uppercase tracking-[0.3em] text-[#999999]">
              {item.brand}
            </p>
            <p className="text-2xl font-bold text-black">
              {item.name}
            </p>
          </div>
          <button
            type="button"
            aria-label={`Xóa ${item.name}`}
            onClick={onRemove}
            className="text-[11px] uppercase tracking-[0.3em] text-[#999999] underline underline-offset-4 transition hover:text-[#000000]"
          >
            Xóa
          </button>
        </div>
        <div className="space-y-3">
          <VariantControls
            size={item.size}
            color={item.color}
            variantOptions={variantOptions}
            onSizeChange={(value) => onVariantChange({ size: value })}
            onColorChange={(value) => onVariantChange({ color: value })}
          />
          <span
            className={`text-[11px] uppercase tracking-[0.3em] ${stockStyles[item.stockStatus]}`}
          >
            {item.stockStatus === "in" ? "Còn hàng" : "Sắp hết"}
          </span>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-6">
          <QuantityControl
            quantity={item.quantity}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onQuantitySet={onQuantitySet}
          />
          <PriceStack item={item} />
        </div>
      </div>
    </article>
  );
};

const QuantityControl = ({
  quantity,
  onIncrease,
  onDecrease,
  onQuantitySet,
}: {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onQuantitySet: (quantity: number) => void;
}) => {
  const [draftQuantity, setDraftQuantity] = useState(String(quantity));

  useEffect(() => {
    setDraftQuantity(String(quantity));
  }, [quantity]);

  const commitQuantity = () => {
    const parsed = Number.parseInt(draftQuantity, 10);
    if (Number.isNaN(parsed)) {
      setDraftQuantity(String(quantity));
      return;
    }
    onQuantitySet(parsed);
  };

  return (
    <div className="flex items-center gap-3 text-sm text-[#333333]">
      <button
        type="button"
        aria-label="Giảm số lượng"
        disabled={quantity === 1}
        onClick={onDecrease}
        className="text-lg transition hover:text-[#000000] disabled:cursor-not-allowed disabled:opacity-30"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        value={draftQuantity}
        onChange={(event) => setDraftQuantity(event.target.value)}
        onBlur={commitQuantity}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            commitQuantity();
            event.currentTarget.blur();
          }
        }}
        className="h-9 w-16 rounded-md border border-[#E5E5E5] bg-white text-center text-base font-semibold text-black focus:border-[#C2A26F] focus:outline-none"
        aria-label="Số lượng hiện tại"
      />
      <button
        type="button"
        aria-label="Tăng số lượng"
        onClick={onIncrease}
        className="text-lg transition hover:text-[#000000]"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
};

const VariantControls = ({
  size,
  color,
  variantOptions,
  onSizeChange,
  onColorChange,
}: {
  size: string;
  color: string;
  variantOptions: VariantOption[];
  onSizeChange: (value: string) => void;
  onColorChange: (value: string) => void;
}) => {
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
    <div className="mt-2 space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-[#9CA3AF]">
          <span>Màu sắc</span>
          <span className="text-[#111827] normal-case tracking-normal">{color}</span>
        </div>
        <div className="flex flex-wrap gap-3">
          {colorOptions.map((option) => {
            const isActive = option === color;
            return (
              <button
                key={option}
                type="button"
                onClick={() => onColorChange(option)}
                disabled={colorOptions.length <= 1}
                className={`relative h-9 w-9 rounded-full border-2 transition-all duration-200 ${
                  isActive ? "border-[#D4AF37] scale-110" : "border-transparent hover:border-[#D4AF37]"
                } ${colorOptions.length <= 1 ? "cursor-not-allowed opacity-60" : ""}`}
                style={{ backgroundColor: getColorHex(option) }}
                title={option}
                aria-label={option}
              >
                {isActive && (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <Check className="h-4 w-4 text-white drop-shadow" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-[#9CA3AF]">
          <span>Kích cỡ</span>
          <span className="text-[#111827] normal-case tracking-normal">{size}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sizeStates.map(({ value, isAvailable }) => {
            const isActive = value === size;
            return (
              <button
                key={value}
                type="button"
                onClick={() => isAvailable && onSizeChange(value)}
                disabled={!isAvailable || sizeOptions.length <= 1}
                className={`h-9 min-w-[48px] rounded-lg border text-[11px] font-semibold uppercase tracking-[0.2em] transition-all ${
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
      <p className="mt-6 text-xl text-[#6B7280]">Giỏ hàng của bạn đang trống</p>
      <button
        type="button"
        onClick={() => navigate("/collections")}
        className="mt-6 rounded-md bg-black px-8 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
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
};

const OrderSummaryCard = ({
  subtotal,
  shipping,
  total,
  navigate,
}: {
  subtotal: number;
  shipping: number;
  total: number;
  navigate: (path: string) => void;
}) => (
  <aside className="h-fit space-y-6 rounded-lg border border-gray-200 bg-gray-50 p-6 lg:sticky lg:top-5">
    <h2 className="text-xl font-bold text-black">
      Tóm tắt đơn hàng
    </h2>
    <div className="space-y-4">
      <SummaryRow label="Tạm tính" value={formatCurrency(subtotal)} />
      <SummaryRow
        label="Phí vận chuyển"
        value={shipping > 0 ? formatCurrency(shipping) : "—"}
      />
    </div>

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
      Tiến hành thanh toán
      <ArrowRight className="h-4 w-4" />
    </button>
    <div className="space-y-4 rounded-lg bg-white/70 p-4 shadow-sm">
      {[
        { icon: "✅", title: "Đổi trả miễn phí trong 30 ngày" },
        { icon: "🔒", title: "Thanh toán an toàn" },
        { icon: "🎁", title: "Gói quà miễn phí" },
      ].map((item) => (
        <div key={item.title} className="flex items-center gap-3 text-sm text-[#1A1A1A]">
          <span className="text-lg">{item.icon}</span>
          <span>{item.title}</span>
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
    <div className="w-full px-4 sm:px-6 lg:px-10 xl:px-16">
      <p className="text-sm uppercase tracking-[0.4em] text-white">
        Aristino
      </p>
      <p className="mt-4 text-xs">
        © {new Date().getFullYear()} Aristino. Đã đăng ký bản quyền.
      </p>
    </div>
  </footer>
);

