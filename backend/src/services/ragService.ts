import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { VectorDBQAChain } from "langchain/chains";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { CharacterTextSplitter } from "langchain/text_splitter";

import { getDocument } from "./documentService.js";

export async function answerQuestion(
  documentId: string,
  question: string
): Promise<string> {
  const doc = await getDocument(documentId);
  if (!doc) throw new Error("Documento not found");

  const splitter = new CharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });
  const docs = await splitter.splitDocuments([
    { pageContent: doc.textContent, metadata: {} },
  ]);

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY!,
  });
  const vectorStore = await MemoryVectorStore.fromDocuments(docs, embeddings);

  const llm = new ChatOpenAI({
    temperature: 0,
    openAIApiKey: process.env.OPENAI_API_KEY!,
    modelName: "gpt-3.5-turbo",
  });

  const chain = VectorDBQAChain.fromLLM(llm, vectorStore);

  const response = await chain.call({ query: question });
  return response.text;
}
