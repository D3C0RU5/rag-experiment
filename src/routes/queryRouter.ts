import { Router } from "express";
import { generateRAGResponse } from "../services/rag";
import type { QueryRequest } from "../types";

export const queryRouter = Router();

queryRouter.post("/", async (req, res) => {
  try {
    const { question, topK } = req.body;

    const result = await generateRAGResponse({
      question,
      ...(topK !== undefined ? { topK } : {}),
    });
    return res.status(200).json(result);
  } catch (error) {
    console.log("Erro ao processar a consulta: ", error);
    return res.status(500).json({ error: "Erro ao processar a consulta." });
  }
});
