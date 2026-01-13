import Notification from "../models/Notification.js";
import VisaApplication from "../models/VisaApplication.js";
import admin from "../config/firebaseAdmin.js"
import { sendPushNotification } from "./push.service.js";

const sendNotification = async (application, type) => {
  const userId = application.userId?._id || application.userId;
  if (!userId) return;

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
  }

 const notification = await Notification.create({
    userId: user._id,
    title,
    message,
    type,
    relatedId: application._id,
    relatedModel: "VisaApplication",
  });

  // 🔔 Push
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


 if (user?.expoPushToken) {
    await sendPushNotification(
      user.expoPushToken,
      title,
      message,
      { applicationId: application._id }
    );

    
  }



};

const processAllNotifications = async () => {
  const applications = await VisaApplication.find({
    status: { $in: ["NOT_STARTED", "DOCUMENTS_IN_PROGRESS"] }
  }).populate("userId");

  for (const app of applications) {
    await sendNotification(app, "DEADLINE_APPROACHING");
  }
};



export {
  sendNotification,
  processAllNotifications
};
