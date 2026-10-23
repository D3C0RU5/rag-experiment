export interface UploadResponse {
  success: boolean;
  documentId: string;
  chunksCount: number;
  message?: string;
}

export interface QueryRequest {
  question: string;
  topK?: number;
}

export interface SearchResult {
  id: string;
  text: string;
  score: number;
  metadata: {
    documentId: string;
    filename: string;
    page?: number;
    chunkIndex: number;
  };
}

export interface QueryResponse {
  question: string;
  answers: SearchResult[];
  countChunks: number;
}

export interface Source {
  fileName: string;
  page?: number;
  score?: number;
}

export interface RAGResponse {
  question: string;
  answer: string;
  sources?: Source[];
  tokensUsed?: number;
}
