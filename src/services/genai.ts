import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { OllamaEmbeddings } from "@langchain/ollama";

import { config } from "../config";

// vetoriza textos localmente
export const embeddings = new OllamaEmbeddings({
  baseUrl: config.ollama.url,
  model: "embeddinggemma",
});

// processamento das conversas
export const llm = new ChatGoogleGenerativeAI({
  apiKey: config.genai.apiKey,
  model: "gemini-3.6-flash",
  temperature: 0,
  maxRetries: 2,
});
