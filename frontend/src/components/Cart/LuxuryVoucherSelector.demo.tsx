/**
 * Luxury Voucher Selector - Demo Page
 *
 * This is a standalone demo page for testing the LuxuryVoucherSelector component.
 * It simulates a cart context with mock data.
 *
 * Usage:
 * 1. Import this component in your App.tsx or routes
 * 2. Visit the demo page to test the voucher selector
 */

import { useState } from "react";
import { LuxuryVoucherSelector } from "./LuxuryVoucherSelector";

const DEMO_CART_ITEMS = [
  {
    id: "1",
    name: "Áo Sơ Mi Tay Dài Aristino",
    price: 1200000,
    quantity: 2,
  },
  {
    id: "2",
    name: "Quần Tây Chino Slim Fit",
    price: 1800000,
    quantity: 1,
  },
];

const DEMO_SUBTOTALS = [
  500000,   // Below minimum (for testing warnings)
  1500000,  // Medium order
  5000000,  // Large order (above all thresholds)
];

export const LuxuryVoucherSelectorDemo = () => {
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [subtotal, setSubtotal] = useState(3000000);
  const [cartItems] = useState(DEMO_CART_ITEMS);

  const handleApplyPromo = () => {
    setAppliedPromo(true);
  };

  const handleDiscountChange = (amount: number) => {
    setDiscountAmount(amount);
    console.log("Discount updated:", amount);
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Luxury Voucher Selector Demo
          </h1>
          <p className="text-gray-600">
            Component thử nghiệm cho trang giỏ hàng
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Left Column - Demo Controls */}
          <div className="space-y-6">
            {/* Demo Instructions */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Hướng dẫn sử dụng
              </h2>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  <p>Nhấn vào "Bạn có mã ưu đãi?" để mở danh sách mã</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  <p>Chọn mã từ danh sách hoặc nhập mã thủ công</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  <p>Nhấn "ÁP DỤNG" để áp dụng mã giảm giá</p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  <p>Thay đổi tổng tiền giỏ hàng để test điều kiện</p>
                </div>
              </div>
            </div>

            {/* Cart Simulator */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Giỏ hàng mẫu
              </h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Số lượng: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Subtotal Controls */}
              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tạm tính (demo)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {DEMO_SUBTOTALS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setSubtotal(amount)}
                      className={`
                        rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all
                        ${
                          subtotal === amount
                            ? "border-black bg-black text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                        }
                      `}
                    >
                      {formatCurrency(amount)}
                    </button>
                  ))}
                </div>

                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="100000"
                  value={subtotal}
                  onChange={(e) => setSubtotal(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Hoặc kéo thanh để điều chỉnh
                </p>
              </div>

              {/* Summary */}
              <div className="border-t border-gray-200 pt-4 mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giảm giá:</span>
                    <span className="font-semibold text-green-600">
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2">
                  <span className="text-gray-900">Tổng cộng:</span>
                  <span className="text-gray-900">
                    {formatCurrency(Math.max(subtotal - discountAmount, 0))}
                  </span>
                </div>
              </div>

              {/* Reset Button */}
              <button
                type="button"
                onClick={() => {
                  setPromoCode("");
                  setAppliedPromo(false);
                  setDiscountAmount(0);
                }}
                className="mt-4 w-full rounded-lg border-2 border-gray-300 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:bg-gray-50"
              >
                Reset trạng thái
              </button>
            </div>

            {/* State Debug Info */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Component State (Debug)
              </h3>
              <div className="space-y-1 text-xs font-mono">
                <p>
                  <span className="text-gray-600">promoCode:</span>{" "}
                  <span className="text-blue-600">"{promoCode}"</span>
                </p>
                <p>
                  <span className="text-gray-600">appliedPromo:</span>{" "}
                  <span className={appliedPromo ? "text-green-600" : "text-gray-500"}>
                    {appliedPromo.toString()}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600">discountAmount:</span>{" "}
                  <span className="text-purple-600">{discountAmount}</span>
                </p>
                <p>
                  <span className="text-gray-600">subtotal:</span>{" "}
                  <span className="text-orange-600">{subtotal}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Component Preview */}
          <div className="lg:sticky lg:top-8 lg:h-fit">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Component Preview
              </h2>

              {/* The Component */}
              <LuxuryVoucherSelector
                promoCode={promoCode}
                appliedPromo={appliedPromo}
                onPromoCodeChange={setPromoCode}
                onApplyPromo={handleApplyPromo}
                onDiscountChange={handleDiscountChange}
                subtotal={subtotal}
                shippingFee={15}
                className="mb-6"
              />

              {/* Quick Tips */}
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm">
                <p className="font-semibold text-blue-900 mb-2">💡 Mẹo:</p>
                <ul className="space-y-1 text-blue-800">
                  <li>• Mã VIP10: Giảm 10% (min: 1.000.000₫)</li>
                  <li>• Mã FREESHIP: Miễn phí vận chuyển</li>
                  <li>• Nhấn Enter để áp dụng mã nhanh</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Luxury Voucher Selector Component Demo</p>
          <p className="mt-1">Built with React, TypeScript, and Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
};

export default LuxuryVoucherSelectorDemo;
