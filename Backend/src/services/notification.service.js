import Notification from "../models/Notification.js";
import VisaApplication from "../models/VisaApplication.js";
import admin from "../config/firebaseAdmin.js";
import { sendPushNotification } from "./push.service.js";
import { calculateVisaTimeline } from "./visaTimeline.service.js";
import { differenceInDays } from "date-fns";

/* ---------------- Core sender ---------------- */
const sendNotification = async (application, type) => {
  const user = application.userId;
  if (!user) return;

  let title = "Visa Update";
  let message = "";

  switch (type) {
    case "DEADLINE_APPROACHING":
      title = "Upcoming Deadline";
      message = "Your visa submission deadline is approaching.";
      break;

    case "DECISION_EXPECTED":
      title = "Decision Expected";
      message = "Your visa decision is expected today.";
      break;

    case "STATUS_UPDATE":
      title = "Status Updated";
      message = `Your application status is now ${application.status}`;
      break;

    /* 🆕 VISA TIMELINE ALERTS */
    case "VISA_APPLY_NOW":
      title = "Visa Application Reminder";
      message = "You should start your visa application now.";
      break;

    case "VISA_TIMELINE_TIGHT":
      title = "Visa Timeline Tight";
      message =
        "Your visa timeline is tight. Delays may affect your trip.";
      break;

    case "VISA_HIGH_RISK":
      title = "High Risk Visa Timeline";
      message =
        "⚠️ High risk: Your visa may not be ready before travel.";
      break;

    default:
      return;
  }

  const notification = await Notification.create({
    userId: user._id,
    title,
    message,
    type,
    relatedId: application._id,
    relatedModel: "VisaApplication",
  });

  /* 🔔 Firebase Push */
  if (user.pushToken) {
    await admin.messaging().send({
      token: user.pushToken,
      notification: {
        title,
        body: message,
      },
      data: {
        notificationId: notification._id.toString(),
      },
    });
  }

  /* 🔔 Expo Push */
  if (user.expoPushToken) {
    await sendPushNotification(
      user.expoPushToken,
      title,
      message,
      { applicationId: application._id }
    );
  }
};

/* ---------------- Visa Timeline Alert Engine ---------------- */
const processVisaTimelineAlerts = async () => {
  const applications = await VisaApplication.find({
    status: { $in: ["NOT_STARTED", "DOCUMENTS_IN_PROGRESS"] },
    latestSubmissionDate: { $exists: true },
  })
    .populate("userId")
    .populate("tripDestinationId")
    .populate("visaRequirementId");

  const now = new Date();

  for (const app of applications) {
    const timeline = calculateVisaTimeline({
      entryDate: app.tripDestinationId.entryDate,
      processingTimeMax:
        app.visaRequirementId?.processingTimeMax || 0,
    });

    if (timeline.risk === "HIGH") {
      await sendNotification(app, "VISA_HIGH_RISK");
    } else if (timeline.risk === "TIGHT") {
      await sendNotification(app, "VISA_TIMELINE_TIGHT");
    } else if (now >= app.recommendedSubmissionDate) {
      await sendNotification(app, "VISA_APPLY_NOW");
    }
  }
};

/* ---------------- Legacy (kept, but optional) ---------------- */


const processAllNotifications = async () => {
  const applications = await VisaApplication.find({
    status: { $in: ["NOT_STARTED", "DOCUMENTS_IN_PROGRESS"] },
    latestSubmissionDate: { $ne: null },
  }).populate("userId");

  for (const app of applications) {
    const daysLeft = differenceInDays(
      new Date(app.latestSubmissionDate),
      new Date()
    );

    if (daysLeft <= 7 && daysLeft >= 0) {
      await sendNotification(app, "DEADLINE_APPROACHING");
    }
  }
};


export {
  sendNotification,
  processVisaTimelineAlerts,
  processAllNotifications,
};
