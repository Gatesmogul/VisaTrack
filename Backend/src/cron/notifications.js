import cron from "node-cron";
import { processAllNotifications } from "../services/notification.service.js";

cron.schedule("0 9 * * *", async () => {
  await processAllNotifications();
});
