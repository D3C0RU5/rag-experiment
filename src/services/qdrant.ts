import { QdrantClient } from "@qdrant/js-client-rest";
import { config } from "../config";

export const qdrantClient = new QdrantClient({
  url: config.qdrant.url,
});

export async function initQdrantCollection() {
  const collections = await qdrantClient.getCollections();

  const exists = collections.collections.find(
    (col) => col.name === config.qdrant.collectionName,
  );

  if (!exists) {
    await qdrantClient.createCollection(config.qdrant.collectionName, {
      vectors: {
        size: 768,
        distance: "Cosine",
      },
    });

    console.log(`Coleção ${config.qdrant.collectionName} criada no Qdrant.`);
  } else {
    console.log(`Coleção ${config.qdrant.collectionName} já existe no Qdrant.`);
  }
}
