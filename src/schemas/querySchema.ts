import { z } from "zod";

export const querySchema = z.object({
  question: z.string().trim().min(1, "A pergunta é obrigatória."),
  topK: z.number().int().positive().optional(),
});
