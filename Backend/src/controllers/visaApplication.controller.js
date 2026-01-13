import VisaApplication from "../models/VisaApplication.js";
import { getTrackingDetails, updateApplicationStatus } from "../services/application.service.js";
import TripDestination from "../models/TripDestination.js";
import VisaRequirement from "../models/VisaRequirement.js";
import { calculateVisaTimeline } from "../services/visaTimeline.service.js";
import { sendNotification } from "../services/notification.service.js";

export async function getMyApplications(req, res) {
  const apps = await VisaApplication.find({ userId: req.user.uid });
  res.json(apps);
}

export async function getTracking(req, res) {
  const data = await getTrackingDetails(req.params.id);
  res.json(data);
}

export async function startVisaApplication(req, res) {
  const { tripDestinationId } = req.body;

  if (!tripDestinationId) {
    return res.status(400).json({ message: "tripDestinationId is required" });
  }

  const destination = await TripDestination.findById(tripDestinationId);
  if (!destination) {
    return res.status(404).json({ message: "Trip destination not found" });
  }

  if (!destination.visaRequired) {
    return res.status(400).json({ message: "Visa not required for this destination" });
  }

  // Prevent duplicates
  const existing = await VisaApplication.findOne({
    userId: req.user.uid,
    tripDestinationId
  });

  if (existing) {
    return res.json(existing);
  }

  const visaRequirement = await VisaRequirement.findOne({
    destinationCountry: destination.countryId,
    travelPurpose: destination.travelPurpose
  });

  if (!visaRequirement) {
    return res.status(404).json({ message: "Visa requirement not found" });
  }

  const timeline = calculateVisaTimeline({
    entryDate: destination.entryDate,
    processingTimeMax: visaRequirement.processingTimeMax
  });

  const application = await VisaApplication.create({
    userId: req.user.uid,
    tripDestinationId,
    visaRequirementId: visaRequirement._id,
    recommendedSubmissionDate: timeline.latestApplyDate,
    latestSubmissionDate: timeline.latestApplyDate,
    status: "NOT_STARTED"
  });

  res.status(201).json(application);
}



export async function updateStatus(req, res) {
  try {
    const { status, appointmentDate, submissionDate } = req.body;

    const application = await updateApplicationStatus(
      req.params.id,
      status,
      { appointmentDate, submissionDate }
    );

    res.json(application);
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
}




const ALLOWED_TRANSITIONS = {
  NOT_STARTED: ["DOCUMENTS_IN_PROGRESS"],
  DOCUMENTS_IN_PROGRESS: ["APPOINTMENT_BOOKED"],
  APPOINTMENT_BOOKED: ["SUBMITTED"],
  SUBMITTED: ["UNDER_REVIEW"],
  UNDER_REVIEW: ["APPROVED", "REJECTED"],
};

// export async function updateApplicationStatus(req, res) {
//   const { id } = req.params;
//   const { status, appointmentDate, submissionDate, decisionDate } = req.body;

//   const application = await VisaApplication.findById(id);
//   if (!application)
//     return res.status(404).json({ message: "Application not found" });

//   const current = application.status;
//   const allowed = ALLOWED_TRANSITIONS[current] || [];

//   if (!allowed.includes(status)) {
//     return res.status(400).json({
//       message: `Invalid transition from ${current} → ${status}`,
//     });
//   }

//   // Required dates enforcement
//   if (status === "APPOINTMENT_BOOKED" && !appointmentDate) {
//     return res
//       .status(400)
//       .json({ message: "appointmentDate is required" });
//   }

//   if (status === "SUBMITTED" && !submissionDate) {
//     return res
//       .status(400)
//       .json({ message: "submissionDate is required" });
//   }

//   if (["APPROVED", "REJECTED"].includes(status) && !decisionDate) {
//     return res
//       .status(400)
//       .json({ message: "decisionDate is required" });
//   }

//   application.status = status;
//   if (appointmentDate) application.appointmentDate = appointmentDate;
//   if (submissionDate) application.submissionDate = submissionDate;
//   if (decisionDate) application.decisionDate = decisionDate;

//   await application.save();

//   // 🔔 Notifications (both)
//   await sendNotification(application, "STATUS_UPDATE");

//   res.json(application);
// }
