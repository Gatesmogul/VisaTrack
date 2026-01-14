import VisaApplication from "../models/VisaApplication.js";
import { calculateVisaTimeline } from "./timeline.service.js";
import { sendNotification } from "./notification.service.js";

export async function evaluateVisaAlerts() {
  const today = new Date();

  const applications = await VisaApplication.find({
    status: { $in: ["NOT_STARTED", "DOCUMENTS_IN_PROGRESS"] },
    latestSubmissionDate: { $exists: true }
  }).populate("tripDestinationId");

  for (const app of applications) {
    const { entryDate } = app.tripDestinationId;

    const timeline = calculateVisaTimeline({
      entryDate,
      processingTimeMax:
        app.visaRequirementId?.processingTimeMax || 0
    });

    if (timeline.risk === "HIGH") {
      await sendNotification(app, "VISA_HIGH_RISK");
    } else if (timeline.risk === "TIGHT") {
      await sendNotification(app, "VISA_TIMELINE_TIGHT");
    } else if (today >= app.recommendedSubmissionDate) {
      await sendNotification(app, "VISA_APPLY_NOW");
    }
  }
}
