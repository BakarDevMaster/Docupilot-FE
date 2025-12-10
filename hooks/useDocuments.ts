/**
 * Document hooks using React Query
 * Provides CRUD operations, versioning, AI generation, and maintenance
 */

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  listDocuments,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
  generateDocument,
  getDocumentVersions,
  getDocumentVersion,
  updateDocumentWithAgent,
  auditDocument,
  type ListDocumentsParams,
  type DocumentUpdateWithAgentRequest,
  type DocumentAuditRequest,
} from '@/services/documents.service';
import { queryKeys } from '@/lib/query-keys';
import type {
  Document,
  DocumentCreate,
  DocumentUpdate,
  DocumentGenerateRequest,
  DocumentVersion,
} from '@/types/api';
import { ApiClientError } from '@/lib/api-client';

/**
 * Hook to list all documents with pagination
 */
export function useDocuments(params?: ListDocumentsParams) {
  return useQuery({
    queryKey: queryKeys.documents.list(params),
    queryFn: () => listDocuments(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
}

/**
 * Hook to get a single document by ID
 */
export function useDocument(docId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.documents.detail(docId!),
    queryFn: () => getDocument(docId!),
    enabled: !!docId, // Only fetch if docId is provided
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to create a new document
 */
export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: DocumentCreate) => createDocument(data),
    onSuccess: () => {
      // Invalidate documents list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.lists() });
    },
    onError: (error: ApiClientError) => {
      console.error('Failed to create document:', error);
    },
  });
}

/**
 * Hook to update a document
 */
export function useUpdateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ docId, data }: { docId: string; data: DocumentUpdate }) =>
      updateDocument(docId, data),
    onSuccess: (updatedDocument, variables) => {
      // Update the document in cache
      queryClient.setQueryData(
        queryKeys.documents.detail(variables.docId),
        updatedDocument
      );
      // Invalidate list to ensure consistency
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.lists() });
      // Invalidate versions since a new version was created
      queryClient.invalidateQueries({
        queryKey: queryKeys.documents.versions(variables.docId),
      });
    },
    onError: (error: ApiClientError) => {
      console.error('Failed to update document:', error);
    },
  });
}

/**
 * Hook to delete a document
 */
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (docId: string) => deleteDocument(docId),
    onSuccess: (_, docId) => {
      // Remove document from cache
      queryClient.removeQueries({ queryKey: queryKeys.documents.detail(docId) });
      // Invalidate list to refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.lists() });
      // Remove versions cache
      queryClient.removeQueries({
        queryKey: queryKeys.documents.versions(docId),
      });
    },
    onError: (error: ApiClientError) => {
      console.error('Failed to delete document:', error);
    },
  });
}

/**
 * Hook to generate a document using AI agent
 */
export function useGenerateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      createEmbeddings = true,
    }: {
      data: DocumentGenerateRequest;
      createEmbeddings?: boolean;
    }) => generateDocument(data, createEmbeddings),
    onSuccess: (document) => {
      // Add new document to cache
      queryClient.setQueryData(
        queryKeys.documents.detail(document.id),
        document
      );
      // Invalidate list to include new document
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.lists() });
    },
    onError: (error: ApiClientError) => {
      console.error('Failed to generate document:', error);
    },
  });
}

/**
 * Hook to get all versions of a document
 */
export function useDocumentVersions(docId: string | null | undefined) {
  return useQuery({
    queryKey: queryKeys.documents.versions(docId!),
    queryFn: () => getDocumentVersions(docId!),
    enabled: !!docId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to get a specific version of a document
 */
export function useDocumentVersion(
  docId: string | null | undefined,
  versionNumber: number | null | undefined
) {
  return useQuery({
    queryKey: queryKeys.documents.version(docId!, versionNumber!),
    queryFn: () => getDocumentVersion(docId!, versionNumber!),
    enabled: !!docId && versionNumber !== null && versionNumber !== undefined,
    staleTime: 1000 * 60 * 10, // 10 minutes (versions don't change)
  });
}

/**
 * Hook to update document using maintenance agent (AI-powered)
 */
export function useUpdateDocumentWithAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      data,
      updateEmbeddings = true,
    }: {
      data: DocumentUpdateWithAgentRequest;
      updateEmbeddings?: boolean;
    }) => updateDocumentWithAgent(data, updateEmbeddings),
    onSuccess: (updatedDocument, variables) => {
      // Update document in cache
      queryClient.setQueryData(
        queryKeys.documents.detail(variables.data.doc_id),
        updatedDocument
      );
      // Invalidate list and versions
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.lists() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.documents.versions(variables.data.doc_id),
      });
    },
    onError: (error: ApiClientError) => {
      console.error('Failed to update document with agent:', error);
    },
  });
}

/**
 * Hook to audit a document using maintenance agent
 */
export function useAuditDocument() {
  return useMutation({
    mutationFn: ({
      docId,
      options,
    }: {
      docId: string;
      options?: DocumentAuditRequest;
    }) => auditDocument(docId, options),
    onError: (error: ApiClientError) => {
      console.error('Failed to audit document:', error);
    },
  });
}

/**
 * Combined hook for document operations
 * Convenience hook for components that need multiple document features
 */
export function useDocumentOperations(docId?: string | null) {
  const document = useDocument(docId);
  const versions = useDocumentVersions(docId);
  const createMutation = useCreateDocument();
  const updateMutation = useUpdateDocument();
  const deleteMutation = useDeleteDocument();
  const generateMutation = useGenerateDocument();
  const updateWithAgentMutation = useUpdateDocumentWithAgent();
  const auditMutation = useAuditDocument();

  return {
    document: document.data,
    isLoadingDocument: document.isLoading,
    versions: versions.data,
    isLoadingVersions: versions.isLoading,
    create: createMutation,
    update: updateMutation,
    delete: deleteMutation,
    generate: generateMutation,
    updateWithAgent: updateWithAgentMutation,
    audit: auditMutation,
    refetchDocument: document.refetch,
    refetchVersions: versions.refetch,
  };
}

