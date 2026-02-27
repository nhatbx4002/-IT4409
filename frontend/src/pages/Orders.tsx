import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import { Package, Clock, Loader2, ChevronRight, X, Star } from "lucide-react";
import { getMyOrders, cancelOrder, reorderOrder, getOrderReviewableItems, createReview } from "@/lib/api";
import type { Order } from "@/types/order";
import { toast } from "sonner";
import { isAuthenticated } from "@/lib/auth";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getStatusLabel = (status: string) => {
  const statusMap: Record<string, string> = {
    pending: "Chờ xử lý",
    confirmed: "Đã xác nhận",
    processing: "Đang xử lý",
    shipping: "Đang giao hàng",
    delivered: "Đã giao hàng",
    canceled: "Đã hủy",
  };
  return statusMap[status.toLowerCase()] || status;
};

const getStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipping: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    canceled: "bg-red-100 text-red-800",
  };
  return colorMap[status.toLowerCase()] || "bg-gray-100 text-gray-800";
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelingOrderId, setCancelingOrderId] = useState<number | null>(null);
  const [reviewOrderId, setReviewOrderId] = useState<number | null>(null);
  const [reviewItems, setReviewItems] = useState<
    {
      order_item_id: number;
      product_id: number;
      product_name: string;
      color?: string | null;
      size?: string | null;
      quantity: number;
    }[]
  >([]);
  const [selectedReviewItemId, setSelectedReviewItemId] = useState<number | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load orders";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const handleCancelOrder = async (orderId: number) => {
    if (!confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    try {
      setCancelingOrderId(orderId);
      await cancelOrder(orderId);
      toast.success("Đã hủy đơn hàng thành công");
      
      // Refresh danh sách đơn hàng
      const data = await getMyOrders();
      setOrders(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể hủy đơn hàng";
      toast.error(errorMessage);
    } finally {
      setCancelingOrderId(null);
    }
  };

  const handleReorder = async (orderId: number) => {
    try {
      await reorderOrder(orderId);
      toast.success("Đã thêm lại sản phẩm vào giỏ hàng");
      navigate("/cart");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Không thể đặt lại đơn hàng";
      toast.error(errorMessage);
    }
  };

  const openReviewModal = async (orderId: number) => {
    try {
      setReviewOrderId(orderId);
      setReviewItems([]);
      setSelectedReviewItemId(null);
      setReviewRating(5);
      setReviewComment("");

      const items = await getOrderReviewableItems(orderId);
      if (!items || items.length === 0) {
        toast.info("Tất cả sản phẩm trong đơn này đã được bạn đánh giá.");
        setReviewOrderId(null);
        return;
      }

      setReviewItems(items);
      setSelectedReviewItemId(items[0].order_item_id);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Không thể tải danh sách sản phẩm để đánh giá";
      toast.error(errorMessage);
      setReviewOrderId(null);
    }
  };

  const closeReviewModal = () => {
    setReviewOrderId(null);
    setReviewItems([]);
    setSelectedReviewItemId(null);
    setReviewRating(5);
    setReviewComment("");
    setIsSubmittingReview(false);
  };

  const handleSubmitReview = async () => {
    if (!reviewOrderId || !selectedReviewItemId) return;

    const item = reviewItems.find((x) => x.order_item_id === selectedReviewItemId);
    if (!item) return;

    try {
      setIsSubmittingReview(true);
      await createReview({
        productId: item.product_id,
        rating: reviewRating,
        comment: reviewComment,
        orderItemId: item.order_item_id,
      });

      toast.success("Đã gửi đánh giá của bạn");
      closeReviewModal();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Không thể gửi đánh giá, vui lòng thử lại";
      toast.error(errorMessage);
      setIsSubmittingReview(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="w-full px-4 py-16 sm:px-8 lg:px-12 xl:px-16">
          <header className="mb-8 flex items-center gap-3">
            <Package className="h-6 w-6 text-black" />
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-gray-500">Account</p>
              <h1 className="text-3xl font-semibold text-black">My Orders</h1>
            </div>
          </header>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-black" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full px-4 py-16 sm:px-8 lg:px-12 xl:px-16">
        <header className="mb-8 flex items-center gap-3">
          <Package className="h-6 w-6 text-black" />
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-gray-500">Account</p>
            <h1 className="text-3xl font-semibold text-black">My Orders</h1>
          </div>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-10">
            <p className="text-center text-red-600">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-10 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <Clock className="h-12 w-12 text-gray-400" />
              <h2 className="mt-4 text-xl font-semibold text-black">Chưa có đơn hàng</h2>
              <p className="mt-2 max-w-md text-sm text-gray-600">
                Khi bạn đặt hàng, bạn sẽ thấy trạng thái và chi tiết đơn hàng ở đây.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/collections"
                  className="rounded-md bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Bắt đầu mua sắm
                </Link>
                <Link
                  to="/cart"
                  className="rounded-md border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-800 transition hover:bg-gray-50"
                >
                  Xem giỏ hàng
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <p className="text-sm font-semibold text-black">
                          Đơn hàng #{order.id}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusLabel(order.status)}
                      </span>
                    </div>

                    {order.OrderItems && order.OrderItems.length > 0 && (
                      <div className="mb-4 space-y-2">
                        {order.OrderItems.slice(0, 2).map((item) => (
                          <div key={item.id} className="flex items-center gap-3 text-sm text-gray-700">
                            <span className="font-medium">{item.name_snapshot}</span>
                            {item.color_snapshot && (
                              <span className="text-gray-500">
                                {item.color_snapshot}
                                {item.size_snapshot && ` / ${item.size_snapshot}`}
                              </span>
                            )}
                            <span className="text-gray-500">x{item.quantity}</span>
                          </div>
                        ))}
                        {order.OrderItems.length > 2 && (
                          <p className="text-xs text-gray-500">
                            và {order.OrderItems.length - 2} sản phẩm khác
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">
                          Tổng tiền:{" "}
                          <span className="font-bold text-black">
                            {formatCurrency(order.total_amount)}
                          </span>
                        </p>
                        {order.Payment && (
                          <p className="text-xs text-gray-500 mt-1">
                            Phương thức: {order.Payment.provider === "COD" ? "Thanh toán khi nhận hàng" : order.Payment.provider}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={cancelingOrderId === order.id}
                            className="flex items-center gap-2 rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancelingOrderId === order.id ? (
                              <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Đang hủy...
                              </>
                            ) : (
                              <>
                                <X className="h-4 w-4" />
                                Hủy đơn hàng
                              </>
                            )}
                          </button>
                        )}
                        {order.status === "delivered" && (
                          <>
                            <button
                              onClick={() => openReviewModal(order.id)}
                              className="flex items-center gap-2 rounded-md border border-yellow-400 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-800 transition hover:bg-yellow-100"
                            >
                              <Star className="h-4 w-4" />
                              Đánh giá sản phẩm
                            </button>
                            <button
                              onClick={() => handleReorder(order.id)}
                              className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                              Đặt lại
                            </button>
                          </>
                        )}
                        <Link
                          to={`/orders/${order.id}`}
                          className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                          Xem chi tiết
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {reviewOrderId && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-black">Đánh giá sản phẩm</h2>
              <button
                onClick={closeReviewModal}
                className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {reviewItems.length === 0 ? (
              <p className="text-sm text-gray-600">
                Đang tải danh sách sản phẩm có thể đánh giá...
              </p>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Sản phẩm
                  </label>
                  <select
                    value={selectedReviewItemId ?? ""}
                    onChange={(e) => setSelectedReviewItemId(Number(e.target.value))}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    {reviewItems.map((item) => (
                      <option key={item.order_item_id} value={item.order_item_id}>
                        {item.product_name}
                        {item.color && ` - ${item.color}`}
                        {item.size && ` / ${item.size}`}
                        {` x${item.quantity}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Đánh giá
                  </label>
                  <div className="mt-1 flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className={`rounded-full p-1 ${
                          star <= reviewRating ? "text-yellow-500" : "text-gray-300"
                        }`}
                      >
                        <Star className="h-5 w-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wide text-gray-500">
                    Nhận xét (tuỳ chọn)
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                    placeholder="Hãy chia sẻ cảm nhận của bạn về sản phẩm..."
                  />
                </div>

                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={closeReviewModal}
                    className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    disabled={isSubmittingReview}
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitReview}
                    disabled={isSubmittingReview || !selectedReviewItemId}
                    className="flex items-center gap-2 rounded-md bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmittingReview && <Loader2 className="h-4 w-4 animate-spin" />}
                    Gửi đánh giá
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
}
