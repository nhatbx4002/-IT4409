import { apiClient } from "./api";

export type Role = "ADMIN" | "CUSTOMER" | "SUPER_ADMIN" | "customer" | "admin" | "super_admin";

export type User = {
  id: number;
  name?: string | null;
  full_name?: string | null;
  email: string;
  phone?: string | null;
  role?: Role;
  is_locked?: boolean;
  created_at?: string;
  updated_at?: string;
  last_login_at?: string | null;
};

export type Pagination = {
  page: number;
  limit: number;
  total?: number;
  totalPages?: number;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination?: Pagination;
};

export type ListUserParams = {
  page?: number;
  limit?: number;
  search?: string;
  role?: Role;
  isLocked?: boolean;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
  pagination?: Pagination;
};

const unwrap = <T>(payload: ApiEnvelope<T> | T): T => {
  if ((payload as ApiEnvelope<T>)?.success === false) {
    throw new Error((payload as ApiEnvelope<T>)?.message || "Request failed");
  }
  if (typeof payload === "object" && payload !== null && "data" in (payload as any)) {
    return (payload as ApiEnvelope<T>).data as T;
  }
  return payload as T;
};

export async function listUsers(params: ListUserParams = {}): Promise<PaginatedResponse<User>> {
  const query: Record<string, any> = {};
  if (params.page) query.page = params.page;
  if (params.limit) query.limit = params.limit;
  if (params.search) query.search = params.search;
  if (params.role) query.role = params.role;
  if (typeof params.isLocked === "boolean") query.is_locked = params.isLocked;

  const res = await apiClient.get<ApiEnvelope<{ users?: User[]; items?: User[]; data?: User[] }>>(
    "/admin/users",
    { params: query }
  );

  const data = unwrap(res.data);
  const items = (data as any)?.users ?? (data as any)?.items ?? (data as any)?.data ?? [];
  const pagination = res.data?.pagination;

  return {
    items,
    pagination,
  };
}

export async function getUserById(id: number | string): Promise<User> {
  const res = await apiClient.get<ApiEnvelope<User>>(`/admin/users/${id}`);
  return unwrap(res.data);
}

export async function updateUserRole(id: number | string, role: Role): Promise<User> {
  const res = await apiClient.patch<ApiEnvelope<User>>(`/admin/users/${id}/role`, { role });
  return unwrap(res.data);
}

export async function lockUser(id: number | string, isLocked: boolean): Promise<User> {
  const res = await apiClient.patch<ApiEnvelope<User>>(`/admin/users/${id}/lock`, { is_locked: isLocked });
  return unwrap(res.data);
}

export async function deleteUser(id: number | string): Promise<void> {
  const res = await apiClient.delete<ApiEnvelope<unknown>>(`/admin/users/${id}`);
  unwrap(res.data);
}

