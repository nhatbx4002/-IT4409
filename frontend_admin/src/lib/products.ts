import { adminApiClient, getPaginatedAdminData } from "./api";

export type ProductStatus = "active" | "inactive" | "draft";

export type ProductVariant = {
  id: number;
  product_id?: number;
  color?: string | null;
  size?: string | null;
  sku?: string | null;
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
  const queryParams: any = {};
  if (params.page) queryParams.page = params.page;
  if (params.limit) queryParams.limit = params.limit;
  if (params.search) queryParams.search = params.search;
  if (params.categoryId) queryParams.category_id = params.categoryId;
  if (params.status) queryParams.status = params.status;

  return getPaginatedAdminData<Product>("/products", queryParams);
}

export async function getProductById(id: number | string): Promise<Product> {
  const res = await adminApiClient.get<Product>(`/products/${id}`);
  return res.data;
}

export async function createProduct(payload: CreateProductPayload): Promise<Product> {
  const { images, ...rest } = payload;
  const formData = buildFormData(rest as Record<string, any>);

  if (images && images.length) {
    images.forEach((img) => formData.append("images", img));
  }

  const res = await adminApiClient.post<Product>("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateProduct(id: number | string, payload: UpdateProductPayload): Promise<Product> {
  const { images, ...rest } = payload;
  const formData = buildFormData(rest as Record<string, any>);

  if (images) {
    images.forEach((img) => formData.append("images", img));
  }

  const res = await adminApiClient.patch<Product>(`/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteProduct(id: number | string): Promise<void> {
  await adminApiClient.delete(`/products/${id}`);
}

export async function getBrands(): Promise<string[]> {
  const res = await adminApiClient.get<string[]>("/product-management/brands");
  return res.data;
}

export async function createProductVariant(
  productId: number | string,
  payload: CreateVariantPayload
): Promise<ProductVariant> {
  const formData = buildFormData(payload as Record<string, any>);
  const res = await adminApiClient.post<ProductVariant>(
    `/products/${productId}/variants`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
}

export async function deleteProductVariant(
  productId: number | string,
  variantId: number | string
): Promise<void> {
  await adminApiClient.delete(`/products/${productId}/variants/${variantId}`);
}

export async function updateProductVariant(
  productId: number | string,
  variantId: number | string,
  payload: Partial<CreateVariantPayload>
): Promise<ProductVariant> {
  const formData = buildFormData(payload as Record<string, any>);
  const res = await adminApiClient.patch<ProductVariant>(
    `/products/${productId}/variants/${variantId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return res.data;
}

/**
 * Calculate the price range for a product based on its variants
 * @param product - The product object with variants
 * @returns Object with minPrice, maxPrice, and display string
 */
export function getProductPriceRange(product: Product): {
  minPrice: number;
  maxPrice: number;
  hasVariants: boolean;
  displayPrice: string;
} {
  const hasVariants = product.variants && product.variants.length > 0;

  // Use product base_price since variants no longer have individual prices
  const basePrice = Number(product.base_price) || 0;
  const salePrice = Number(product.sale_price) || null;

  // Use pre-calculated min/max if available
  if (product.minPrice && product.maxPrice) {
    const min = Number(product.minPrice);
    const max = Number(product.maxPrice);
    const displayPrice = salePrice && salePrice < min
      ? formatCurrencyHelper(salePrice)
      : min === max
      ? formatCurrencyHelper(min)
      : `${formatCurrencyHelper(min)} - ${formatCurrencyHelper(max)}`;

    return {
      minPrice: min,
      maxPrice: max,
      hasVariants: true,
      displayPrice,
    };
  }

  // All variants share the same product-level pricing
  return {
    minPrice: salePrice || basePrice,
    maxPrice: basePrice,
    hasVariants: true,
    displayPrice: salePrice
      ? `${formatCurrencyHelper(salePrice)}`
      : formatCurrencyHelper(basePrice),
  };
}

/**
 * Format currency in VND (Vietnamese Dong)
 */
function formatCurrencyHelper(value: number | string | null | undefined): string {
  if (value === null || value === undefined) return '₫0';
  const numeric = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(numeric)) return '₫0';
  return numeric.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });
}
