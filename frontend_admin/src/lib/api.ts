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

    // Handle 403 Forbidden responses
    if (status === 403) {
      // Clear tokens and redirect to login with admin access message
      clearTokens();
      setStoredUser(null);
      if (typeof window !== 'undefined') {
        window.location.href = '/login?error=admin_required';
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
