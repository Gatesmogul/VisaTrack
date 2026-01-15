import express from "express";
import { checkVisa, getVisaDocuments } from "../controllers/visaRule.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Visa Rules
 *     description: Core visa requirement rules and logic
 */

/**
 * @swagger
 * /visa-rules/check:
 *   get:
 *     summary: Check visa requirement
 *     description: Returns the visa type required for a specific passport and destination
 *     tags: [Visa Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: passportCountryId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: destinationCountryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Visa rule found
 */
router.get("/visa-rules/check", authMiddleware, checkVisa);

/**
 * @swagger
 * /visa-rules/{id}/documents:
 *   get:
 *     summary: Get required documents for a rule
 *     description: Returns the detailed document checklist for a specific visa rule
 *     tags: [Visa Rules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of documents
 */
router.get("/visa-rules/:id/documents", authMiddleware, getVisaDocuments);


export default router;
