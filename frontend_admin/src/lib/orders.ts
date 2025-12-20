import { apiClient } from "./api";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipping"
  | "completed"
  | "canceled"
  | "paid"
  | "refunded";

export type OrderItem = {
  id: number;
  order_id?: number;
  product_id?: number;
  variant_id?: number;
  quantity: number;
  unit_price?: number | string;
  line_total?: number | string;
  product_name?: string;
  variant_name?: string;
};

export type Order = {
  id: number;
  code?: string;
  status: OrderStatus;
  customer_id?: number;
  customer_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  payment_method?: string | null;
  total_amount?: number | string;
  created_at?: string;
  updated_at?: string;
  items?: OrderItem[];
};

export type Pagination = {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination?: Pagination;
};

export type ListOrderParams = {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  search?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortDir?: "ASC" | "DESC";
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  pagination?: Pagination;
};

const unwrap = <T>(payload: ApiEnvelope<T> | T): T => {
  if ((payload as ApiEnvelope<T>)?.success === false) {
    throw new Error((payload as ApiEnvelope<T>)?.message || "Request failed");
  }
  if (typeof payload === "object" && payload !== null && "data" in (payload as any)) {
    return (payload as ApiEnvelope<T>).data as T;
  }
  return payload as T;
};

export async function listOrders(params: ListOrderParams = {}): Promise<PaginatedResponse<Order>> {
  const query: Record<string, any> = {};
  if (params.page) query.page = params.page;
  if (params.limit) query.limit = params.limit;
  if (params.status) query.status = params.status;
  if (params.search) query.customer = params.search;
  if (params.startDate) query.startDate = params.startDate;
  if (params.endDate) query.endDate = params.endDate;
  if (params.sortBy) query.sortBy = params.sortBy;
  if (params.sortDir) query.sortDir = params.sortDir;

  const res = await apiClient.get<ApiEnvelope<{ orders?: Order[]; items?: Order[]; data?: Order[] }>>(
    "/admin/orders",
    { params: query }
  );

  const data = unwrap(res.data);
  const items = (data as any)?.orders ?? (data as any)?.items ?? (data as any)?.data ?? [];
  const pagination = res.data?.pagination;

  return {
    items,
    pagination,
  };
}

export async function getOrderById(id: number | string): Promise<Order> {
  const res = await apiClient.get<ApiEnvelope<Order>>(`/admin/orders/${id}`);
  return unwrap(res.data);
}

export async function updateOrderStatus(id: number | string, status: OrderStatus): Promise<Order> {
  const res = await apiClient.patch<ApiEnvelope<Order>>(`/admin/orders/${id}`, { status });
  return unwrap(res.data);
}

export async function processRefund(
  id: number | string,
  payload: { reason: string; amount: number }
): Promise<Order> {
  const res = await apiClient.post<ApiEnvelope<Order>>(`/admin/orders/${id}/refund`, payload);
  return unwrap(res.data);
}

