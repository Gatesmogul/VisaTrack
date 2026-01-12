import express from "express";
import { checkVisa, getVisaDocuments } from "../controllers/visaRule.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/visa-rules/check", authMiddleware, checkVisa);
router.get("/visa-rules/:id/documents", authMiddleware, getVisaDocuments);

export default router;
