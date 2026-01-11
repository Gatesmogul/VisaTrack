import userRoutes from "./user.routes.js";
 import visaRuleRoutes from "./visaRule.routes.js";
 import visaAppRoutes from "./visaApplication.routes.js";
 import documentRoutes from "./document.routes.js";
 import notificationRoutes from "./notification.routes.js";
 import tripRoutes from "./trip.routes.js";
 import tripDestinationRoutes from "./tripDestination.routes.js";
 import userProfileRoutes from "./userProfile.routes.js"

export default function registerRoutes(app) {
  app.use("/api", userRoutes);
  app.use("/api", userProfileRoutes);
  app.use("/api", visaRuleRoutes);
   app.use("/api", visaAppRoutes);
   app.use("/api", documentRoutes);
   app.use("/api", notificationRoutes);
   app.use("/api", tripRoutes);
   app.use("/api", tripDestinationRoutes);
}
