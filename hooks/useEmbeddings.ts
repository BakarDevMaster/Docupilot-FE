/**
 * Embedding hooks using React Query
 * Provides creation, search, retrieval, and deletion of document embeddings
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createEmbeddings,
  searchEmbeddings,
  getDocumentEmbeddings,
  deleteDocumentEmbeddings,
} from '@/services/embeddings.service';
import { queryKeys } from '@/lib/query-keys';
import type {
  Embedding,
  EmbeddingCreateRequest,
  EmbeddingSearchRequest,
  EmbeddingSearchResponse,
  EmbeddingCreateResponse,
  EmbeddingDeleteResponse,
} from '@/types/api';
import { ApiClientError } from '@/lib/api-client';

/**
 * Hook to create embeddings for a document
 * Either provide 'text' (will be auto-chunked) or 'chunks' (pre-chunked)
 */
export function useCreateEmbeddings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: EmbeddingCreateRequest) => createEmbeddings(data),
    onSuccess: (response, variables) => {
      // Invalidate document embeddings cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.embeddings.byDocument(variables.doc_id),
      });
      // Also invalidate any search queries that might include this document
      queryClient.invalidateQueries({
        queryKey: queryKeys.embeddings.all,
      });
    },
    onError: (error: ApiClientError) => {
      console.error('Failed to create embeddings:', error);
    },
  });
}

/**
 * Hook to search for similar document chunks using vector similarity
 * Can be used as a query (with enabled flag) or mutation
 */
export function useSearchEmbeddings(
  searchRequest?: EmbeddingSearchRequest,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: queryKeys.embeddings.search(
      searchRequest?.query || '',
      {
        top_k: searchRequest?.top_k,
        doc_id: searchRequest?.doc_id,
      }
    ),
    queryFn: () => searchEmbeddings(searchRequest!),
    enabled: enabled && !!searchRequest?.query,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}

/**
 * Hook to search embeddings as a mutation (for manual trigger)
 */
export function useSearchEmbeddingsMutation() {
  return useMutation({
    mutationFn: (data: EmbeddingSearchRequest) => searchEmbeddings(data),
    onError: (error: ApiClientError) => {
      console.error('Failed to search embeddings:', error);
    },
  });
}

/**
 * Hook to get all embeddings for a specific document
 */
export function useDocumentEmbeddings(docId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.embeddings.byDocument(docId!),
    queryFn: () => getDocumentEmbeddings(docId!),
    enabled: !!docId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to delete all embeddings for a specific document
 */
export function useDeleteDocumentEmbeddings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (docId: string) => deleteDocumentEmbeddings(docId),
    onSuccess: (_, docId) => {
      // Remove embeddings from cache
      queryClient.removeQueries({
        queryKey: queryKeys.embeddings.byDocument(docId),
      });
      // Invalidate search queries that might include this document
      queryClient.invalidateQueries({
        queryKey: queryKeys.embeddings.all,
      });
    },
    onError: (error: ApiClientError) => {
      console.error('Failed to delete embeddings:', error);
    },
  });
}

/**
 * Combined hook for embedding operations
 * Convenience hook for components that need multiple embedding features
 */
export function useEmbeddingOperations(docId?: string | null) {
  const embeddings = useDocumentEmbeddings(docId);
  const createMutation = useCreateEmbeddings();
  const deleteMutation = useDeleteDocumentEmbeddings();
  const searchMutation = useSearchEmbeddingsMutation();

  return {
    embeddings: embeddings.data,
    isLoadingEmbeddings: embeddings.isLoading,
    create: createMutation,
    delete: deleteMutation,
    search: searchMutation,
    refetchEmbeddings: embeddings.refetch,
  };
}

