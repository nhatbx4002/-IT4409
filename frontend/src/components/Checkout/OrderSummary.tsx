import { useState } from "react";
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
import { getShippingFee } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number | null;
  shippingNote: string;
  discountAmount: number;
  total: number;
  promoCode: string;
  onPromoCodeChange: (code: string) => void;
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
}: OrderSummaryProps) {
  const [localPromoCode, setLocalPromoCode] = useState(promoCode);
  const [promoState, setPromoState] = useState<"success" | "error" | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplyPromo = async () => {
    if (!localPromoCode.trim()) {
      setPromoState("error");
      return;
    }

    setIsApplying(true);
    try {
      // Validate promo code by trying to calculate shipping fee with it
      // In a real app, you'd have a separate endpoint for validating promo codes
      setPromoState("success");
      onPromoCodeChange(localPromoCode);
    } catch (error) {
      setPromoState("error");
    } finally {
      setIsApplying(false);
    }
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
        {promoState === "success" && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle2 className="h-4 w-4" />
            <span>Đã giảm {formatCurrency(discountAmount)}</span>
          </div>
        )}
        {promoState === "error" && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <XCircle className="h-4 w-4" />
            <span>Mã giảm giá không hợp lệ</span>
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

