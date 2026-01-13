import userRoutes from "./user.routes.js";
 import visaRoutes from "./visa.routes.js";
 import visaAppRoutes from "./visaApplication.routes.js";
 import documentRoutes from "./document.routes.js";
 import notificationRoutes from "./notification.routes.js";
 import tripRoutes from "./trip.routes.js";
 import tripDestinationRoutes from "./tripDestination.routes.js";


export default function registerRoutes(app) {
  app.use("/api", userRoutes);
 
  app.use("/api", visaRoutes);
   app.use("/api", visaAppRoutes);
   app.use("/api", documentRoutes);
   app.use("/api", notificationRoutes);
   app.use("/api", tripRoutes);
   app.use("/api", tripDestinationRoutes);
}
