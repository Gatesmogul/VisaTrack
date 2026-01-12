import VisaApplication from "../models/VisaApplication.js";
import VisaRequirement from "../models/VisaRequirement.js";
import { calculateTimeline } from "./timeline.service.js";
import { checkDocumentCompleteness } from "./document.service.js";
import { sendNotification } from "./notification.service.js";

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
    const application = await VisaApplication.findById(applicationId)
      .populate("visaRequirementId")
      .populate("tripDestinationId");

    if (!application) throw new Error("Application not found");

    const oldStatus = application.status;

    if (oldStatus !== newStatus || updates.notes) {
        application.statusHistory.push({
            status: newStatus,
            notes: updates.notes || `Status updated from ${oldStatus} to ${newStatus}`,
            changedAt: new Date()
        });
    }

    application.status = newStatus;

    if (updates.appointmentDate) application.appointmentDate = updates.appointmentDate;
    if (updates.submissionDate) application.submissionDate = updates.submissionDate;
    if (updates.decisionDate) application.decisionDate = updates.decisionDate;
    if (updates.notes) application.notes = updates.notes;

    if (updates.submissionDate && application.visaRequirementId && application.tripDestinationId) {
      const timeline = calculateTimeline(
        application.visaRequirementId,
        application.tripDestinationId.entryDate,
        updates.submissionDate
      );

      application.expectedDecisionDate = timeline.expectedDecisionDate;
    }

    await application.save();

    if (oldStatus !== newStatus) {
      await sendNotification(application, "STATUS_UPDATE");
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

const getTrackingDetails = async (applicationId) => {
  try {
    const application = await VisaApplication.findById(applicationId)
      .populate("tripDestinationId")
      .populate("visaRequirementId");

    if (!application) throw new Error("Application not found");

    const completeness = await checkDocumentCompleteness(applicationId);

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

const calculateProgress = (status, completeness) => {
  const statusWeights = {
    NOT_STARTED: 0,
    DOCUMENTS_IN_PROGRESS: 20,
    APPOINTMENT_BOOKED: 40,
    SUBMITTED: 60,
    UNDER_REVIEW: 80,
    APPROVED: 100,
    REJECTED: 100,
    CANCELLED: 0
  };

  let progress = statusWeights[status] || 0;

  if (["NOT_STARTED", "DOCUMENTS_IN_PROGRESS"].includes(status)) {
    const ratio =
      completeness.totalMandatory > 0
        ? (completeness.uploadedCount / completeness.totalMandatory) * 20
        : 0;

    progress = Math.max(progress, Math.round(ratio));
  }

  return progress;
};

export {
  createApplication,
  updateApplicationStatus,
  updateAppointment,
  getTrackingDetails
};
