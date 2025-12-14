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
import { clearAuthSession, getAccessToken, getStoredUser } from './auth';

const getApiBaseUrl = (): string => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (!envUrl || typeof envUrl !== 'string' || envUrl.trim() === '') {
    return 'http://localhost:3000/api';
  }
  return envUrl.trim();
};

const API_BASE_URL = getApiBaseUrl();
const normalizeBaseUrl = (url: string): string => url.replace(/\/+$/, '');
const API_BASE_URL_NORMALIZED = normalizeBaseUrl(API_BASE_URL);

const redirectToLogin = () => {
  clearAuthSession();
  window.location.href = '/login';
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
  (error: AxiosError<ApiErrorResponse>) => {
    const status = error.response?.status;
    if (status === 401) {
      redirectToLogin();
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Network error';

    return Promise.reject(new Error(message));
  }
);

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
  full_name: string;
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
  return getRequest<ProductsListResponse>('/user/products/search', {
    params: buildFilterParams(filters),
  });
}

export async function getProductsByCategory(
  categorySlug: string,
  filters?: Omit<ProductFilterParams, 'categorySlug'>
): Promise<ProductsListResponse> {
  return getRequest<ProductsListResponse>(`/user/products/category/${categorySlug}`, {
    params: buildFilterParams(filters),
  });
}

export async function getProductById(productId: number): Promise<ProductDetail> {
  return getRequest<ProductDetail>(`/user/products/${productId}`);
}

export async function searchProducts(
  query: string,
  filters?: Omit<ProductFilterParams, 'q'>
): Promise<ProductsListResponse> {
  return getRequest<ProductsListResponse>('/user/products/search', {
    params: buildFilterParams({ ...filters, q: query }),
  });
}

// ==============================
// CART API
// ==============================

export async function addToCart(
  productVariantId: number,
  quantity: number
): Promise<AddToCartResponse> {
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

export async function updateCartItem(
  cartItemId: number,
  quantity: number
): Promise<UpdateCartItemResponse> {
  const response = await apiClient.put<{ success: boolean; message?: string; item: UpdateCartItemResponse }>(
    `/cart/${cartItemId}`,
    { quantity }
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

