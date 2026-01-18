import axios, { type AxiosError, type AxiosInstance } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  refreshTokens,
  setStoredUser,
} from "./auth";

export const API_BASE_URL =
  import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000/api";

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshingPromise: Promise<any> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest: any = error.config;

    // Handle 403 Forbidden responses - Admin access required
    if (status === 403) {
      const errorData = error.response?.data as any;
      if (errorData?.message?.includes('admin') || errorData?.message?.includes('role')) {
        clearTokens();
        setStoredUser(null);
        if (typeof window !== 'undefined') {
          window.location.href = '/login?error=admin_required';
        }
      }
      return Promise.reject(error);
    }

    if (status !== 401) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken || originalRequest?._retry) {
      clearTokens();
      setStoredUser(null);
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;

      if (!refreshingPromise) {
        refreshingPromise = refreshTokens();
      }

      const refreshed = await refreshingPromise;
      refreshingPromise = null;

      if (refreshed?.accessToken) {
        setTokens(refreshed.accessToken, refreshed.refreshToken ?? refreshToken);
        if (refreshed.user) {
          setStoredUser(refreshed.user);
        }
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`;
        return apiClient(originalRequest);
      }

      clearTokens();
      setStoredUser(null);
      return Promise.reject(error);
    } catch (refreshError) {
      refreshingPromise = null;
      clearTokens();
      setStoredUser(null);
      return Promise.reject(refreshError);
    }
  }
);

/**
 * Admin-specific API client for /api/admin/* routes
 */
export const adminApiClient: AxiosInstance = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

adminApiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Share the same response interceptor logic for consistency
adminApiClient.interceptors.response.use(
  (response) => {
    // Unwrap the standard API response format: { success: true, data: {...}, message: "..." }
    const data = response.data;
    if (data && typeof data === 'object' && 'data' in data && data.success) {
      response.data = data.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest: any = error.config;

    // Handle 403 Forbidden - Admin role required
    if (status === 403) {
      const errorData = error.response?.data as any;
      if (errorData?.message?.includes('admin') || errorData?.message?.includes('role') || errorData?.message?.includes('privilege')) {
        clearTokens();
        setStoredUser(null);
        if (typeof window !== 'undefined') {
          window.location.href = '/login?error=admin_required';
        }
      }
      return Promise.reject(error);
    }

    if (status !== 401) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken || originalRequest?._retry) {
      clearTokens();
      setStoredUser(null);
      return Promise.reject(error);
    }

    try {
      originalRequest._retry = true;

      if (!refreshingPromise) {
        refreshingPromise = refreshTokens();
      }

      const refreshed = await refreshingPromise;
      refreshingPromise = null;

      if (refreshed?.accessToken) {
        setTokens(refreshed.accessToken, refreshed.refreshToken ?? refreshToken);
        if (refreshed.user) {
          setStoredUser(refreshed.user);
        }
        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${refreshed.accessToken}`;
        return adminApiClient(originalRequest);
      }

      clearTokens();
      setStoredUser(null);
      return Promise.reject(error);
    } catch (refreshError) {
      refreshingPromise = null;
      clearTokens();
      setStoredUser(null);
      return Promise.reject(refreshError);
    }
  }
);

/**
 * Helper function for multipart/form-data requests (file uploads)
 */
export const createFormDataRequest = (data: Record<string, any>, files?: { field: string; file: File }[]) => {
  const formData = new FormData();

  // Add regular fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, String(value));
    }
  });

  // Add files
  if (files) {
    files.forEach(({ field, file }) => {
      formData.append(field, file);
    });
  }

  return formData;
};

/**
 * Helper for paginated admin requests
 */
export const getPaginatedAdminData = async <T>(
  endpoint: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortDir?: 'ASC' | 'DESC';
    status?: string;
    startDate?: string;
    endDate?: string;
    [key: string]: any;
  } = {}
) => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, String(value));
    }
  });

  const url = queryParams.toString() ? `${endpoint}?${queryParams.toString()}` : endpoint;

  const response = await adminApiClient.get<{
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages?: number;
    };
  }>(url);

  return response.data;
};

/**
 * Error helper to extract user-friendly messages
 */
export const getApiErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};
