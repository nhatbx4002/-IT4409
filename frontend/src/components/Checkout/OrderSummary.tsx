import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { CartItem } from "@/types/cart";
import { CheckCircle2, XCircle } from "lucide-react";
import { validateDiscountCode, applyDiscount } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  const [localPromoCode, setLocalPromoCode] = useState(promoCode);
  const [promoState, setPromoState] = useState<"success" | "error" | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [calculatedDiscount, setCalculatedDiscount] = useState(discountAmount);

  // Sync local promo code with prop
  useEffect(() => {
    setLocalPromoCode(promoCode);
  }, [promoCode]);

  // Sync calculated discount with prop
  useEffect(() => {
    setCalculatedDiscount(discountAmount);
  }, [discountAmount]);

  const handleApplyPromo = async () => {
    if (!localPromoCode.trim()) {
      setPromoState("error");
      toast.error("Vui lòng nhập mã giảm giá");
      return;
    }

    setIsApplying(true);
    setPromoState(null);

    try {
      // Step 1: Validate the code
      const validation = await validateDiscountCode(localPromoCode.trim());

      if (!validation.valid) {
        setPromoState("error");
        const errorMessage = getDiscountErrorMessage(validation.reason);
        toast.error(errorMessage);
        onPromoCodeChange(""); // Clear invalid code
        onDiscountAmountChange?.(0);
        return;
      }

      // Step 2: Calculate discount amount
      const currentShippingFee = shippingFee ?? 0;
      const applied = await applyDiscount({
        code: localPromoCode.trim(),
        orderDraft: {
          subtotal,
          shipping_fee: currentShippingFee,
        },
      });

      if (!applied.applied) {
        setPromoState("error");
        const errorMessage = getDiscountErrorMessage(applied.reason);
        toast.error(errorMessage);
        onPromoCodeChange("");
        onDiscountAmountChange?.(0);
        return;
      }

      // Success!
      setPromoState("success");
      onPromoCodeChange(localPromoCode.trim());
      onDiscountAmountChange?.(applied.amount || 0);
      setCalculatedDiscount(applied.amount || 0);

      toast.success(
        `Áp dụng mã thành công! Giảm ${formatCurrency(applied.amount || 0)}`
      );
    } catch (error) {
      setPromoState("error");
      const errorMessage =
        error instanceof Error ? error.message : "Mã giảm giá không hợp lệ";
      toast.error(errorMessage);
      onPromoCodeChange("");
      onDiscountAmountChange?.(0);
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemovePromo = () => {
    setLocalPromoCode("");
    setPromoState(null);
    onPromoCodeChange("");
    onDiscountAmountChange?.(0);
    setCalculatedDiscount(0);
    toast.info("Đã xóa mã giảm giá");
  };

  // Helper function to get user-friendly error messages
  const getDiscountErrorMessage = (reason?: string): string => {
    const messages: Record<string, string> = {
      empty: "Vui lòng nhập mã giảm giá",
      not_found: "Mã giảm giá không tồn tại",
      expired: "Mã giảm giá đã hết hạn",
      not_started: "Mã giảm giá chưa có hiệu lực",
      exhausted: "Mã giảm giá đã hết lượt sử dụng",
      no_auto_available: "Không có mã giảm giá tự động",
    };
    return messages[reason || ""] || "Mã giảm giá không hợp lệ";
  };

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

      {/* Discount Code */}
      <div className="mb-6 space-y-2">
        {!promoState || promoState === "error" ? (
          <>
            <div className="flex gap-2">
              <Input
                value={localPromoCode}
                onChange={(e) => {
                  setLocalPromoCode(e.target.value);
                  setPromoState(null);
                }}
                placeholder="Nhập mã giảm giá"
                className="flex-1"
              />
              <Button
                onClick={handleApplyPromo}
                disabled={isApplying}
                className="bg-gray-800 text-white hover:bg-gray-900"
              >
                {isApplying ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Áp dụng"
                )}
              </Button>
            </div>
            {promoState === "error" && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <XCircle className="h-4 w-4" />
                <span>Mã giảm giá không hợp lệ</span>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-lg bg-green-50 border border-green-200 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-green-800">
                    Mã: {localPromoCode}
                  </span>
                  <span className="text-xs text-green-600">
                    Giảm {formatCurrency(calculatedDiscount)}
                  </span>
                </div>
              </div>
              <button
                onClick={handleRemovePromo}
                className="text-xs font-semibold text-red-600 hover:text-red-800 underline"
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

