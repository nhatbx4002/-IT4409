export interface CartItem {
  cart_item_id: number;
  quantity: number;
  product_id: number;
  product_variant_id: number;
  product_name: string;
  product_slug: string | null;
  sku: string | null;
  color: string | null;
  size: string | null;
  image_url: string | null;
  unit_price: number;
  line_total: number;
  stock_quantity: number;
}

export interface CartResponse {
  id: number;
  user_id: number;
  items: CartItem[];
  subtotal_amount: number;
  discount_amount: number;
  total_amount: number;
  applied_promotion_code: string | null;
}

export interface AddToCartResponse {
  id: number;
  cart_id: number;
  product_variant_id: number;
  quantity: number;
}

export interface UpdateCartItemResponse {
  id: number;
  cart_id: number;
  product_variant_id: number;
  quantity: number;
}

