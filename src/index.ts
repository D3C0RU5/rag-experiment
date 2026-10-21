import { config } from "./config";
import express from "express";

const app = express();
const port = config.server.port;

app.get("/", (req, res) => {
  res.json({ message: "RAG Server is running!" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
