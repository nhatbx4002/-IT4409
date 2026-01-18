import { useState, useEffect, useCallback } from 'react';
import { adminApiClient, getPaginatedAdminData, getApiErrorMessage } from '../lib/api';

/**
 * Generic hook for fetching admin data with loading and error states
 */
export function useAdminData<T>(
  endpoint: string,
  params: Record<string, any> = {},
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (endpoint.includes('page=') || endpoint.includes('?')) {
        // Custom endpoint with params
        const response = await adminApiClient.get<T>(endpoint);
        setData(response.data);
      } else {
        // Use paginated helper
        const result = await getPaginatedAdminData<T>(endpoint, params);
        setData(result as T);
      }
    } catch (err: any) {
      setError(getApiErrorMessage(err));
      console.error(`Failed to fetch data from ${endpoint}:`, err);
    } finally {
      setLoading(false);
    }
  }, [endpoint, JSON.stringify(params)]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook for dashboard statistics
 */
export function useDashboardStats() {
  return useAdminData<{
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    pendingOrders: number;
    monthlyGrowth: number;
  }>('/dashboard/stats');
}

/**
 * Hook for revenue data with date filtering
 */
export function useRevenueData(params: {
  from?: string;
  to?: string;
  groupBy?: 'day' | 'month';
} = {}) {
  return useAdminData<Array<{ period: string; revenue: number }>>(
    '/dashboard/revenue',
    params,
    [params.from, params.to, params.groupBy]
  );
}

/**
 * Hook for recent orders
 */
export function useRecentOrders(limit = 10) {
  return useAdminData('/dashboard/recent-orders', { limit });
}

/**
 * Hook for best selling products
 */
export function useBestSellers(params: { limit?: number; from?: string; to?: string } = {}) {
  return useAdminData('/dashboard/best-sellers', params);
}

/**
 * Hook for admin products with pagination and filtering
 */
export function useAdminProducts(params: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  category?: number;
} = {}) {
  const [currentPage, setCurrentPage] = useState(params.page || 1);
  const [searchTerm, setSearchTerm] = useState(params.search || '');

  const { data, loading, error, refetch } = useAdminData<{
    items: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages?: number;
    };
  }>('/products', {
    ...params,
    page: currentPage,
    search: searchTerm,
  }, [currentPage, searchTerm]);

  const handleSearch = useCallback((search: string) => {
    setSearchTerm(search);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    products: data?.items || [],
    pagination: data?.pagination,
    loading,
    error,
    currentPage,
    searchTerm,
    handleSearch,
    handlePageChange,
    refetch,
  };
}

/**
 * Hook for admin orders with filtering
 */
export function useAdminOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
} = {}) {
  return useAdminData<{
    items: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages?: number;
    };
  }>('/orders', params);
}

/**
 * Hook for admin users management
 */
export function useAdminUsers(params: {
  page?: number;
  limit?: number;
  search?: string;
} = {}) {
  return useAdminData<{
    items: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages?: number;
    };
  }>('/users', params);
}

/**
 * Hook for admin discounts management
 */
export function useAdminDiscounts() {
  return useAdminData<any[]>('/discounts');
}