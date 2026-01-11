import express from "express";
import { getMyApplications, getTracking } from "../controllers/visaApplication.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/visa-applications", authMiddleware, getMyApplications);
router.get("/visa-applications/:id/tracking", authMiddleware, getTracking);

export default router;
