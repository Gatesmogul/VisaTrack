const express = require('express');
const router = express.Router();
const { 
    createApplication, 
    updateApplicationStatus, 
    updateAppointment, 
    getTrackingDetails 
} = require('../services/applicationService');
const { checkDocumentCompleteness } = require('../services/documentService');

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Create a new visa application
 *     description: Creates a new visa application record for a user.
 *     tags: [Applications]
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
 * 
 * /applications/{id}:
 *   get:
 *     summary: Get application tracking details
 *     description: Retrieves detailed tracking information including status, timeline, and document completeness.
 *     tags: [Applications]
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
router.post('/', async (req, res) => {
    try {
        const { userId, requirementId, tripDestinationId } = req.body;
        const application = await createApplication(userId, requirementId, tripDestinationId);
        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get application tracking details
router.get('/:id', async (req, res) => {
    try {
        const details = await getTrackingDetails(req.params.id);
        res.json(details);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

/**
 * @swagger
 * /applications/{id}/status:
 *   patch:
 *     summary: Update application status
 *     description: Updates the status of an application and optionally adds notes or updates dates.
 *     tags: [Applications]
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
 * 
 * /applications/{id}/appointment:
 *   patch:
 *     summary: Update appointment details
 *     description: Updates appointment information for the application.
 *     tags: [Applications]
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
 * 
 * /applications/{id}/completeness:
 *   get:
 *     summary: Check document completeness
 *     description: Verifies if all mandatory documents have been uploaded.
 *     tags: [Applications]
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
router.patch('/:id/status', async (req, res) => {
    try {
        const { status, notes, appointmentDate, submissionDate, decisionDate } = req.body;
        const updates = { notes, appointmentDate, submissionDate, decisionDate };
        const application = await updateApplicationStatus(req.params.id, status, updates);
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update appointment details
router.patch('/:id/appointment', async (req, res) => {
    try {
        const application = await updateAppointment(req.params.id, req.body);
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Check document completeness
router.get('/:id/completeness', async (req, res) => {
    try {
        const result = await checkDocumentCompleteness(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
