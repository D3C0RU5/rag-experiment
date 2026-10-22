import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embeddings } from "./genai";
import { qdrantClient } from "./qdrant";
import { config } from "../config";

interface UploadResponse {
  success: boolean;
  documentId: string;
  chunksCount: number;
  message?: string;
}

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

export async function proccessDocument(
  filePath: string,
  filename: string,
): Promise<UploadResponse> {
  // 1. Carregamento do arquivo
  const loader = new PDFLoader(filePath);
  const documents = await loader.load();

  if (documents.length === 0) {
    throw new Error("There is no documents found in the PDF file.");
  }

  // 2. Divisão do texto em chunks
  const chunks = await textSplitter.splitDocuments(documents);
  if (chunks.length === 0) {
    throw new Error("There is no chunks generated from documents.");
  }

  // 3. Adicionar alguns metadados nos chunks
  const documentId = crypto.randomUUID();
  const documentsChunksWithMetadata = chunks.map((chunk, index) => ({
    id: crypto.randomUUID(),
    text: chunk.pageContent,
    metadata: {
      documentId,
      chunkIndex: index,
      filename,
      uploadedAt: Date.now(),
      page: chunk.metadata.loc.pageNumber,
    },
  }));

  // 4. Geração dos embeddings
  const texts = documentsChunksWithMetadata.map((doc) => doc.text);
  const vectors = await embeddings.embedDocuments(texts);

  // 5. Armazenar embeddings vetorizados de busca no banco de dados
  const data = documentsChunksWithMetadata.map((chunk, index) => {
    const vector = vectors[index];

    if (!vector || !Array.isArray(vector)) {
      throw new Error(
        `Invalid vector generated from chunk with index ${index}.`,
      );
    }

    return {
      id: chunk.id,
      vector,
      payload: {
        text: chunk.text,
        ...chunk.metadata,
      },
    };
  });
  await qdrantClient.upsert(config.qdrant.collectionName, {
    points: data,
    wait: true,
  });

  // 6. Retornar o resultado do payload
  return {
    success: true,
    documentId,
    chunksCount: documentsChunksWithMetadata.length,
    message: "Documento processado com sucesso",
  };
}
