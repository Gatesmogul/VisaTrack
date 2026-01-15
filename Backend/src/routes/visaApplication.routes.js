import express from "express";
import { getMyApplications, getTracking, startVisaApplication, updateStatus } from "../controllers/visaApplication.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Visa Applications (Direct)
 *     description: Direct management of individual visa applications
 */

/**
 * @swagger
 * /visa-applications:
 *   get:
 *     summary: Get all my visa applications
 *     description: Returns a list of all visa applications for the authenticated user
 *     tags: [Visa Applications (Direct)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VisaApplication'
 */
router.get("/visa-applications", authMiddleware, getMyApplications);

/**
 * @swagger
 * /visa-applications/{id}/tracking:
 *   get:
 *     summary: Get application tracking info
 *     description: Returns real-time tracking information for a specific application from the official portal if available
 *     tags: [Visa Applications (Direct)]
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
 *         description: Tracking details
 */
router.get("/visa-applications/:id/tracking", authMiddleware, getTracking);

/**
 * @swagger
 * /visa-applications/start:
 *   post:
 *     summary: Start a new visa application
 *     description: Initializes a new visa application record for a specific requirement
 *     tags: [Visa Applications (Direct)]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - tripDestinationId
 *             properties:
 *               tripDestinationId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Application started
 */
router.post(
  "/visa-applications/start",
  authMiddleware,
  startVisaApplication
);

/**
 * @swagger
 * /visa-applications/{id}/status:
 *   post:
 *     summary: Update application status (Classic)
 *     description: Legacy status update endpoint using POST. Use PATCH /applications/{id}/status for new implementations.
 *     tags: [Visa Applications (Direct)]
 *     deprecated: true
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Status updated
 */
router.post(
  "/visa-applications/:id/status",
  authMiddleware,
  updateStatus
);




export default router;
