import express from "express";
import { getMyApplications, getTracking, startVisaApplication, updateStatus } from "../controllers/visaApplication.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.get("/visa-applications", authMiddleware, getMyApplications);
router.get("/visa-applications/:id/tracking", authMiddleware, getTracking);


router.post(
  "/visa-applications/start",
  authMiddleware,
  startVisaApplication
);



router.post(
  "/visa-applications/:id/status",
  authMiddleware,
  updateStatus
);



export default router;
