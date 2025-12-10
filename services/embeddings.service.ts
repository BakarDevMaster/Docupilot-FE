/**
 * Embeddings service - API client functions for embedding endpoints
 * Handles creation, search, retrieval, and deletion of document embeddings
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import type {
  Embedding,
  EmbeddingCreateRequest,
  EmbeddingCreateResponse,
  EmbeddingSearchRequest,
  EmbeddingSearchResponse,
  EmbeddingDeleteResponse,
} from '@/types/api';

/**
 * Create embeddings for a document
 * Either provide 'text' (will be auto-chunked) or 'chunks' (pre-chunked)
 */
export async function createEmbeddings(
  data: EmbeddingCreateRequest
): Promise<EmbeddingCreateResponse> {
  const response = await apiClient.post<EmbeddingCreateResponse>(
    API_ENDPOINTS.EMBEDDINGS.CREATE,
    data
  );
  return response;
}

/**
 * Search for similar document chunks using vector similarity
 */
export async function searchEmbeddings(
  data: EmbeddingSearchRequest
): Promise<EmbeddingSearchResponse> {
  const response = await apiClient.post<EmbeddingSearchResponse>(
    API_ENDPOINTS.EMBEDDINGS.SEARCH,
    data
  );
  return response;
}

/**
 * Get all embeddings for a specific document
 */
export async function getDocumentEmbeddings(
  docId: string
): Promise<Embedding[]> {
  const embeddings = await apiClient.get<Embedding[]>(
    API_ENDPOINTS.EMBEDDINGS.GET_BY_DOC(docId)
  );
  return embeddings;
}

/**
 * Delete all embeddings for a specific document
 * Removes embeddings from both Pinecone and database
 */
export async function deleteDocumentEmbeddings(
  docId: string
): Promise<EmbeddingDeleteResponse> {
  const response = await apiClient.delete<EmbeddingDeleteResponse>(
    API_ENDPOINTS.EMBEDDINGS.DELETE_BY_DOC(docId)
  );
  return response;
}

