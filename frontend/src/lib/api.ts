import axios, { type AxiosError, type AxiosRequestConfig, type AxiosRequestHeaders } from 'axios';
import type {
  ProductDetail,
  ProductFilterParams,
  ProductsListResponse,
} from '@/types/products';
import type { ApiErrorResponse, ApiResponse } from '@/types/api';
import type {
  AuthResponse,
  AuthUser,
} from '@/types/auth';
import type {
  CartResponse,
  AddToCartResponse,
  UpdateCartItemResponse,
} from '@/types/cart';
import type {
  WishlistResponse,
  AddToWishlistResponse,
  RemoveFromWishlistResponse,
} from '@/types/wishlist';
import type { ProductReviewsResponse, ReviewItem } from '@/types/reviews';
import { clearAuthSession, getAccessToken, getStoredUser, getRefreshToken, setAuthSession } from './auth';

const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const raw = (!envUrl || typeof envUrl !== 'string' || envUrl.trim() === '')
    ? 'http://localhost:3000'
    : envUrl.trim();

  // Guarantee we always hit the API prefix even if the env omits `/api`
  const hasApiPath = /\/api\/?$/.test(raw);
  return hasApiPath ? raw : `${raw.replace(/\/+$/, '')}/api`;
};

const API_BASE_URL = getApiBaseUrl();
const normalizeBaseUrl = (url: string): string => url.replace(/\/+$/, '');
const API_BASE_URL_NORMALIZED = normalizeBaseUrl(API_BASE_URL);
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

const redirectToLogin = () => {
  clearAuthSession();
  if (typeof window === 'undefined') return;

  const { pathname, search, hash } = window.location;
  const currentPath = `${pathname}${search}${hash}`;
  const isLoginPage = pathname.startsWith('/login');
  const redirectParam = isLoginPage ? '' : `?redirect=${encodeURIComponent(currentPath)}`;

  window.location.href = `/login${redirectParam}`;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    const headers = (config.headers ?? {}) as AxiosRequestHeaders;

    if (typeof (headers as { set?: (key: string, value: string) => void }).set === 'function') {
      (headers as { set: (key: string, value: string) => void }).set('Authorization', `Bearer ${token}`);
    } else {
      headers.Authorization = `Bearer ${token}`;
    }

    config.headers = headers;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (status === 401) {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        redirectToLogin();
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        redirectToLogin();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken(refreshToken);
        if (!newToken) {
          redirectToLogin();
          return Promise.reject(error);
        }

        // Replay queued requests
        refreshQueue.forEach((cb) => cb(newToken));
        refreshQueue = [];

        const headers = (originalRequest.headers ?? {}) as AxiosRequestHeaders;
        headers.Authorization = `Bearer ${newToken}`;
        originalRequest.headers = headers;
        return apiClient(originalRequest);
      } catch (err) {
        refreshQueue.forEach((cb) => cb(null));
        refreshQueue = [];
        redirectToLogin();
        return Promise.reject(err);
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Network error';

    return Promise.reject(new Error(message));
  }
);

export async function bootstrapAuthSession(): Promise<void> {
  const accessToken = getAccessToken();
  if (accessToken) return;

  const refreshToken = getRefreshToken();
  if (!refreshToken) return;

  await refreshAccessToken(refreshToken);
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      refreshQueue.push((token) => resolve(token));
    });
  }

  isRefreshing = true;

  try {
    const res = await axios.post<ApiResponse<{ accessToken: string; refreshToken?: string; user?: AuthUser }>>(
      `${API_BASE_URL_NORMALIZED}/auth/refresh`,
      { refreshToken },
      { withCredentials: true }
    );

    const data = unwrapResponse(res.data);
    const user = data.user ?? getStoredUser();
    if (data.accessToken && user) {
      setAuthSession(
        { accessToken: data.accessToken, refreshToken: data.refreshToken || refreshToken },
        user
      );
    }

    return data.accessToken || null;
  } catch (err) {
    clearAuthSession();
    return null;
  } finally {
    isRefreshing = false;
  }
}

const unwrapResponse = <T>(payload: ApiResponse<T> | T): T => {
  if (payload && typeof payload === 'object' && 'success' in (payload as ApiResponse<T>)) {
    const typed = payload as ApiResponse<T>;
    if (typed.success === false) {
      throw new Error(typed.message || 'Request failed');
    }
    return (typed as { data?: T }).data ?? (typed as unknown as T);
  }
  return payload as T;
};

