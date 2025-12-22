import { useState, useEffect, useCallback } from 'react';
import { signIn, signOut, getCurrentUser, type User, type AuthResult } from '../lib/auth';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  clearError: () => void;
}

/**
 * Authentication hook for admin dashboard
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const checkAuth = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const currentUser = await getCurrentUser();

        if (mounted) {
          setUser(currentUser);
        }
      } catch (err: any) {
        console.error('Auth check failed:', err);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const result: AuthResult = await signIn(email, password);

      setUser(result.user);
      return true;

    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Login failed';
      setError(errorMessage);
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      await signOut();
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setError(null);
      setIsLoading(false);
    }
  }, []);

  const refreshUser = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err: any) {
      const errorMessage = err?.response?.status === 401
        ? 'Session expired. Please login again.'
        : err?.message || 'Failed to refresh user data';

      setError(errorMessage);
      setUser(null);

      if (err?.response?.status === 401) {
        await signOut();
      }
    }
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const isAuthenticated = Boolean(user);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    refreshUser,
    clearError,
  };
}