import multer from "multer";
import { config } from "../config";
import { randomUUID } from "node:crypto";
import path from "node:path";

const storage = multer.diskStorage({
  destination: config.uploads.directory,
  filename: (_, file, cb) => {
    const uniqueName = randomUUID() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: config.uploads.maxFileSizeBytes },
  fileFilter: (_, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      cb(new Error("Apenas arquivos PDF são permitidos"));
    }

    cb(null, true);
  },
});
