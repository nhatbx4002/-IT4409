import { signOut as apiSignOut } from './api';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
};

const TOKEN_KEY = 'access_token';
const USER_KEY = 'auth_user';

/**
 * Lấy user từ localStorage
 */
export const getUser = (): AuthUser | null => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

/**
 * Kiểm tra user đã đăng nhập chưa
 */
export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem(TOKEN_KEY) && !!getUser();
};

/**
 * Lấy access token từ localStorage
 */
export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Lưu authentication data (token và user) vào localStorage
 */
export const setAuth = (token: string, user: AuthUser): void => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

/**
 * Đăng xuất - gọi API và clear localStorage
 */
export const logout = async (): Promise<void> => {
  try {
    const token = getToken();
    if (token) {
      await apiSignOut();
    }
  } catch (error) {
    console.error('Error during logout:', error);
    // Continue with clearing localStorage even if API call fails
  } finally {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