const buildFilterParams = (filters: ProductFilterParams = {}) => {
  const {
    sizes,
    colors,
    brands,
    categorySlugs,
    page = 1,
    pageSize = 12,
    ...rest
  } = filters;

  return {
    ...rest,
    sizes: sizes?.join(','),
    colors: colors?.join(','),
    brands: brands?.join(','),
    categorySlugs: categorySlugs?.join(','),
    page,
    pageSize,
  };
};

// ==============================
// AUTH API
// ==============================

export interface SignUpData {
  email: string;
  name: string;
  password: string;
  phone?: string;
}

export interface SignUpResponse {
  user: AuthUser;
  message?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignOutResponse {
  success: boolean;
  message?: string;
}

export interface SendOTPResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPResponse {
  token: string;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export async function signUp(data: SignUpData): Promise<SignUpResponse> {
  const response = await apiClient.post<ApiResponse<SignUpResponse>>('/auth/signUp', data);
  return unwrapResponse(response.data);
}

export async function signIn(credentials: SignInData): Promise<AuthResponse> {
  const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/signIn', credentials);
  return unwrapResponse(response.data);
}

export async function signOut(): Promise<SignOutResponse> {
  const response = await apiClient.get<ApiResponse<SignOutResponse>>('/auth/signOut');
  return unwrapResponse(response.data);
}

export async function sendOTP(email: string): Promise<SendOTPResponse> {
  const response = await apiClient.post<ApiResponse<SendOTPResponse>>('/auth/send-otp', { email });
  return unwrapResponse(response.data);
}

export async function verifyOTP(email: string, otp: string): Promise<VerifyOTPResponse> {
  const response = await apiClient.post<ApiResponse<VerifyOTPResponse>>('/auth/verify-otp', { email, otp });
  return unwrapResponse(response.data);
}

export async function resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
  const response = await apiClient.post<ApiResponse<ResetPasswordResponse>>('/auth/reset-password', {
    token,
    newPassword,
  });
  return unwrapResponse(response.data);
}

const buildOAuthStateParam = (redirectPath: string): string | null => {
  if (typeof window === 'undefined') return null;

  try {
    return window.btoa(JSON.stringify({ redirectTo: redirectPath }));
  } catch {
    return null;
  }
};

export function signInWithGoogle(redirectTo?: string): void {
  if (typeof window === 'undefined') {
    throw new Error('Google sign-in is only available in the browser');
  }

  const fallbackRedirect = window.location.pathname + window.location.search;
  const safeRedirect =
    redirectTo && redirectTo.startsWith('/') ? redirectTo : fallbackRedirect;

  const stateValue = buildOAuthStateParam(safeRedirect);
  const googleAuthUrl = `${API_BASE_URL_NORMALIZED}/auth/google`;

  if (stateValue) {
    const params = new URLSearchParams({ state: stateValue });
    window.location.href = `${googleAuthUrl}?${params.toString()}`;
    return;
  }

  window.location.href = googleAuthUrl;
}

export function signInWithFacebook(): void {
  window.location.href = `${API_BASE_URL}/auth/facebook`;
}

// ==============================
// PRODUCTS API
// ==============================

const getRequest = async <T>(url: string, config?: AxiosRequestConfig) => {
  const response = await apiClient.get<ApiResponse<T>>(url, config);
  return unwrapResponse(response.data);
};

export async function getProducts(
  filters: ProductFilterParams = {}
): Promise<ProductsListResponse> {
  return getRequest<ProductsListResponse>('/products/search', {
    params: buildFilterParams(filters),
  });
}

export async function getProductsByCategory(
  categorySlug: string,
  filters?: Omit<ProductFilterParams, 'categorySlug'>
): Promise<ProductsListResponse> {
  return getRequest<ProductsListResponse>(`/products/category/${categorySlug}`, {
    params: buildFilterParams(filters),
  });
}

type ProductVariantApi = {
  id: number;
  color: string | null;
  size: string | null;
  sku: string | null;
  price: number;
  stock_quantity?: number | null;
  stockQuantity?: number | null;
  image_url?: string | null;
  imageUrl?: string | null;
};

type ProductDetailApi = Omit<ProductDetail, 'variants'> & {
  variants?: ProductVariantApi[];
};

export async function getProductDetail(slugOrId: string): Promise<ProductDetail | null> {
  try {
    const response = await apiClient.get<ApiResponse<ProductDetailApi>>(
      `/products/${encodeURIComponent(slugOrId)}`
    );
    const payload = unwrapResponse(response.data);

    const mappedVariants = (payload.variants ?? []).map((variant) => ({
      id: variant.id,
      color: variant.color ?? null,
      size: variant.size ?? null,
      sku: variant.sku ?? null,
      price: variant.price,
      stockQuantity: variant.stock_quantity ?? variant.stockQuantity ?? 0,
      imageUrl: variant.image_url ?? variant.imageUrl ?? null,
    }));

    return {
      ...payload,
      variants: mappedVariants,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function getProductById(productId: number): Promise<ProductDetail | null> {
  return getProductDetail(String(productId));
}

export async function searchProducts(
  query: string,
  filters?: Omit<ProductFilterParams, 'q'>
): Promise<ProductsListResponse> {
  return getRequest<ProductsListResponse>('/products/search', {
    params: buildFilterParams({ ...filters, q: query }),
  });
}

export async function getProductFilters(
  filters: Pick<ProductFilterParams, 'collection'> = {}
): Promise<Record<string, unknown>> {
  return getRequest<Record<string, unknown>>('/products/filters', {
    params: filters,
  });
}

// ==============================
// REVIEWS API
// ==============================

export async function getProductReviews(
  productId: number,
  params: { page?: number; pageSize?: number } = {}
): Promise<ProductReviewsResponse> {
  return getRequest<ProductReviewsResponse>(`/reviews/product/${productId}`, {
    params,
  });
}

export async function createReview(payload: {
  productId: number;
  rating: number;
  comment?: string;
  images?: string[];
}): Promise<ReviewItem> {
  const response = await apiClient.post<ApiResponse<ReviewItem>>('/reviews', payload);
  return unwrapResponse(response.data);
}

// ==============================
// CART API
// ==============================

export async function addToCart(
  productVariantId: number,
  quantity: number
): Promise<AddToCartResponse> {
  const token = getAccessToken();
  if (!token) {
    redirectToLogin();
    throw new Error("Bạn cần đăng nhập để thêm vào giỏ hàng");
  }

  const response = await apiClient.post<{ success: boolean; message?: string; item: AddToCartResponse }>('/cart', {
    productVariantId,
    quantity,
  });
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to add item to cart');
  }
  return response.data.item;
}

export async function getCart(): Promise<CartResponse> {
  const response = await apiClient.get<{ success: boolean; message?: string; cart: CartResponse }>('/cart');
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to get cart');
  }
  return response.data.cart;
}

export type UpdateCartItemPayload = {
  quantity?: number;
  productVariantId?: number;
};

export async function updateCartItem(
  cartItemId: number,
  payloadOrQuantity: number | UpdateCartItemPayload
): Promise<UpdateCartItemResponse> {
  const payload = typeof payloadOrQuantity === 'number'
    ? { quantity: payloadOrQuantity }
    : payloadOrQuantity;

  const response = await apiClient.put<{ success: boolean; message?: string; item: UpdateCartItemResponse }>(
    `/cart/${cartItemId}`,
    payload
  );
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to update cart item');
  }
  return response.data.item;
}

export async function removeCartItem(cartItemId: number): Promise<void> {
  const response = await apiClient.delete<{ success: boolean; message?: string }>(`/cart/${cartItemId}`);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to remove cart item');
  }
}

