import { Check, Truck, CreditCard } from "lucide-react";
import type { PaymentMethod } from "@/types/checkout";

interface PaymentMethodSelectionProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
}

export function PaymentMethodSelection({
  selectedMethod,
  onSelectMethod,
}: PaymentMethodSelectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-black">Phương thức thanh toán</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {/* COD Option */}
        <button
          type="button"
          onClick={() => onSelectMethod("COD")}
          className={`relative flex flex-col items-start rounded-lg border-2 p-6 text-left transition ${
            selectedMethod === "COD"
              ? "border-black bg-gray-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
        >
          {selectedMethod === "COD" && (
            <div className="absolute right-4 top-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
                <Check className="h-4 w-4 text-white" />
              </div>
            </div>
          )}
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gray-100">
              <Truck className="h-5 w-5 text-gray-700" />
            </div>
            <div>
              <h3 className="font-semibold text-black">COD</h3>
              <p className="text-sm text-gray-600">Thanh toán khi nhận hàng</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Thanh toán tiền mặt khi nhận hàng (COD)
          </p>
        </button>

        {/* VNPay Option */}
        <button
          type="button"
          onClick={() => onSelectMethod("VNPAY")}
          className={`relative flex flex-col items-start rounded-lg border-2 p-6 text-left transition ${
            selectedMethod === "VNPAY"
              ? "border-black bg-gray-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
        >
          {selectedMethod === "VNPAY" && (
            <div className="absolute right-4 top-4">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-black">
                <Check className="h-4 w-4 text-white" />
              </div>
            </div>
          )}
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-black">VNPAY</h3>
              <p className="text-sm text-gray-600">Thanh toán online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded bg-blue-600 px-2 py-1 text-xs font-semibold text-white">
              VNPAY
            </div>
            <p className="text-sm text-gray-500">Thẻ ATM / QR Pay / Ví điện tử</p>
          </div>
        </button>
      </div>
    </div>
  );
}

