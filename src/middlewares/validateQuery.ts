import type { RequestHandler } from "express";
import { querySchema } from "../schemas/querySchema";

export const validateQuery: RequestHandler = (req, res, next) => {
  const result = querySchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Dados inválidos para consulta.",
      details: result.error.flatten().fieldErrors,
    });
    return;
  }

  req.body = result.data;
  next();
};
