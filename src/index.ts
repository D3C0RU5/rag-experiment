import { config } from "./config";
import express from "express";
import { queryRouter } from "./routes/queryRouter";
import { documentRouter } from "./routes/documentRouter";
import { initQdrantCollection } from "./services/qdrant";
import fs from "node:fs";
const app = express();
const port = config.server.port;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "RAG Server is running!" });
});
app.use("/query", queryRouter);
app.use("/documents", documentRouter);

if (!fs.existsSync(config.uploads.directory)) {
  fs.mkdirSync(config.uploads.directory);
  console.log(`Diretorio de uploads criado em: ${config.uploads.directory}`);
}

async function start() {
  try {
    await initQdrantCollection();

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
}

start();
