import { adminApiClient, getPaginatedAdminData } from "./api";

// Types matching backend discount model
export type DiscountType = 'percentage' | 'fixed_amount' | 'free_shipping';
export type ApplyType = 'auto_apply' | 'code';
export type ApplicableTo = 'all' | 'brand' | 'category' | 'product';

export type Discount = {
  id: number;
  name: string;
  code: string | null;
  description?: string;
  discount_type: DiscountType;
  discount_value: number | string;
  max_discount_amount?: number | string | null;
  min_order_value?: number | string;
  apply_type: ApplyType;
  start_date?: string | null;
  end_date?: string | null;
  usage_limit: number;
  usage_count: number;
  applicable_to: ApplicableTo;
  target_ids?: number[] | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type DiscountPayload = Omit<Discount, 'id' | 'usage_count' | 'created_at' | 'updated_at'>;

export type DiscountKPI = {
  totalRevenueImpact: number;
  totalRedemptions: number;
  activeCoupons: number;
  expiredCoupons: number;
  averageDiscountValue: number;
  redemptionsProgress: {
    current: number;
    total: number;
    percentage: number;
  };
};

export type ListDiscountParams = {
  page?: number;
  limit?: number;
  status?: 'active' | 'expired' | 'all';
  search?: string;
  sortBy?: string;
  sortDir?: 'ASC' | 'DESC';
  apply_type?: string;
  is_active?: boolean;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total?: number;
    totalPages?: number;
  };
};

const unwrap = <T>(payload: ApiEnvelope<T> | T): T => {
  if ((payload as ApiEnvelope<T>)?.success === false) {
    throw new Error((payload as ApiEnvelope<T>)?.message || 'Request failed');
  }
  if (typeof payload === 'object' && payload !== null && 'data' in (payload as any)) {
    return (payload as ApiEnvelope<T>).data as T;
  }
  return payload as T;
};

// API Functions
export async function listDiscounts(params: ListDiscountParams = {}): Promise<{
  items: Discount[];
  pagination?: { page: number; limit: number; total?: number };
}> {
  const queryParams: Record<string, any> = {};
  if (params.page) queryParams.page = params.page;
  if (params.limit) queryParams.limit = params.limit;
  if (params.status && params.status !== 'all') queryParams.status = params.status;
  if (params.search) queryParams.search = params.search;
  if (params.sortBy) queryParams.sortBy = params.sortBy;
  if (params.sortDir) queryParams.sortDir = params.sortDir;
  if (params.apply_type) queryParams.apply_type = params.apply_type;
  if (typeof params?.is_active === 'boolean') queryParams.is_active = params.is_active;

  return getPaginatedAdminData<Discount>('/discounts', queryParams);
}

export async function getDiscountById(id: number | string): Promise<Discount> {
  const res = await adminApiClient.get<Discount>(`/discounts/${id}`);
  return res.data;
}

export async function createDiscount(payload: DiscountPayload): Promise<Discount> {
  const res = await adminApiClient.post<Discount>('/discounts', payload);
  return res.data;
}

export async function updateDiscount(id: number | string, payload: Partial<DiscountPayload>): Promise<Discount> {
  const res = await adminApiClient.put<Discount>(`/discounts/${id}`, payload);
  return res.data;
}

export async function deleteDiscount(id: number | string): Promise<void> {
  await adminApiClient.delete(`/discounts/${id}`);
}

export async function toggleDiscountStatus(id: number | string, is_active: boolean): Promise<Discount> {
  const res = await adminApiClient.patch<Discount>(`/discounts/${id}`, { is_active });
  return res.data;
}

export async function getDiscountKPI(): Promise<DiscountKPI> {
  const res = await adminApiClient.get<DiscountKPI>('/discounts/analytics/kpi');
  return res.data;
}

export async function generateDiscountCode(length: number = 8): Promise<string> {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Helper functions
export const formatDiscountValue = (discount: Discount): string => {
  const value = typeof discount.discount_value === 'string'
    ? Number(discount.discount_value)
    : discount.discount_value;

  if (discount.discount_type === 'percentage') {
    return `${value}%`;
  } else if (discount.discount_type === 'fixed_amount') {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  } else {
    return 'Free Shipping';
  }
};

export const isExpired = (discount: Discount): boolean => {
  if (!discount.end_date) return false;
  return new Date(discount.end_date) < new Date();
};

export const getStatusBadge = (discount: Discount): { label: string; className: string } => {
  if (!discount.is_active) {
    return { label: 'Inactive', className: 'bg-gray-100 text-gray-700' };
  }
  if (isExpired(discount)) {
    return { label: 'Expired', className: 'bg-red-100 text-red-700' };
  }
  return { label: 'Active', className: 'bg-green-100 text-green-700' };
};

export const formatCurrency = (value?: number | string | null) => {
  if (value === null || value === undefined) return '₫0';
  const numeric = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(numeric)) return '₫0';
  return numeric.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });
};

export const formatNumber = (value?: number | string | null) => {
  if (value === null || value === undefined) return '0';
  const numeric = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(numeric)) return '0';
  return numeric.toLocaleString('vi-VN');
};
