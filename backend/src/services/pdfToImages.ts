import { exec } from "child_process";
import fs from "fs";
import path from "path";

export async function pdfToImages(
  pdfPath: string,
  outputDir = "uploads/pdf_pages"
): Promise<string[]> {
  if (!fs.existsSync(pdfPath)) throw new Error("PDF not found");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  const baseName = path.basename(pdfPath, path.extname(pdfPath));
  const outputPattern = path.join(outputDir, `${baseName}`);

  return new Promise((resolve, reject) => {
    const cmd = `pdftoppm -png "${pdfPath}" "${outputPattern}"`;
    exec(cmd, (error) => {
      if (error) return reject(error);

      const files = fs
        .readdirSync(outputDir)
        .filter((f) => f.startsWith(baseName) && f.endsWith(".png"))
        .map((f) => path.join(outputDir, f))
        .sort();

      resolve(files);
    });
  });
}
