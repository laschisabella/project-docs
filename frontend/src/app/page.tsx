"use client";

import { useState } from "react";
import {
  uploadAndReturnDocument,
  fetchDocument,
  askQuestion,
} from "../usecases/documents";
import { Document } from "../types/document";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [document, setDocument] = useState<Document | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const doc = await uploadAndReturnDocument(file);
      const fullDoc = await fetchDocument(doc.id);
      setDocument(fullDoc);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to upload document"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAsk = async () => {
    if (!document || !question) return;
    setLoading(true);
    setError("");
    try {
      const ans = await askQuestion(document.id, question);
      setAnswer(ans);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to get answer");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setDocument(null);
    setQuestion("");
    setAnswer("");
    setError("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold">Leitor de documentos</h1>
      <p className="mb-4">
        Suba um arquivo .png, .jpg ou .pdf e faça perguntas sobre o conteúdo!
      </p>

      {!document ? (
        <div className="space-y-4">
          <Input
            type="file"
            accept=".png,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="border w-full"
            disabled={loading}
          />
          <Button
            onClick={handleUpload}
            disabled={!file || loading}
            className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
          >
            {loading ? "Enviando..." : "Enviar Documento"}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 border rounded bg-gray-50 max-h-80 overflow-auto">
            <h2 className="font-semibold mb-2">{document.fileName}</h2>
            <pre className="text-sm whitespace-pre-wrap">
              {document.textContent}
            </pre>
          </div>

          <div className="space-y-2 my-10">
            <h1 className="font-bold">Tire suas dúvidas!</h1>
            <Input
              type="text"
              placeholder="Faça uma pergunta"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="border p-2 w-full"
            />
            <Button
              onClick={handleAsk}
              disabled={!question || loading}
              className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Carregando..." : "Perguntar"}
            </Button>
            {answer && <p className="mt-2 text-gray-700">Resposta: {answer}</p>}
          </div>

          <Button
            onClick={handleReset}
            className="cursor-pointer text-white px-4 py-2 rounded mt-4"
          >
            Enviar outro arquivo
          </Button>
        </div>
      )}

      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
