import documentRoutes from "./document.routes.js";
import embassyRoutes from "./embassy.routes.js";
import notificationRoutes from "./notification.routes.js";
import tripRoutes from "./trip.routes.js";
import tripDestinationRoutes from "./tripDestination.routes.js";
import userRoutes from "./user.routes.js";
import visaRoutes from "./visa.routes.js";
import visaAppRoutes from "./visaApplication.routes.js";


export default function registerRoutes(app) {
  app.use("/api/v1", userRoutes);
  app.use("/api/v1", visaRoutes);
  app.use("/api/v1", visaAppRoutes);
  app.use("/api/v1", documentRoutes);
  app.use("/api/v1/notifications", notificationRoutes);
  app.use("/api/v1", tripRoutes);
  app.use("/api/v1", tripDestinationRoutes);
  app.use("/api/v1/embassies", embassyRoutes);
  
  app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok", message: "Server is healthy" });
  });
}
