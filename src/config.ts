import dotenv from "dotenv";

dotenv.config();

const FILE_SIZE_LIMIT_20MB = 20 * 1024 * 1024;

export const config = {
  geminiai: {
    apiKey: process.env.GEMINI_API_KEY || "",
  },
  qdrant: {
    url: process.env.QDRANT_URL || "http://localhost:6333",
    collection: process.env.QDRANT_COLLECTION || "documents",
  },
  server: {
    port: process.env.PORT || 3000,
  },
  uploads: {
    directory: process.env.UPLOAD_DIR || "./uploads",
    maxFileSizeBytes: FILE_SIZE_LIMIT_20MB,
  },
};
