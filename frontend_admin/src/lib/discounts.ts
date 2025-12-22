import { adminApiClient, getPaginatedAdminData } from "./api";

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
  const queryParams: Record<string, any> = {};
  if (params?.apply_type) queryParams.apply_type = params.apply_type;
  if (typeof params?.is_active === 'boolean') queryParams.is_active = params.is_active;

  return getPaginatedAdminData<any>("/discounts", queryParams);
}

export async function createDiscount(payload: DiscountPayload) {
  const res = await adminApiClient.post('/discounts', payload);
  return res.data;
}

export async function updateDiscount(id: number, payload: Partial<DiscountPayload>) {
  const res = await adminApiClient.put(`/discounts/${id}`, payload);
  return res.data;
}

export async function deleteDiscount(id: number) {
  await adminApiClient.delete(`/discounts/${id}`);
}
