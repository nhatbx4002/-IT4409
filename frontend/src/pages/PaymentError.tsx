import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import { XCircle } from "lucide-react";

export default function PaymentErrorPage() {
  const [searchParams] = useSearchParams();
  const message = searchParams.get("message") || "Có lỗi xảy ra trong quá trình thanh toán";

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <XCircle className="h-16 w-16 text-red-600" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">Thanh toán thất bại</h1>
          <p className="mt-2 text-sm text-red-600">{message}</p>
          
          <div className="mt-6 flex gap-3">
            <Link
              to="/orders"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Xem đơn hàng của tôi
            </Link>
            <Link
              to="/"
              className="rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

