import { apiClient, adminApiClient } from "./api";

export type Category = {
  id: number;
  name: string;
  slug?: string;
  parent_id?: number | null;
  level?: number;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
  children?: Category[];
};

export type CreateCategoryPayload = {
  name: string;
  slug?: string;
  parent_id?: number | null;
};

type ApiEnvelope<T> = {
  success?: boolean;
  data?: T;
  message?: string;
};

const unwrap = <T>(response: any): T => {
  // The backend returns { success: true, data: [...] }
  if (response && typeof response === 'object' && 'success' in response) {
    if (response.success === false) {
      throw new Error(response.message || "Request failed");
    }
    return response.data as T;
  }
  return response as T;
};

/**
 * Fetch all categories as a tree structure
 * Calls GET /api/categories (public endpoint)
 */
export async function getCategories(): Promise<Category[]> {
  const res = await apiClient.get<{ success: boolean; data: Category[] }>("/categories");
  return unwrap<Category[]>(res.data);
}

/**
 * Fetch a single category by slug
 * Calls GET /api/categories/:slug (public endpoint)
 */
export async function getCategoryBySlug(slug: string): Promise<Category> {
  const res = await apiClient.get<{ success: boolean; data: Category }>(`/categories/${slug}`);
  return unwrap<Category>(res.data);
}

/**
 * Create a new category
 * Calls POST /api/admin/categories (admin endpoint)
 *
 * Backend requires:
 * - name: string (required)
 * - slug: string (optional, auto-generated if not provided)
 * - parent_id: number (optional, for subcategories)
 */
export async function createCategory(payload: CreateCategoryPayload): Promise<Category> {
  const res = await adminApiClient.post<{ success: boolean; data: Category }>("/categories", payload);
  return unwrap<Category>(res.data);
}

/**
 * Helper to flatten category tree for select dropdowns
 */
export function flattenCategories(categories: Category[]): Category[] {
  const result: Category[] = [];

  function flatten(category: Category) {
    result.push(category);
    if (category.children && category.children.length > 0) {
      category.children.forEach(flatten);
    }
  }

  categories.forEach(flatten);
  return result;
}
