import { useState, useCallback } from 'react';
import { adminApiClient, getApiErrorMessage } from '@/lib/api';

interface MutationOptions<TData, TVariables> {
  onSuccess?: (data: TData) => void;
  onError?: (error: string) => void;
  onSettled?: () => void;
}

interface MutationState<TData> {
  data: TData | null;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export function useApiMutation<TData = any, TVariables = any>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: MutationOptions<TData, TVariables> = {}
): MutationState<TData> & { mutate: (variables: TVariables) => Promise<TData> } {
  const [state, setState] = useState<{
    data: TData | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null
  });

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  const mutate = useCallback(async (variables: TVariables): Promise<TData> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const data = await mutationFn(variables);
      setState({ data, loading: false, error: null });
      options.onSuccess?.(data);
      return data;
    } catch (error) {
      const errorMessage = getApiErrorMessage(error);
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      options.onError?.(errorMessage);
      throw error;
    } finally {
      options.onSettled?.();
    }
  }, [mutationFn, options]);

  return {
    ...state,
    mutate,
    reset
  };
}

// Specific hooks for common mutations
export function useUpdateOrderStatus() {
  return useApiMutation(
    async ({ orderId, status }: { orderId: number | string; status: string }) => {
      const res = await adminApiClient.patch(`/orders/${orderId}`, { status });
      return res.data;
    },
    {
      onSuccess: () => {
        // You could add toast notifications here
        console.log('Order status updated successfully');
      }
    }
  );
}

export function useUpdateUserRole() {
  return useApiMutation(
    async ({ userId, role }: { userId: number | string; role: string }) => {
      const res = await adminApiClient.patch(`/users/${userId}/role`, { role });
      return res.data;
    }
  );
}

export function useToggleUserLock() {
  return useApiMutation(
    async ({ userId, isLocked }: { userId: number | string; isLocked: boolean }) => {
      const res = await adminApiClient.patch(`/users/${userId}/lock`, { is_locked: isLocked });
      return res.data;
    }
  );
}

export function useProcessRefund() {
  return useApiMutation(
    async ({ orderId, reason, amount }: {
      orderId: number | string;
      reason: string;
      amount: number
    }) => {
      const res = await adminApiClient.post(`/orders/${orderId}/refund`, { reason, amount });
      return res.data;
    }
  );
}