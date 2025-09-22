import fs from "fs";
import { extractText } from "./ocrService.js";
import { pdfToImages } from "./pdfToImages.js";

export async function extractTextFromPdf(pdfPath: string): Promise<string> {
  const images = await pdfToImages(pdfPath);
  let fullText = "";

  for (const imgPath of images) {
    const text = await extractText(imgPath);
    fullText += text + "\n";
    fs.unlinkSync(imgPath);
  }

  return fullText.trim();
}
