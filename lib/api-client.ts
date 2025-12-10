/**
 * Base API client with error handling, token management, and request/response interceptors
 */

import type { ApiError } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://self-actualization-analysis-two.vercel.app';

class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: ApiError
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Set authentication token
   */
  setToken(token: string | null): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  /**
   * Get authentication token from localStorage or memory
   */
  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('auth_token');
      if (stored) {
        this.token = stored;
        return stored;
      }
    }
    return null;
  }

  /**
   * Build full URL from path
   */
  private buildURL(path: string): string {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseURL}${cleanPath}`;
  }

  /**
   * Get default headers
   */
  private getHeaders(additionalHeaders?: HeadersInit): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Merge additional headers if provided
    if (additionalHeaders) {
      if (additionalHeaders instanceof Headers) {
        additionalHeaders.forEach((value, key) => {
          headers[key] = value;
        });
      } else if (Array.isArray(additionalHeaders)) {
        additionalHeaders.forEach(([key, value]) => {
          headers[key] = value;
        });
      } else {
        Object.assign(headers, additionalHeaders);
      }
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  /**
   * Handle API response and errors
   */
  private async handleResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    try {
      data = isJson ? await response.json() : await response.text();
    } catch (error) {
      throw new ApiClientError(
        'Failed to parse response',
        response.status
      );
    }

    if (!response.ok) {
      const errorData = isJson ? (data as ApiError) : undefined;
      throw new ApiClientError(
        errorData?.detail || errorData?.error || `Request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    return data as T;
  }

  /**
   * Generic request method
   */
  private async request<T>(
    method: string,
    path: string,
    options?: {
      body?: any;
      headers?: HeadersInit;
      params?: Record<string, string | number | boolean>;
    }
  ): Promise<T> {
    const url = new URL(this.buildURL(path));

    // Add query parameters
    if (options?.params) {
      Object.entries(options.params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    const config: RequestInit = {
      method,
      headers: this.getHeaders(options?.headers),
    };

    if (options?.body) {
      config.body = JSON.stringify(options.body);
    }

    try {
      const response = await fetch(url.toString(), config);
      return await this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof ApiClientError) {
        throw error;
      }
      // Network or other errors
      throw new ApiClientError(
        error instanceof Error ? error.message : 'Network error occurred',
        0
      );
    }
  }

  /**
   * GET request
   */
  async get<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>('GET', path, { params });
  }

  /**
   * POST request
   */
  async post<T>(path: string, body?: any, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>('POST', path, { body, params });
  }

  /**
   * PUT request
   */
  async put<T>(path: string, body?: any, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>('PUT', path, { body, params });
  }

  /**
   * PATCH request
   */
  async patch<T>(path: string, body?: any, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>('PATCH', path, { body, params });
  }

  /**
   * DELETE request
   */
  async delete<T>(path: string, params?: Record<string, string | number | boolean>): Promise<T> {
    return this.request<T>('DELETE', path, { params });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export error class for type checking
export { ApiClientError };