// ==============================
// WISHLIST API
// ==============================

export async function addToWishlist(productId: number): Promise<AddToWishlistResponse> {
  const user = getStoredUser();
  if (!user?.id) {
    redirectToLogin();
    throw new Error('User not authenticated');
  }
  
  const response = await apiClient.post<AddToWishlistResponse>('/wishlist/add', {
    userId: user.id,
    productId,
  });
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to add to wishlist');
  }
  return response.data;
}

export async function getWishlist(userId: number): Promise<WishlistResponse> {
  const response = await apiClient.get<WishlistResponse>(`/wishlist/${userId}`);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch wishlist');
  }
  return response.data;
}

export async function removeFromWishlist(productId: number): Promise<RemoveFromWishlistResponse> {
  const user = getStoredUser();
  if (!user?.id) {
    throw new Error('User not authenticated');
  }
  
  const response = await apiClient.delete<RemoveFromWishlistResponse>('/wishlist/remove', {
    data: { 
      userId: user.id,
      productId 
    },
  });
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to remove from wishlist');
  }
  return response.data;
}

// ==============================
// CHECKOUT API
// ==============================

import type {
  ShippingAddress,
  AddressFormData,
  ShippingFeeRequest,
  ShippingFeeResponse,
  CheckoutRequest,
  CheckoutResponse,
  PaymentStatusResponse,
} from '@/types/checkout';
import type { Order } from '@/types/order';
// ==============================
// DISCOUNTS API (Unified)
// ==============================

export interface DiscountDTO {
  id: number;
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
  usage_count?: number | null;
  is_active: boolean;
}

