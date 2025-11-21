const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

interface ApiError {
  success: false;
  message: string;
  error?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
}

/**
 * API Client function với error handling
 */
async function apiClient<T extends ApiResponse>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data: T | ApiError = await response.json();

    if (!response.ok) {
      const errorMessage = 
        (data as ApiError).message || 
        (data as ApiError).error || 
        `Request failed with status ${response.status}`;
      throw new Error(errorMessage);
    }

    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error, please try again');
  }
}

/**
 * API Client với authentication token
 */
async function authenticatedApiClient<T extends ApiResponse>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('access_token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  return apiClient<T>(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}

// ==============================
// AUTH API FUNCTIONS
// ==============================

export interface SignUpData {
  email: string;
  full_name: string;
  password: string;
  phone?: string;
}

export interface SignUpResponse {
  success: true;
  message: string;
  user: {
    id: number;
    email: string;
    full_name: string;
    phone?: string;
    role: string;
    provider: string;
  };
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignInResponse {
  success: true;
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    email: string;
    full_name: string;
  };
}

export interface SendOTPResponse {
  success: true;
  message: string;
}

export interface VerifyOTPResponse {
  success: true;
  message: string;
  token: string;
}

export interface ResetPasswordResponse {
  success: true;
  message: string;
}

export interface SignOutResponse {
  success: true;
  message: string;
}

/**
 * Đăng ký tài khoản mới
 */
export async function signUp(data: SignUpData): Promise<SignUpResponse> {
  return apiClient<SignUpResponse>('/signUp', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Đăng nhập
 */
export async function signIn(email: string, password: string): Promise<SignInResponse> {
  return apiClient<SignInResponse>('/signIn', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Đăng xuất
 */
export async function signOut(): Promise<SignOutResponse> {
  return authenticatedApiClient<SignOutResponse>('/signOut', {
    method: 'GET',
  });
}

/**
 * Gửi OTP để reset password
 */
export async function sendOTP(email: string): Promise<SendOTPResponse> {
  return apiClient<SendOTPResponse>('/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

/**
 * Xác thực OTP
 */
export async function verifyOTP(email: string, otp: string): Promise<VerifyOTPResponse> {
  return apiClient<VerifyOTPResponse>('/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, otp }),
  });
}

/**
 * Reset password với token từ verifyOTP
 */
export async function resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
  return apiClient<ResetPasswordResponse>('/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

/**
 * Đăng nhập bằng Google - redirect đến OAuth endpoint
 */
export function signInWithGoogle(): void {
  window.location.href = `${API_BASE_URL}/google`;
}

/**
 * Đăng nhập bằng Facebook - redirect đến OAuth endpoint
 */
export function signInWithFacebook(): void {
  window.location.href = `${API_BASE_URL}/facebook`;
}

