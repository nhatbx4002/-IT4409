import { adminApiClient, getPaginatedAdminData } from "./api";

export type Role = "ADMIN" | "CUSTOMER" | "SUPER_ADMIN" | "customer" | "admin" | "super_admin";

export type User = {
  id: number;
  name?: string | null;
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
  const queryParams: Record<string, any> = {};
  if (params.page) queryParams.page = params.page;
  if (params.limit) queryParams.limit = params.limit;
  if (params.search) queryParams.search = params.search;
  if (params.role) queryParams.role = params.role;
  if (typeof params.isLocked === "boolean") queryParams.is_locked = params.isLocked;

  return getPaginatedAdminData<User>("/users", queryParams);
}

export async function getUserById(id: number | string): Promise<User> {
  const res = await adminApiClient.get<User>(`/users/${id}`);
  return res.data;
}

export async function updateUserRole(id: number | string, role: Role): Promise<User> {
  const res = await adminApiClient.patch<User>(`/users/${id}/role`, { role });
  return res.data;
}

export async function lockUser(id: number | string, isLocked: boolean): Promise<User> {
  const res = await adminApiClient.patch<User>(`/users/${id}/lock`, { is_locked: isLocked });
  return res.data;
}

export async function deleteUser(id: number | string): Promise<void> {
  await adminApiClient.delete(`/users/${id}`);
}

