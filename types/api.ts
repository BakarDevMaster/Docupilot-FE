/**
 * TypeScript type definitions matching backend SQLModel schemas
 */

export enum UserRole {
  ADMIN = "admin",
  TECHNICAL_WRITER = "technical_writer",
  DEVELOPER = "developer",
  VIEWER = "viewer",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface UserCreate {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

export interface LoginResponse extends Token {
  user?: User;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  doc_type: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentCreate {
  title: string;
  content: string;
  doc_type?: string;
}

export interface DocumentUpdate {
  title?: string;
  content?: string;
  doc_type?: string;
}

export interface DocumentGenerateRequest {
  title: string;
  source: string;
  doc_type?: string;
  context_doc_ids?: string[];
}

export interface DocumentVersion {
  id: string;
  doc_id: string;
  version_number: number;
  content: string;
  diff?: string;
  updated_by: string;
  timestamp: string;
}

export interface Embedding {
  id: string;
  doc_id: string;
  chunk_text: string;
  chunk_index: number;
  vector_id: string;
  created_at: string;
}

export interface EmbeddingCreateRequest {
  doc_id: string;
  text?: string;
  chunks?: string[];
  chunk_size?: number;
  chunk_overlap?: number;
}

export interface EmbeddingSearchRequest {
  query: string;
  top_k?: number;
  doc_id?: string;
}

export interface EmbeddingSearchResult {
  chunk_id: string;
  doc_id: string;
  chunk_text: string;
  chunk_index: number;
  score: number;
}

export interface EmbeddingSearchResponse {
  query: string;
  results: EmbeddingSearchResult[];
  total_results: number;
}

export interface EmbeddingCreateResponse {
  message: string;
  doc_id: string;
  chunks_count: number;
  vector_ids: string[];
}

export interface EmbeddingDeleteResponse {
  message: string;
  doc_id: string;
  deleted_count: number;
}

export interface ApiError {
  error: string;
  detail: string;
  status_code: number;
  timestamp?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

