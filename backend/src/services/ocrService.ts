import Tesseract from "tesseract.js";
import fs from "fs";

export async function extractText(filePath: string): Promise<string> {
  if (!fs.existsSync(filePath)) throw new Error("File not found");

  const {
    data: { text },
  } = await Tesseract.recognize(filePath, "por");
  return text;
}
