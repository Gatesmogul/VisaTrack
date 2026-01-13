import VisaApplication from "../models/VisaApplication.js";
import { getTrackingDetails } from "../services/application.service.js";
import TripDestination from "../models/TripDestination.js";
import VisaRequirement from "../models/VisaRequirement.js";
import { calculateVisaTimeline } from "../services/visaTimeline.service.js";

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
