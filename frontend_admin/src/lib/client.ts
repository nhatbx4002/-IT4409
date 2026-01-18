const API_BASE_URL =
  (import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:3000/api";

const base = (path: string) =>
  `${String(API_BASE_URL).replace(/\/+$/, "")}${
    path.startsWith("/") ? "" : "/"
  }${path}`;

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

const AUTH_STORAGE_KEY = "admin_auth_tokens";

export type StoredAuth = {
  accessToken?: string | null;
  refreshToken?: string | null;
  user?: Record<string, any> | null;
};

export const getStoredAuth = (): StoredAuth | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredAuth;
  } catch (error) {
    console.warn("Failed to parse stored auth", error);
    return null;
  }
};

export const setStoredAuth = (value: StoredAuth) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
};

export const clearStoredAuth = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

function buildHeaders(hasBody: boolean) {
  const auth = getStoredAuth();
  const token = auth?.accessToken;

  return {
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function http<T = any>(
  method: HttpMethod,
  path: string,
  body?: unknown,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(base(path), {
    method,
    headers: {
      ...buildHeaders(Boolean(body)),
      ...(init?.headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
    ...init,
  });

  const data = await res.json().catch(() => ({}));
  const payload = (data?.data ?? data) as T;

  if (!res.ok || data?.success === false) {
    throw new Error(data?.message || "Request failed");
  }

  return payload;
}

export const apiBaseUrl = API_BASE_URL;
export const buildApiUrl = base;

