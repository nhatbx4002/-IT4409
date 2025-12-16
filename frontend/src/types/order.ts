export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_variant_id: number;
  name_snapshot: string;
  sku_snapshot: string | null;
  color_snapshot: string | null;
  size_snapshot: string | null;
  unit_price: number;
  quantity: number;
  line_total: number;
}

export interface Payment {
  id: number;
  order_id: number;
  provider: string;
  provider_txn_id: string | null;
  amount: number;
  currency: string;
  status: string;
  payment_method: string | null;
  raw_payload: any;
  created_at: string;
  updated_at: string;
}

export interface Promotion {
  id: number;
  name: string;
  code: string;
  discount_type: string;
  discount_value: number;
}

export interface Order {
  id: number;
  user_id: number;
  shipping_address_id: number;
  promotion_id: number | null;
  subtotal_amount: number;
  discount_amount: number;
  total_amount: number;
  status: string;
  promotion_code: string | null;
  notes: string | null;
  created_at: string;
  Payment?: Payment;
  OrderItems?: OrderItem[];
  promotion?: Promotion;
}



