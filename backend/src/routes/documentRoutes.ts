import { Router } from "express";
import multer from "multer";
import {
  uploadDocument,
  getDocumentById,
  askDocument,
} from "../controllers/documentController.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("file"), uploadDocument);
router.get("/:id", getDocumentById);
router.post("/:id/ask", askDocument);

export default router;
