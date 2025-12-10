/**
 * Authentication hooks using React Query
 * Provides login, register, logout, and current user management
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login as loginService, register as registerService, logout as logoutService, getCurrentUser, setToken, getToken } from '@/services/auth.service';
import { queryKeys } from '@/lib/query-keys';
import type { User, UserCreate, UserLogin, LoginResponse } from '@/types/api';
import { ApiClientError } from '@/lib/api-client';

/**
 * Hook to get current authenticated user
 * Automatically refetches when token changes
 */
export function useCurrentUser() {
  const token = getToken();
  
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: getCurrentUser,
    enabled: !!token, // Only fetch if token exists
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry on 401 (unauthorized)
      if (error instanceof ApiClientError && error.status === 401) {
        // Clear invalid token
        setToken(null);
        return false;
      }
      return failureCount < 2;
    },
  });
}

/**
 * Hook for user login
 * Returns mutation with loading, error, and success states
 */
export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: UserLogin): Promise<LoginResponse> => {
      return await loginService(data);
    },
    onSuccess: async (response) => {
      // Invalidate and refetch user data
      await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me });
      
      // Optionally redirect (can be handled by component)
      // router.push('/dashboard');
    },
    onError: (error: ApiClientError) => {
      // Error is automatically available in mutation.error
      console.error('Login failed:', error);
    },
  });
}

/**
 * Hook for user registration
 * Returns mutation with loading, error, and success states
 */
export function useRegister() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: UserCreate): Promise<User> => {
      return await registerService(data);
    },
    onSuccess: async (user) => {
      // After registration, user can login
      // Optionally auto-login or redirect to login page
      // router.push('/auth?registered=true');
    },
    onError: (error: ApiClientError) => {
      console.error('Registration failed:', error);
    },
  });
}

/**
 * Hook for user logout
 * Clears token and invalidates all queries
 */
export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: logoutService,
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
      
      // Remove token
      setToken(null);
      
      // Redirect to login
      router.push('/auth');
    },
    onError: (error) => {
      // Even if server logout fails, clear client-side data
      console.error('Logout error:', error);
      queryClient.clear();
      setToken(null);
      router.push('/auth');
    },
  });
}

/**
 * Combined auth hook that provides all auth functionality
 * Convenience hook for components that need multiple auth features
 */
export function useAuth() {
  const currentUser = useCurrentUser();
  const login = useLogin();
  const register = useRegister();
  const logout = useLogout();

  return {
    user: currentUser.data,
    isLoading: currentUser.isLoading,
    isAuthenticated: !!currentUser.data && !!getToken(),
    login,
    register,
    logout,
    refetchUser: currentUser.refetch,
  };
}

