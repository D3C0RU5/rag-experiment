import { ChatPromptTemplate } from "@langchain/core/prompts";
import type { QueryRequest, RAGResponse, Source } from "../types";
import { searchDocuments } from "./query";
import { llm } from "./genai";
import { StringOutputParser } from "@langchain/core/output_parsers";

const PROMPT_TEMPLATE = ChatPromptTemplate.fromMessages([
  [
    "system",
    `
    Você é um assistente de IA que responde perguntas com base em documentos fornecidos.

    Regras:
    - Use apenas as informações dos documentos para responder.
    - Se a informação não estiver nos documentos, responda: "Desculpe, não encontrei informações para sua pergunta."
    - Forneça respostas  concisas e diretas.
    - Cite as fontes usadas na resposta no formato: [1], [2], etc.
    - Responda em português brasileiro.
    `,
  ], // Instructions
  [
    "human",
    `
    CONTEXT:
    {context}
    QUESTION:
    {question}
    ANSWER
    `,
  ], // Context
]);

export async function generateRAGResponse({
  question,
  topK = 3,
}: QueryRequest): Promise<RAGResponse> {
  const searchResults = await searchDocuments({ question, topK });

  if (searchResults.answers.length === 0) {
    return {
      question,
      answer:
        "Desculpe, não consegui encontrar informações relevantes para sua pergunta.",
    };
  }

  // Construir contexto com base nas buscas
  const context = searchResults.answers
    .map((item, idx) => `[${idx + 1}]: ${item.text}`)
    .join("\n\n");

  // Chain de prompts para gerar respostas
  const chains = PROMPT_TEMPLATE.pipe(llm).pipe(new StringOutputParser());

  const answer = await chains.invoke({ context, question });

  // Extrair respostas e formatar
  const sources: Source[] = searchResults.answers.map((item, idx) => ({
    fileName: item.metadata.filename,
    page: item.metadata.page || 0,
    score: item.score,
  }));

  return {
    question,
    answer,
    sources,
  };
}
