import type { Request, Response } from "express";
import { saveDocument, getDocument } from "../services/documentService.js";
import { extractText } from "../services/ocrService.js";
import { extractTextFromPdf } from "../services/pdfOcrService.js";
import { answerQuestion } from "../services/ragService.js";

export async function uploadDocument(req: Request, res: Response) {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    let textContent: string;
    const ext = file.originalname.split(".").pop()?.toLowerCase();

    if (ext === "pdf") {
      textContent = await extractTextFromPdf(file.path);
    } else if (["png", "jpg", "jpeg"].includes(ext!)) {
      textContent = await extractText(file.path);
    } else {
      return res.status(400).json({ error: "Unsupported file format" });
    }

    const saved = await saveDocument({
      fileName: file.originalname,
      textContent,
      filePath: file.path,
    });

    res.status(201).json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing document" });
  }
}

export async function getDocumentById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ error: "ID not provided" });

    const doc = await getDocument(id);
    if (!doc) return res.status(404).json({ error: "Document not found" });
    res.json(doc);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching document" });
  }
}

export async function askDocument(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { question } = req.body;

    if (!id) return res.status(400).json({ error: "ID not provided" });
    if (!question)
      return res.status(400).json({ error: "Question not provided" });

    const answer = await answerQuestion(id, question);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error processing question" });
  }
}
