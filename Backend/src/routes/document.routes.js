import express from "express";
import multer from "multer";
import { uploadVisaDocument } from "../controllers/document.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

router.post(
  "/visa-applications/:id/documents",
  authMiddleware,
  upload.single("file"),
  uploadVisaDocument
);

export default router;
