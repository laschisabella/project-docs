import { query } from "../config/db.js";

export interface Document {
  id?: string;
  fileName: string;
  textContent: string;
  filePath: string;
  createdAt?: Date;
}

export async function saveDocument({
  fileName,
  textContent,
  filePath,
}: Document): Promise<Document> {
  const sql = `
    INSERT INTO documents (file_name, text_content, file_path)
    VALUES ($1, $2, $3)
    RETURNING id, created_at;
  `;
  const res = await query(sql, [fileName, textContent, filePath]);
  return {
    id: res.rows[0].id,
    createdAt: res.rows[0].created_at,
    fileName,
    textContent,
    filePath,
  };
}

export async function getDocument(id: string): Promise<Document | null> {
  const res = await query("SELECT * FROM documents WHERE id = $1", [id]);
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return {
    id: row.id,
    fileName: row.file_name,
    textContent: row.text_content,
    filePath: row.file_path,
    createdAt: row.created_at,
  };
}
