/**
 * Query keys factory for React Query
 * Centralized query key management for consistent cache invalidation
 */

export const queryKeys = {
  // Auth queries
  auth: {
    me: ['auth', 'me'] as const,
  },

  // Document queries
  documents: {
    all: ['documents'] as const,
    lists: () => [...queryKeys.documents.all, 'list'] as const,
    list: (filters?: { skip?: number; limit?: number }) =>
      [...queryKeys.documents.lists(), filters] as const,
    details: () => [...queryKeys.documents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.documents.details(), id] as const,
    versions: (id: string) => [...queryKeys.documents.detail(id), 'versions'] as const,
    version: (docId: string, versionNumber: number) =>
      [...queryKeys.documents.versions(docId), versionNumber] as const,
  },

  // Embedding queries
  embeddings: {
    all: ['embeddings'] as const,
    byDocument: (docId: string) => [...queryKeys.embeddings.all, 'document', docId] as const,
    search: (query: string, filters?: { top_k?: number; doc_id?: string }) =>
      [...queryKeys.embeddings.all, 'search', query, filters] as const,
  },
} as const;

