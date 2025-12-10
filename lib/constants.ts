/**
 * Application constants
 */

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },
  // Document endpoints
  DOCUMENTS: {
    LIST: '/api/documents',
    CREATE: '/api/documents',
    GET: (id: string) => `/api/documents/${id}`,
    UPDATE: (id: string) => `/api/documents/${id}`,
    DELETE: (id: string) => `/api/documents/${id}`,
    GENERATE: '/api/documents/generate',
    VERSIONS: (id: string) => `/api/documents/${id}/versions`,
    VERSION: (id: string, versionNumber: number) => `/api/documents/${id}/versions/${versionNumber}`,
  },
  // Embedding endpoints
  EMBEDDINGS: {
    CREATE: '/api/embeddings/create',
    SEARCH: '/api/embeddings/search',
    GET_BY_DOC: (docId: string) => `/api/embeddings/doc/${docId}`,
    DELETE_BY_DOC: (docId: string) => `/api/embeddings/doc/${docId}`,
  },
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
} as const;

