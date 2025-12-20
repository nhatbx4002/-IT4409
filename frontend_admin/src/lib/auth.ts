import axios from "axios";

export type User = {
  id: number;
  email: string;
  name?: string | null;
  full_name?: string | null;
  role?: string | null;
};

export type AuthResult = {
  user: User;
  accessToken: string;
  refreshToken?: string | null;
};

const API_BASE_URL = import.meta.env?.VITE_API_BASE_URL || "http://localhost:3000/api";

const ACCESS_TOKEN_KEY = "admin_access_token";
const REFRESH_TOKEN_KEY = "admin_refresh_token";
const USER_KEY = "admin_user";

const isBrowser = typeof window !== "undefined";

export const setTokens = (accessToken: string, refreshToken?: string | null) => {
  if (!isBrowser) return;
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
};

export const getAccessToken = (): string | null => {
  if (!isBrowser) return null;
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  if (!isBrowser) return null;
  return window.localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const clearTokens = () => {
  if (!isBrowser) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const setStoredUser = (user: User | null) => {
  if (!isBrowser) return;
  if (user) {
    window.localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(USER_KEY);
  }
};

export const getStoredUser = (): User | null => {
  if (!isBrowser) return null;
  const raw = window.localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
};

const authHttp = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const res = await authHttp.post<any>(`${API_BASE_URL}/auth/signIn`, {
    email,
    password,
    isAdminLogin: true  // Specify this is admin login
  });
  // Backend wraps response in { success, message, data: { user, accessToken, refreshToken } }
  const responseData = res.data?.data || res.data;
  const payload: AuthResult = {
    user: responseData.user,
    accessToken: responseData.accessToken,
    refreshToken: responseData.refreshToken
  };
  
  if (payload?.accessToken && payload?.user) {
    setTokens(payload.accessToken, payload.refreshToken ?? undefined);
    setStoredUser(payload.user);
  }
  return payload;
}

export async function signOut(): Promise<void> {
  try {
    await authHttp.post(`${API_BASE_URL}/auth/logout`);
  } catch (error) {
    // Allow sign out even if server call fails
  } finally {
    clearTokens();
    setStoredUser(null);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const accessToken = getAccessToken();
    const res = await authHttp.get<User>(`${API_BASE_URL}/auth/me`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
    const user = (res.data as any)?.data ?? res.data ?? null;
    setStoredUser(user);
    return user;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      setStoredUser(null);
      return null;
    }
    throw error;
  }
}

export async function refreshTokens() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  const res = await authHttp.post<AuthResult>(`${API_BASE_URL}/auth/refresh`, { refreshToken });
  const payload = res.data;
  if (payload?.accessToken) {
    setTokens(payload.accessToken, payload.refreshToken ?? refreshToken);
  }
  return payload;
}
