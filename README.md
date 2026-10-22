# RAG experiment

## Embeddings locais

O projeto usa `embeddinggemma` no Ollama para vetorizar documentos. O Gemini continua disponível para as conversas.

```bash
docker compose up -d qdrant ollama
docker compose exec ollama ollama pull embeddinggemma
npm install
npm start
```

O Ollama atende em `http://localhost:11434`. Configure `OLLAMA_URL` no `.env` se usar outro endereço. Para depurar no VS Code, escolha **Depurar ingestão do PDF** e pressione F5.

O `embeddinggemma` gera vetores de 768 dimensões. A collection padrão é `documents_embeddinggemma`, separada da antiga `documents` usada com Gemini (3072 dimensões). Ao trocar de modelo, crie outra collection e gere novamente os embeddings dos documentos. Nas consultas, use `embeddings.embedQuery("task: search result | query: " + pergunta)` de `src/services/genai.ts` para manter o formato usado na indexação.

O comando `npm start` executa a ingestão do PDF a cada vez e cria novos IDs para os chunks; executá-lo novamente adiciona pontos duplicados.
