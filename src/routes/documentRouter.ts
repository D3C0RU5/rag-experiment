import { Router } from "express";
import { generateRAGResponse } from "../services/rag";
import { uploadMiddleware } from "../middlewares/uploadMiddleware";
import { proccessDocument } from "../services/document";
import fs from "node:fs/promises";

export const documentRouter = Router();

documentRouter.post(
  "/upload",
  uploadMiddleware.single("file"),
  async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ error: "Nenhum arquivo foi enviado" });
      }

      const result = await proccessDocument(file.path, file.originalname);
      fs.unlink(file.path);
      res.status(200).json(result);
    } catch (error) {
      console.log("Erro ao processar documento: ", error);
      res.status(500).json({ error: "Erro ao processar documento." });
    }
  },
);
