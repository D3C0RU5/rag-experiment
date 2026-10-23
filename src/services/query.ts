import { config } from "../config";
import type { QueryRequest, QueryResponse, SearchResult } from "../types";
import { embeddings } from "./genai";
import { qdrantClient } from "./qdrant";

export async function searchDocuments({
  question,
  topK = 3,
}: QueryRequest): Promise<QueryResponse> {
  const queryVector = await embeddings.embedQuery(question);
  const searchResult = await qdrantClient.query(config.qdrant.collectionName, {
    query: queryVector,
    limit: topK,
    with_payload: true,
  });

  const answers: SearchResult[] = searchResult.points.map((item) => ({
    id: String(item.id),
    text: item.payload?.text as string,
    score: item.score,
    metadata: {
      documentId: item.payload?.documentId as string,
      filename: item.payload?.filename as string,
      ...(typeof item.payload?.page === "number"
        ? { page: item.payload.page }
        : {}),
      chunkIndex: item.payload?.chunkIndex as number,
    },
  }));

  return {
    question,
    answers,
    countChunks: answers.length,
  };
}
