import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { CartItem } from "@/types/cart";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { LuxuryVoucherSelector } from "@/components/Cart/LuxuryVoucherSelector";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number | null;
  shippingNote: string;
  discountAmount: number;
  total: number;
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
  onDiscountAmountChange?: (amount: number) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

export function OrderSummary({
  items,
  subtotal,
  shippingFee,
  shippingNote,
  discountAmount,
  total,
  promoCode,
  onPromoCodeChange,
  onDiscountAmountChange,
}: OrderSummaryProps) {
  const [appliedPromo, setAppliedPromo] = useState(promoCode.trim() !== "");
  const [promoState, setPromoState] = useState<"success" | "error" | null>(
    promoCode.trim() !== "" ? "success" : null
  );
  const [calculatedDiscount, setCalculatedDiscount] = useState(discountAmount);

  // Sync applied promo state with promo code
  useEffect(() => {
    const hasPromo = promoCode.trim() !== "";
    setAppliedPromo(hasPromo);
    // Auto-set success state when promo code is present
    if (hasPromo) {
      setPromoState("success");
    }
  }, [promoCode]);

  // Sync calculated discount with prop
  useEffect(() => {
    setCalculatedDiscount(discountAmount);
  }, [discountAmount]);

  const handleApplyPromo = async () => {
    setPromoState(null);
    // The actual API call is handled by LuxuryVoucherSelector
    setAppliedPromo(true);
    setPromoState("success");
  };

  const handleRemovePromo = () => {
    onPromoCodeChange("");
    onDiscountAmountChange?.(0);
    setCalculatedDiscount(0);
    setAppliedPromo(false);
    setPromoState(null);
    toast.info("Đã xóa mã giảm giá");
  };

  const currentShippingFee = shippingFee ?? 0;

  const summaryContent = (
    <>

      {/* Product List */}
      <div className="mb-6 max-h-64 space-y-4 overflow-y-auto">
        {items.map((item) => (
          <div key={item.cart_item_id} className="flex gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-white">
              <img
                src={item.image_url || "https://via.placeholder.com/80"}
                alt={item.product_name}
                className="h-full w-full object-cover"
              />
              {item.quantity > 1 && (
                <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs font-semibold text-white">
                  {item.quantity}
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-black line-clamp-2">{item.product_name}</h3>
              <p className="text-sm text-gray-500">
                {item.color && `${item.color}`}
                {item.color && item.size && " / "}
                {item.size && `${item.size}`}
              </p>
              <p className="mt-1 text-sm font-semibold text-black">
                {formatCurrency(item.line_total)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Discount Code - Using LuxuryVoucherSelector */}
      <div className="mb-6">
        {!appliedPromo || promoState === "error" ? (
          <LuxuryVoucherSelector
            promoCode={promoCode}
            appliedPromo={appliedPromo}
            onPromoCodeChange={onPromoCodeChange}
            onApplyPromo={handleApplyPromo}
            onDiscountChange={(amount) => {
              setCalculatedDiscount(amount);
              onDiscountAmountChange?.(amount);
            }}
            subtotal={subtotal}
            shippingFee={currentShippingFee}
          />
        ) : (
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-green-800">
                    Mã: {promoCode}
                  </span>
                  <span className="text-xs text-green-600">
                    Giảm {formatCurrency(calculatedDiscount)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleRemovePromo}
                className="text-xs font-semibold text-red-600 hover:text-red-800 underline px-2 py-1"
              >
                Xóa
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Calculations */}
      <div className="space-y-3 border-t border-gray-200 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tạm tính</span>
          <span className="font-medium text-black">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Phí vận chuyển</span>
          <span className="font-medium text-black">
            {shippingFee !== null ? formatCurrency(shippingFee) : shippingNote}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Giảm giá</span>
            <span className="font-medium text-green-600">
              -{formatCurrency(discountAmount)}
            </span>
          </div>
        )}

        <div className="border-t border-gray-300 pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-bold text-black">Tổng cộng</span>
            <span className="text-xl font-bold text-black">{formatCurrency(total)}</span>
          </div>
          <p className="mt-1 text-xs text-gray-500">(Đã bao gồm VAT)</p>
        </div>
      </div>
    </>
  );

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50">
      {/* Desktop: Always visible */}
      <div className="hidden p-6 lg:block">
        <h2 className="mb-6 text-xl font-bold text-black">Tóm tắt đơn hàng</h2>
        {summaryContent}
      </div>

      {/* Mobile: Accordion */}
      <div className="lg:hidden">
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1" className="border-0">
            <AccordionTrigger className="px-6 py-4 text-lg font-bold text-black hover:no-underline">
              Tóm tắt đơn hàng
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              {summaryContent}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}

