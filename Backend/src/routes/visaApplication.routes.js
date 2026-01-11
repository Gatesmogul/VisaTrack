import express from "express";
import { 
    createApplication, 
    updateApplicationStatus, 
    updateAppointment, 
    getTrackingDetails 
} from "../services/application.service.js";
import { checkDocumentCompleteness } from "../services/document.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /visa-applications:
 *   post:
 *     summary: Create a new visa application
 *     description: Creates a new visa application record for a user.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - requirementId
 *               - tripDestinationId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user creating the application.
 *               requirementId:
 *                 type: string
 *                 description: The ID of the visa requirement being applied for.
 *               tripDestinationId:
 *                 type: string
 *                 description: The ID of the associated trip destination.
 *     responses:
 *       201:
 *         description: The created application.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VisaApplication'
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { userId, requirementId, tripDestinationId } = req.body;
        // In a real app, userId should probably come from req.user set by authMiddleware
        // conforming to the existing signature for now
        const application = await createApplication(userId || req.user.id, requirementId, tripDestinationId);
        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /visa-applications/{id}:
 *   get:
 *     summary: Get application tracking details
 *     description: Retrieves detailed tracking information including status, timeline, and document completeness.
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The application ID
 *     responses:
 *       200:
 *         description: Application details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 application:
 *                   $ref: '#/components/schemas/VisaApplication'
 *                 completeness:
 *                   type: object
 *                   properties:
 *                     isComplete:
 *                       type: boolean
 *                     missingMandatory:
 *                       type: array
 *                       items:
 *                         type: string
 *                 progressPercentage:
 *                   type: integer
 *                 currentStep:
 *                   type: string
 *       404:
 *         description: Application not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const details = await getTrackingDetails(req.params.id);
        res.json(details);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * @swagger
 * /visa-applications/{id}/status:
 *   patch:
 *     summary: Update application status
 *     description: Updates the status of an application and optionally adds notes or updates dates.
 *     tags: [Applications]
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
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [NOT_STARTED, DOCUMENTS_IN_PROGRESS, APPOINTMENT_BOOKED, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, CANCELLED]
 *               notes:
 *                 type: string
 *               appointmentDate:
 *                 type: string
 *                 format: date-time
 *               submissionDate:
 *                 type: string
 *                 format: date-time
 *               decisionDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       500:
 *         description: Server error
 */
router.patch('/:id/status', authMiddleware, async (req, res) => {
    try {
        const { status, notes, appointmentDate, submissionDate, decisionDate } = req.body;
        const updates = { notes, appointmentDate, submissionDate, decisionDate };
        const application = await updateApplicationStatus(req.params.id, status, updates);
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /visa-applications/{id}/appointment:
 *   patch:
 *     summary: Update appointment details
 *     description: Updates appointment information for the application.
 *     tags: [Applications]
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
 *               date:
 *                 type: string
 *                 format: date-time
 *               location:
 *                 type: string
 *               address:
 *                 type: string
 *               currentNotes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 *       500:
 *         description: Server error
 */
router.patch('/:id/appointment', authMiddleware, async (req, res) => {
    try {
        const application = await updateAppointment(req.params.id, req.body);
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/**
 * @swagger
 * /visa-applications/{id}/completeness:
 *   get:
 *     summary: Check document completeness
 *     description: Verifies if all mandatory documents have been uploaded.
 *     tags: [Applications]
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
 *         description: Completeness status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isComplete:
 *                   type: boolean
 *                 missingMandatory:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/:id/completeness', authMiddleware, async (req, res) => {
    try {
        const result = await checkDocumentCompleteness(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
