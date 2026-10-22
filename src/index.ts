// import { config } from "./config";
// import express from "express";

import path from "node:path";
import { proccessDocument } from "./services/document";
import { initQdrantCollection } from "./services/qdrant";

// const app = express();
// const port = config.server.port;

// app.get("/", (req, res) => {
//   res.json({ message: "RAG Server is running!" });
// });

// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
// });

async function main() {
  try {
    console.log("Iniciando collection");
    await initQdrantCollection();

    console.log("Processando documento");
    const result = await proccessDocument(
      path.resolve("./assets/poc-preview.pdf"),
      "poc-preview.pdf",
    );
    console.log(`Processamento concluído:`, result);
  } catch (error) {
    console.error("Erro ao iniciar a aplicação", error);
    process.exitCode = 1;
  }
}

main();
