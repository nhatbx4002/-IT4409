import { apiClient } from "./api";

export type ProductStatus = "active" | "inactive" | "draft";

export type ProductVariant = {
  id: number;
  product_id?: number;
  color?: string | null;
  size?: string | null;
  sku?: string | null;
  price?: number | string | null;
  stock_quantity?: number | null;
  image_url?: string | null;
};

export type Product = {
  id: number;
  name: string;
  slug?: string;
  description?: string | null;
  brand?: string | null;
  base_price?: number | string | null;
  sale_price?: number | string | null;
  status?: ProductStatus;
  category_id?: number | null;
  collection?: string | null;
  is_new?: boolean;
  images?: string[];
  variants?: ProductVariant[];
  tags?: string[];
  minPrice?: number | string | null;
  maxPrice?: number | string | null;
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

export type ListProductParams = {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  status?: ProductStatus;
};

export type CreateProductPayload = {
  name: string;
  description?: string | null;
  base_price: number;
  sale_price?: number | null;
  brand?: string | null;
  category_id: number;
  collection?: string | null;
  status?: ProductStatus;
  is_new?: boolean;
  tags?: string[];
  images?: (File | string)[];
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

export type CreateVariantPayload = {
  color?: string | null;
  size?: string | null;
  sku?: string | null;
  price: number;
  stock_quantity?: number;
  image_url?: File | string | null;
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

const buildFormData = (fields: Record<string, any>): FormData => {
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item === undefined || item === null) return;
        formData.append(`${key}[]`, item as any);
      });
    } else {
      formData.append(key, value as any);
    }
  });
  return formData;
};

export async function listProducts(params: ListProductParams = {}): Promise<PaginatedResponse<Product>> {
  const query: Record<string, any> = {};
  if (params.page) query.page = params.page;
  if (params.limit) query.limit = params.limit;
  if (params.search) query.search = params.search;
  if (params.categoryId) query.category_id = params.categoryId;
  if (params.status) query.status = params.status;

  const res = await apiClient.get<ApiEnvelope<{ items?: Product[]; products?: Product[]; data?: Product[] }>>(
    "/admin/products",
    { params: query }
  );

  const data = unwrap(res.data);
  const items = (data as any)?.items ?? (data as any)?.products ?? (data as any)?.data ?? [];
  const pagination = res.data?.pagination;

  return {
    items,
    pagination,
  };
}

export async function getProductById(id: number | string): Promise<Product> {
  const res = await apiClient.get<ApiEnvelope<Product>>(`/admin/products/${id}`);
  return unwrap(res.data);
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { images, ...rest } = payload;
  const formData = buildFormData(rest as Record<string, any>);

  if (images && images.length) {
    images.forEach((img) => formData.append("images", img));
  }

  const res = await apiClient.post<ApiEnvelope<Product>>("/admin/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res.data);
}

export async function updateProduct(id: number | string, payload: UpdateProductPayload): Promise<Product> {
  const { images, ...rest } = payload;
  const formData = buildFormData(rest as Record<string, any>);

  if (images) {
    images.forEach((img) => formData.append("images", img));
  }

  const res = await apiClient.patch<ApiEnvelope<Product>>(`/admin/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return unwrap(res.data);
}

export async function deleteProduct(id: number | string): Promise<void> {
  const res = await apiClient.delete<ApiEnvelope<unknown>>(`/admin/products/${id}`);
  unwrap(res.data);
}

export async function createProductVariant(
  productId: number | string,
  payload: CreateVariantPayload
): Promise<ProductVariant> {
  const formData = buildFormData(payload as Record<string, any>);
  const res = await apiClient.post<ApiEnvelope<ProductVariant>>(
    `/admin/products/${productId}/variants`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return unwrap(res.data);
}

