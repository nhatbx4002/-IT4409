import { apiClient } from "./api";

export type DiscountPayload = {
  name: string;
  code?: string | null;
  description?: string | null;
  discount_type: 'percentage' | 'fixed_amount' | 'free_shipping';
  discount_value: number;
  max_discount_amount?: number | null;
  min_order_value?: number | null;
  apply_type: 'auto_apply' | 'code';
  applicable_to?: 'order' | 'shipping';
  start_date?: string;
  end_date?: string;
  usage_limit?: number | null;
  is_active?: boolean;
};

export async function listDiscounts(params?: { apply_type?: string; is_active?: boolean }) {
  const res = await apiClient.get('/admin/discounts', { params });
  return res.data?.data ?? res.data;
}

export async function createDiscount(payload: DiscountPayload) {
  const res = await apiClient.post('/admin/discounts', payload);
  return res.data?.data ?? res.data;
}

export async function updateDiscount(id: number, payload: Partial<DiscountPayload>) {
  const res = await apiClient.put(`/admin/discounts/${id}`, payload);
  return res.data?.data ?? res.data;
}

export async function deleteDiscount(id: number) {
  const res = await apiClient.delete(`/admin/discounts/${id}`);
  return res.data?.data ?? res.data;
}
