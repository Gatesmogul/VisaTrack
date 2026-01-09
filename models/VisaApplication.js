const mongoose = require('mongoose');

const visaApplicationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tripDestinationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TripDestination',
        required: true
    },
    visaRequirementId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VisaRequirement'
    },
    documents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'VisaApplicationDocument'
    }],
    statusHistory: [{
        status: {
            type: String,
            enum: ['NOT_STARTED', 'DOCUMENTS_IN_PROGRESS', 'APPOINTMENT_BOOKED', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED']
        },
        changedAt: {
            type: Date,
            default: Date.now
        },
        notes: String
    }],
    appointment: {
        date: Date,
        location: String,
        address: String,
        type: String,
        notes: String
    },
    applicationDate: {
        type: Date
    },
    appointmentDate: {
        type: Date
    },
    submissionDate: {
        type: Date
    },
    decisionDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['NOT_STARTED', 'DOCUMENTS_IN_PROGRESS', 'APPOINTMENT_BOOKED', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED'],
        default: 'NOT_STARTED'
    },
    expectedDecisionDate: {
        type: Date
    },
    latestSubmissionDate: {
        type: Date
    },
    recommendedSubmissionDate: {
        type: Date
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
});

/**
 * @swagger
 * components:
 *   schemas:
 *     VisaApplication:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The auto-generated id of the application
 *         userId:
 *           type: string
 *         visaRequirementId:
 *           type: string
 *         status:
 *           type: string
 *           enum: [NOT_STARTED, DOCUMENTS_IN_PROGRESS, APPOINTMENT_BOOKED, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED, CANCELLED]
 *         appointment:
 *           type: object
 *           properties:
 *             date:
 *               type: string
 *               format: date-time
 *             location:
 *               type: string
 *         statusHistory:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               changedAt:
 *                 type: string
 *                 format: date-time
 *               notes:
 *                 type: string
 *       example:
 *         _id: 60d0fe4f5311236168a109ca
 *         status: DOCUMENTS_IN_PROGRESS
 *         userId: 60d0fe4f5311236168a109cb
 */
module.exports = mongoose.model('VisaApplication', visaApplicationSchema);
