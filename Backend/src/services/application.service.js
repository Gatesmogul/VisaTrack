import VisaApplication from "../models/VisaApplication.js";
import VisaRequirement from "../models/VisaRequirement.js";
import { calculateTimeline } from "./timeline.service.js";
import { checkDocumentCompleteness } from "./document.service.js";
import { sendNotification } from "./notification.service.js";

const updateApplicationStatus = async (applicationId, newStatus, updates = {}) => {
  const application = await VisaApplication.findById(applicationId)
    .populate("visaRequirementId")
    .populate("tripDestinationId");

  if (!application) throw new Error("Application not found");

  const oldStatus = application.status;
  application.status = newStatus;

  if (updates.appointmentDate) application.appointmentDate = updates.appointmentDate;
  if (updates.submissionDate) application.submissionDate = updates.submissionDate;
  if (updates.decisionDate) application.decisionDate = updates.decisionDate;
  if (updates.notes) application.notes = updates.notes;

  if (updates.submissionDate && application.visaRequirementId) {
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
};

const getTrackingDetails = async (applicationId) => {
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
  updateApplicationStatus,
  getTrackingDetails
};
