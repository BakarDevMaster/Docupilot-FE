/**
 * Authentication service - API client functions for auth endpoints
 * Handles registration, login, logout, and current user retrieval
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import type { User, UserCreate, UserLogin, Token, LoginResponse } from '@/types/api';

/**
 * Register a new user
 * Returns the created user object
 */
export async function register(data: UserCreate): Promise<User> {
  const user = await apiClient.post<User>(
    API_ENDPOINTS.AUTH.REGISTER,
    data
  );
  return user;
}

/**
 * Login with email and password
 * Returns token and optionally user data
 */
export async function login(data: UserLogin): Promise<LoginResponse> {
  const tokenResponse = await apiClient.post<Token>(
    API_ENDPOINTS.AUTH.LOGIN,
    data
  );
  
  // Store token immediately
  apiClient.setToken(tokenResponse.access_token);
  
  // Fetch user data
  let user: User | undefined;
  try {
    user = await getCurrentUser();
  } catch (error) {
    // If fetching user fails, still return token
    console.warn('Failed to fetch user after login:', error);
  }
  
  return {
    ...tokenResponse,
    user,
  };
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User> {
  const user = await apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  return user;
}

/**
 * Logout current user
 * Clears token from client and optionally invalidates on server
 */
export async function logout(): Promise<void> {
  try {
    // Attempt server-side logout (optional, may fail if token already invalid)
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  } catch (error) {
    // Continue with client-side logout even if server call fails
    console.warn('Server logout failed, clearing client token:', error);
  } finally {
    // Always clear token from client
    apiClient.setToken(null);
  }
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
  return apiClient.getToken() !== null;
}

/**
 * Get stored token
 */
export function getToken(): string | null {
  return apiClient.getToken();
}

/**
 * Set token manually (useful for token refresh or restoration)
 */
export function setToken(token: string | null): void {
  apiClient.setToken(token);
}

