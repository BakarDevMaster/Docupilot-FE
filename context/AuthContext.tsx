'use client';

/**
 * Authentication Context Provider
 * Manages user authentication state, token, and provides auth methods throughout the app
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser, useLogin, useRegister, useLogout } from '@/hooks/useAuth';
import { getToken, setToken } from '@/services/auth.service';
import type { User, UserCreate, UserLogin } from '@/types/api';

interface AuthContextType {
  // User state
  user: User | null | undefined;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Auth methods
  login: ReturnType<typeof useLogin>;
  register: ReturnType<typeof useRegister>;
  logout: ReturnType<typeof useLogout>;
  
  // Utilities
  refetchUser: () => void;
  checkAuth: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Get current user - this will only fetch if token exists
  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchUser,
  } = useCurrentUser();
  
  // Auth mutations
  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const logoutMutation = useLogout();
  
  // Check if user is authenticated
  const isAuthenticated = !!user && !!getToken();
  
  // Initialize: Check for existing token on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      // Token exists, user query will automatically fetch
      // Just mark as initialized
      setIsInitialized(true);
    } else {
      // No token, mark as initialized immediately
      setIsInitialized(true);
    }
  }, []);
  
  // Check authentication status
  const checkAuth = useCallback(() => {
    return !!getToken() && !!user;
  }, [user]);
  
  // Enhanced login with automatic user fetch
  const enhancedLogin = {
    ...loginMutation,
    mutate: (data: UserLogin, options?: any) => {
      const originalOnSuccess = options?.onSuccess;
      loginMutation.mutate(data, {
        ...options,
        onSuccess: async (response: any, variables: any, context: any) => {
          // After successful login, refetch user to ensure we have latest data
          await refetchUser();
          // Call original onSuccess if provided
          if (originalOnSuccess) {
            originalOnSuccess(response, variables, context);
          }
        },
      });
    },
    mutateAsync: async (data: UserLogin) => {
      const response = await loginMutation.mutateAsync(data);
      // Refetch user after login
      await refetchUser();
      return response;
    },
  };
  
  // Enhanced register with optional auto-login
  const enhancedRegister = {
    ...registerMutation,
    mutate: (data: UserCreate, options?: any) => {
      const originalOnSuccess = options?.onSuccess;
      registerMutation.mutate(data, {
        ...options,
        onSuccess: (user: any, variables: any, context: any) => {
          // Registration successful - user can now login
          // Optionally redirect to login page with success message
          if (originalOnSuccess) {
            originalOnSuccess(user, variables, context);
          }
        },
      });
    },
  };
  
  // Enhanced logout with cleanup
  const enhancedLogout = {
    ...logoutMutation,
    mutate: (options?: any) => {
      const originalOnSuccess = options?.onSuccess;
      logoutMutation.mutate(undefined, {
        ...options,
        onSuccess: () => {
          // Additional cleanup if needed
          if (originalOnSuccess) {
            originalOnSuccess();
          }
        },
      });
    },
  };
  
  // Don't render children until we've checked for existing token
  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-sm text-slate-600">Loading...</div>
      </div>
    );
  }
  
  const value: AuthContextType = {
    user,
    isLoading: isLoadingUser,
    isAuthenticated,
    login: enhancedLogin,
    register: enhancedRegister,
    logout: enhancedLogout,
    refetchUser,
    checkAuth,
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use authentication context
 * Must be used within AuthProvider
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook to check if user is authenticated (for route protection)
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth');
    }
  }, [isAuthenticated, isLoading, router]);
  
  return { isAuthenticated, isLoading };
}

