export interface ShippingAddress {
  id: number;
  user_id: number;
  full_name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface AddressFormData {
  full_name: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  is_default?: boolean;
}

export type PaymentMethod = 'COD' | 'VNPAY';

export interface ShippingFeeResponse {
  subtotal: number;
  shippingFee: number;
  shippingNote: string;
  discountAmount: number;
  discountType: 'shipping' | 'order' | null;
  promotionCode: string | null;
  promotionError: string | null;
  total: number;
}

export interface ShippingFeeRequest {
  province_id?: string | number;
  district_id?: string | number;
  city?: string;
  promotionCode?: string;
}

export interface CheckoutRequest {
  shippingAddressId: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  promotionCode?: string;
}

export interface CheckoutResponse {
  orderId: number;
  totalAmount: number;
  paymentMethod: PaymentMethod | string;
  paymentUrl?: string | null;
  message?: string;
}

export interface PaymentStatusResponse {
  orderId: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
}

export interface VietnamProvince {
  id: string;
  name: string;
}

export interface VietnamDistrict {
  id: string;
  name: string;
  province_id: string;
}

export interface VietnamWard {
  id: string;
  name: string;
  district_id: string;
}

