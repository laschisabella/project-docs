import express from "express";
import dotenv from "dotenv";
import fs from "fs";
import { execSync } from "child_process";
import documentRoutes from "./routes/documentRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

if (!fs.existsSync("uploads")) fs.mkdirSync("uploads", { recursive: true });

try {
  execSync("pdftoppm -v", { stdio: "ignore" });
  execSync("pdfinfo -v", { stdio: "ignore" });
  console.log("Poppler detected: OK");
} catch {
  console.error("Poppler not found!");
  process.exit(1);
}

console.log("Routes being loaded...");
app.use("/documents", documentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);
