/**
 * Documents service - API client functions for document endpoints
 * Handles CRUD operations, versioning, AI generation, and maintenance
 */

import { apiClient } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/lib/constants';
import type {
  Document,
  DocumentCreate,
  DocumentUpdate,
  DocumentGenerateRequest,
  DocumentVersion,
} from '@/types/api';

export interface ListDocumentsParams {
  skip?: number;
  limit?: number;
}

export interface DocumentUpdateContentRequest extends DocumentUpdate {
  doc_id: string;
}

export interface DocumentUpdateWithAgentRequest {
  doc_id: string;
  section: string;
  new_content: string;
}

export interface DocumentAuditRequest {
  check_consistency?: boolean;
  check_completeness?: boolean;
  check_accuracy?: boolean;
}

export interface DocumentAuditResponse {
  doc_id: string;
  audit_results: {
    issues?: Array<{
      type: string;
      severity: 'low' | 'medium' | 'high';
      message: string;
      suggestion?: string;
    }>;
    summary?: string;
    [key: string]: any; // Allow for additional fields from agent
  };
  message: string;
}

/**
 * List all documents with pagination
 */
export async function listDocuments(
  params?: ListDocumentsParams
): Promise<Document[]> {
  const documents = await apiClient.get<Document[]>(
    API_ENDPOINTS.DOCUMENTS.LIST,
    params as Record<string, string | number | boolean> | undefined
  );
  return documents;
}

/**
 * Get a single document by ID
 */
export async function getDocument(docId: string): Promise<Document> {
  const document = await apiClient.get<Document>(
    API_ENDPOINTS.DOCUMENTS.GET(docId)
  );
  return document;
}

/**
 * Create a new document
 */
export async function createDocument(
  data: DocumentCreate
): Promise<Document> {
  const document = await apiClient.post<Document>(
    API_ENDPOINTS.DOCUMENTS.CREATE,
    data
  );
  return document;
}

/**
 * Update an existing document
 * Creates a new version automatically
 */
export async function updateDocument(
  docId: string,
  data: DocumentUpdate
): Promise<Document> {
  const document = await apiClient.put<Document>(
    API_ENDPOINTS.DOCUMENTS.UPDATE(docId),
    data
  );
  return document;
}

/**
 * Delete a document
 */
export async function deleteDocument(docId: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.DOCUMENTS.DELETE(docId));
}

/**
 * Generate a new document using AI agent
 */
export async function generateDocument(
  data: DocumentGenerateRequest,
  createEmbeddings: boolean = true
): Promise<Document> {
  const document = await apiClient.post<Document>(
    API_ENDPOINTS.DOCUMENTS.GENERATE,
    data,
    { create_embeddings: createEmbeddings }
  );
  return document;
}

/**
 * Update document using maintenance agent (AI-powered updates)
 */
export async function updateDocumentWithAgent(
  data: DocumentUpdateWithAgentRequest,
  updateEmbeddings: boolean = true
): Promise<Document> {
  const document = await apiClient.post<Document>(
    '/api/documents/update',
    data,
    { update_embeddings: updateEmbeddings }
  );
  return document;
}

/**
 * Get version history for a document
 */
export async function getDocumentVersions(
  docId: string
): Promise<DocumentVersion[]> {
  const versions = await apiClient.get<DocumentVersion[]>(
    API_ENDPOINTS.DOCUMENTS.VERSIONS(docId)
  );
  return versions;
}

/**
 * Get a specific version of a document
 */
export async function getDocumentVersion(
  docId: string,
  versionNumber: number
): Promise<DocumentVersion> {
  const version = await apiClient.get<DocumentVersion>(
    API_ENDPOINTS.DOCUMENTS.VERSION(docId, versionNumber)
  );
  return version;
}

/**
 * Audit a document using maintenance agent
 * Checks for consistency, completeness, and accuracy
 */
export async function auditDocument(
  docId: string,
  options?: DocumentAuditRequest
): Promise<DocumentAuditResponse> {
  const response = await apiClient.post<DocumentAuditResponse>(
    `/api/documents/${docId}/audit`,
    options || {}
  );
  return response;
}

