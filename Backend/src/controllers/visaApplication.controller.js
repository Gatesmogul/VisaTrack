import VisaApplication from "../models/VisaApplication.js";
import { getTrackingDetails } from "../services/application.service.js";

export async function getMyApplications(req, res) {
  const apps = await VisaApplication.find({ userId: req.user.uid });
  res.json(apps);
}

export async function getTracking(req, res) {
  const data = await getTrackingDetails(req.params.id);
  res.json(data);
}
