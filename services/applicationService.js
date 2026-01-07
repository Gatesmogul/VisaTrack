const VisaApplication = require('../models/VisaApplication');
const VisaRequirement = require('../models/VisaRequirement');
const { calculateTimeline } = require('./timelineService');
const { checkDocumentCompleteness } = require('./documentService');
const { sendNotification } = require('./notificationService');

const createApplication = async (userId, requirementId, tripDestinationId) => {
    try {
        // Check if application already exists
        const existing = await VisaApplication.findOne({
            userId,
            visaRequirementId: requirementId
        });
        if (existing) return existing;

        const application = new VisaApplication({
            userId,
            visaRequirementId: requirementId,
            tripDestinationId,
            status: 'NOT_STARTED',
            statusHistory: [{
                status: 'NOT_STARTED',
                notes: 'Application initialized'
            }]
        });

        return await application.save();
    } catch (error) {
        console.error('Error creating application:', error);
        throw error;
    }
};

const updateApplicationStatus = async (applicationId, newStatus, updates = {}) => {
    try {
        const application = await VisaApplication.findById(applicationId).populate('visaRequirementId tripDestinationId');
        if (!application) throw new Error('Application not found');

        const oldStatus = application.status;
        
        // Only update if status changed or just updating notes/dates without status change?
        // Assuming we want to record history even if status is same but important note added?
        // For now, record history if status changes OR if explicit note provided for history.
        
        if (oldStatus !== newStatus || updates.notes) {
            application.statusHistory.push({
                status: newStatus,
                notes: updates.notes || `Status updated from ${oldStatus} to ${newStatus}`,
                changedAt: new Date()
            });
        }

        application.status = newStatus;
        
        // Merge date updates
        if (updates.appointmentDate) application.appointmentDate = updates.appointmentDate;
        if (updates.submissionDate) application.submissionDate = updates.submissionDate;
        if (updates.decisionDate) application.decisionDate = updates.decisionDate;
        // application.notes = updates.notes; // Removed to avoid overwriting main notes with specific update notes, or maybe keep? 
        // Let's keep main notes field for "Current/General Notes" and use history for audit.
        if (updates.notes) application.notes = updates.notes; 

        // Re-calculate timeline if submission date changed
        if (updates.submissionDate && application.visaRequirementId && application.tripDestinationId) {
            const timeline = calculateTimeline(
                application.visaRequirementId,
                application.tripDestinationId.entryDate,
                updates.submissionDate
            );
            application.expectedDecisionDate = timeline.expectedDecisionDate;
        }

        await application.save();

        // Trigger notification for status change
        if (oldStatus !== newStatus) {
            await sendNotification(application, 'STATUS_UPDATE');
        }

        return application;
    } catch (error) {
        console.error('Error updating application status:', error);
        throw error;
    }
};

const updateAppointment = async (applicationId, appointmentData) => {
    try {
        const application = await VisaApplication.findById(applicationId);
        if (!application) throw new Error('Application not found');

        application.appointment = {
            ...application.appointment,
            ...appointmentData
        };
        
        // Auto-update status if not already set
        if (application.status === 'DOCUMENTS_IN_PROGRESS' || application.status === 'NOT_STARTED') {
             application.status = 'APPOINTMENT_BOOKED';
             application.statusHistory.push({
                 status: 'APPOINTMENT_BOOKED',
                 notes: 'Appointment details added',
                 changedAt: new Date()
             });
        }

        return await application.save();
    } catch (error) {
        console.error('Error updating appointment:', error);
        throw error;
    }
};

/**
 * Get full tracking details for an application
 */
const getTrackingDetails = async (applicationId) => {
    try {
        const application = await VisaApplication.findById(applicationId)
            .populate('tripDestinationId')
            .populate('visaRequirementId');
        
        if (!application) throw new Error('Application not found');

        const completeness = await checkDocumentCompleteness(applicationId);
        
        // Return structured tracking data
        return {
            application,
            completeness,
            progressPercentage: calculateProgress(application.status, completeness),
            currentStep: application.status,
            updatedAt: application.updatedAt
        };
    } catch (error) {
        console.error('Error fetching tracking details:', error);
        throw error;
    }
};

/**
 * Helper to calculate rough progress percentage
 */
const calculateProgress = (status, completeness) => {
    const statusWeights = {
        'NOT_STARTED': 0,
        'DOCUMENTS_IN_PROGRESS': 20,
        'APPOINTMENT_BOOKED': 40,
        'SUBMITTED': 60,
        'UNDER_REVIEW': 80,
        'APPROVED': 100,
        'REJECTED': 100,
        'CANCELLED': 0
    };

    let baseProgress = statusWeights[status] || 0;
    
    // Adjust based on document completeness if not yet submitted
    if (status === 'DOCUMENTS_IN_PROGRESS' || status === 'NOT_STARTED') {
        const docRatio = completeness.totalMandatory > 0 
            ? (completeness.uploadedCount / completeness.totalMandatory) * 20 
            : 0;
        baseProgress = Math.max(baseProgress, Math.round(docRatio));
    }

    return baseProgress;
};

module.exports = {
    createApplication,
    updateApplicationStatus,
    updateAppointment,
    getTrackingDetails
};
