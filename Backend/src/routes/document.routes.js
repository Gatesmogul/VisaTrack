import express from "express";
import multer from "multer";
import { uploadVisaDocument } from "../controllers/document.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const upload = multer({ dest: "uploads/" });
const router = express.Router();

/**
 * @swagger
 * /visa-applications/{id}/documents:
 *   post:
 *     summary: Upload a visa document
 *     description: Uploads a document (passport scan, photo, etc.) for a specific visa application.
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Application ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               documentType:
 *                 type: string
 *                 example: "PASSPORT"
 *     responses:
 *       200:
 *         description: Document uploaded successfully
 */
router.post(
  "/visa-applications/:id/documents",
  authMiddleware,
  upload.single("file"),
  uploadVisaDocument
);


export default router;
