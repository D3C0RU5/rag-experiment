import { config } from "./config";
import express from "express";
import { queryRouter } from "./routes/queryRouter";
import { documentRouter } from "./routes/documentRouter";

const app = express();
const port = config.server.port;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "RAG Server is running!" });
});

app.use("/query", queryRouter);

app.use("/documents", documentRouter);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
