import { VISA_STATUS_FLOW } from "../jobs/visaStatusFlow.js";
import VisaApplication from "../models/VisaApplication.js";
import { checkDocumentCompleteness } from "./document.service.js";
import { sendNotification } from "./notification.service.js";

const updateApplicationStatus = async (
  applicationId,
  newStatus,
  updates = {}
) => {
  const application = await VisaApplication.findById(applicationId)
    .populate("tripDestinationId")
    .populate("visaRequirementId");

  if (!application) throw new Error("Application not found");

  const currentStatus = application.status;

  const allowedNext =
    VISA_STATUS_FLOW[currentStatus] || [];

  if (!allowedNext.includes(newStatus)) {
    throw new Error(
      `Invalid status transition: ${currentStatus} → ${newStatus}`
    );
  }

  // ⛔ Appointment date required
  if (
    newStatus === "APPOINTMENT_BOOKED" &&
    !updates.appointmentDate
  ) {
    throw new Error("appointmentDate is required");
  }
  if (
  newStatus === "UNDER_REVIEW" &&
  application.expectedDecisionDate
) {
  const today =
    new Date().toDateString() ===
    new Date(application.expectedDecisionDate).toDateString();

  if (today) {
    await sendNotification(application, "DECISION_EXPECTED");
  }
}


  // ⛔ Submission date required
  if (
    newStatus === "SUBMITTED" &&
    !updates.submissionDate
  ) {
    throw new Error("submissionDate is required");
  }

  application.status = newStatus;

  if (updates.appointmentDate)
    application.appointmentDate = updates.appointmentDate;

  if (updates.submissionDate)
    application.submissionDate = updates.submissionDate;

  if (updates.decisionDate)
    application.decisionDate = updates.decisionDate;

  await application.save();

  // 🔔 Notify only after successful transition
  await sendNotification(application, "STATUS_UPDATE");

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
    getTrackingDetails, updateApplicationStatus
};

