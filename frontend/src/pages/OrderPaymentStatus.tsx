import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import { getPaymentStatus } from "@/lib/api";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface StatusData {
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
}

export default function OrderPaymentStatusPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<StatusData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      if (!orderId) return;
      setLoading(true);
      setError(null);
      
      // Kiểm tra query params từ callback
      const paymentResult = searchParams.get("payment");
      const codResult = searchParams.get("cod");
      const message = searchParams.get("message");
      
      if (paymentResult === "failed" && message) {
        setError(decodeURIComponent(message));
        toast.error(decodeURIComponent(message));
        setLoading(false);
        return;
      }
      
      try {
        const result = await getPaymentStatus(Number(orderId));
        setData({
          orderStatus: result.orderStatus,
          paymentStatus: result.paymentStatus,
          paymentMethod: result.paymentMethod,
        });
        
        if (paymentResult === "success") {
          toast.success("Thanh toán thành công!");
        } else if (codResult === "success") {
          // COD đã được xử lý trong getStatusMessage
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Không thể lấy trạng thái thanh toán";
        setError(msg);
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [orderId, searchParams]);

  const renderIcon = () => {
    if (!data) return <AlertTriangle className="h-10 w-10 text-amber-500" />;
    
    // Với COD, pending có nghĩa là đặt hàng thành công (sẽ thanh toán khi nhận hàng)
    const isCODSuccess = data.paymentMethod === "COD" && data.paymentStatus === "pending";
    
    if (data.paymentStatus === "succeeded" || data.paymentStatus === "completed" || isCODSuccess) {
      return <CheckCircle className="h-10 w-10 text-emerald-600" />;
    }
    if (data.paymentStatus === "failed" || data.paymentStatus === "canceled" || data.paymentStatus === "expired") {
      return <XCircle className="h-10 w-10 text-red-600" />;
    }
    return <AlertTriangle className="h-10 w-10 text-amber-500" />;
  };
  
  const getStatusMessage = () => {
    if (!data) return "Đang kiểm tra...";
    
    // Với COD, pending có nghĩa là đặt hàng thành công
    if (data.paymentMethod === "COD" && data.paymentStatus === "pending") {
      return "Đặt hàng thành công! Bạn sẽ thanh toán khi nhận hàng.";
    }
    
    if (data.paymentStatus === "succeeded" || data.paymentStatus === "completed") {
      return "Thanh toán thành công!";
    }
    
    if (data.paymentStatus === "failed" || data.paymentStatus === "canceled" || data.paymentStatus === "expired") {
      return "Thanh toán thất bại";
    }
    
    if (data.paymentStatus === "waiting_gateway") {
      return "Đang chờ thanh toán...";
    }
    
    return "Đang xử lý...";
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="flex flex-col items-center text-center">
          {loading ? (
            <div className="flex items-center gap-2 text-gray-700">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Đang kiểm tra trạng thái thanh toán...</span>
            </div>
          ) : (
            <>
              {renderIcon()}
              <h1 className="mt-4 text-2xl font-semibold text-gray-900">
                {data?.paymentMethod === "COD" ? "Đặt hàng thành công" : "Trạng thái thanh toán"}
              </h1>
              {error ? (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              ) : data ? (
                <>
                  <p className="mt-2 text-base font-medium text-gray-900">{getStatusMessage()}</p>
                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <p>Mã đơn: #{orderId}</p>
                    <p>Trạng thái đơn hàng: {data.orderStatus}</p>
                    {data.paymentMethod !== "COD" && (
                      <p>Trạng thái thanh toán: {data.paymentStatus}</p>
                    )}
                    <p>Phương thức: {data.paymentMethod === "COD" ? "Thanh toán khi nhận hàng (COD)" : data.paymentMethod}</p>
                  </div>
                </>
              ) : null}

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
                  Tiếp tục mua sắm
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
