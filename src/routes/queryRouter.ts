import { Router } from "express";
import {
  generateRAGResponse,
  generateRAGStreamingResponse,
} from "../services/rag";
import { validateQuery } from "../middlewares/validateQuery";

export const queryRouter = Router();

queryRouter.post("/", validateQuery, async (req, res) => {
  try {
    const { question, topK } = req.body;

    const result = await generateRAGResponse({ question, topK });
    return res.status(200).json(result);
  } catch (error) {
    console.log("Erro ao processar a consulta: ", error);
    return res.status(500).json({ error: "Erro ao processar a consulta." });
  }
});

queryRouter.post("/stream", validateQuery, async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const { question, topK } = req.body;
    await generateRAGStreamingResponse({ question, topK, res });

    console.log("Streaming response concluído com sucesso");
  } catch (error) {
    console.error("Erro ao processar a consulta em stream:", error);

    if (res.destroyed || res.writableEnded) return;
    if (!res.headersSent) res.status(500);

    res.write(
      "data: " +
        JSON.stringify({
          type: "error",
          content: "Erro ao processar a consulta.",
        }) +
        "\n\n",
    );
    res.write("data: [DONE]\n\n");
    res.end();
  }
});