export interface ValidateCodeResponse {
  valid: boolean;
  reason?: string;
  message?: string;
  discount?: DiscountDTO;
}

export interface ApplyDiscountRequest {
  code?: string;
  orderDraft?: {
    subtotal?: number;
    shipping_fee?: number;
    cart_items?: CartItemForDiscount[];
  };
}

export interface CartItemForDiscount {
  product_variant_id: number;
  quantity: number;
}

export interface ApplyDiscountResponse {
  applied: boolean;
  reason?: string;
  message?: string;
  amount?: number;
  discount?: DiscountDTO;
  snapshot?: {
    discount_code_snapshot?: string | null;
    discount_type_snapshot?: string | null;
    discount_value_snapshot?: number | null;
  };
}

export async function getActiveDiscounts(): Promise<DiscountDTO[]> {
  const res = await apiClient.get<ApiResponse<DiscountDTO[]>>('/discounts/active');
  return unwrapResponse(res.data);
}

export async function validateDiscountCode(code: string, cartItems?: CartItemForDiscount[]): Promise<ValidateCodeResponse> {
  const res = await apiClient.post<ApiResponse<ValidateCodeResponse>>(
    `/discounts/validate/${encodeURIComponent(code)}`,
    { cart_items: cartItems || [] }
  );
  return unwrapResponse(res.data);
}

/**
 * Get cart items from current cart for discount validation
 * Helper function to extract cart items from CartResponse
 */
export async function getCartItemsForDiscount(): Promise<CartItemForDiscount[]> {
  try {
    const cart = await getCart();
    return cart.items.map(item => ({
      product_variant_id: item.product_variant_id,
      quantity: item.quantity,
    }));
  } catch (error) {
    console.error('Failed to get cart items for discount validation:', error);
    return [];
  }
}

export async function applyDiscount(payload: ApplyDiscountRequest): Promise<ApplyDiscountResponse> {
  const res = await apiClient.post<ApiResponse<ApplyDiscountResponse>>('/discounts/apply', payload);
  return unwrapResponse(res.data);
}

/**
 * Apply discount with cart items from current cart
 * This is the recommended way to apply discounts as it includes product eligibility checks
 */
export async function applyDiscountWithCart(code: string): Promise<ApplyDiscountResponse> {
  const cartItems = await getCartItemsForDiscount();
  const cart = await getCart();

  return applyDiscount({
    code,
    orderDraft: {
      subtotal: cart.subtotal_amount || cart.subtotal || 0,
      shipping_fee: 0, // Will be calculated later based on address
      cart_items: cartItems,
    },
  });
}

export async function getMyAddresses(): Promise<ShippingAddress[]> {
  const response = await apiClient.get<ApiResponse<ShippingAddress[]>>('/addresses');
  return unwrapResponse(response.data);
}

export async function createAddress(data: AddressFormData): Promise<ShippingAddress> {
  const response = await apiClient.post<ApiResponse<ShippingAddress>>('/addresses', {
    name: data.name,
    phone: data.phone,
    city: data.city,
    district: data.district,
    ward: data.ward,
    address: data.address,
    is_default: data.is_default,
  });
  return unwrapResponse(response.data);
}

export async function deleteAddress(addressId: number): Promise<void> {
  const response = await apiClient.delete<ApiResponse<void>>(`/addresses/${addressId}`);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to delete address');
  }
}

export async function previewShippingFee(payload: ShippingFeeRequest): Promise<ShippingFeeResponse> {
  const response = await apiClient.post<ApiResponse<ShippingFeeResponse>>('/orders/shipping-fee', payload);
  return unwrapResponse(response.data);
}

// Backward-compatible helper used by existing forms
export async function getShippingFee(
  province_id: string | number,
  district_id: string | number,
  promotionCode?: string,
  city?: string
): Promise<ShippingFeeResponse> {
  return previewShippingFee({ province_id, district_id, city, promotionCode });
}

export async function checkout(data: CheckoutRequest): Promise<CheckoutResponse> {
  const response = await apiClient.post<ApiResponse<CheckoutResponse>>('/orders/checkout', data);
  return unwrapResponse(response.data);
}

export async function getPaymentStatus(orderId: number): Promise<PaymentStatusResponse> {
  const response = await apiClient.get<ApiResponse<PaymentStatusResponse>>(`/orders/${orderId}/payment/status`);
  return unwrapResponse(response.data);
}

export async function getMyOrders(): Promise<Order[]> {
  const response = await apiClient.get<ApiResponse<Order[]>>('/orders');
  return unwrapResponse(response.data);
}
