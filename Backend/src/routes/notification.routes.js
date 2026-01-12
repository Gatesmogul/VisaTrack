import express from "express";
import { getMyNotifications, markAsRead } from "../controllers/notification.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/notifications", authMiddleware, getMyNotifications);
router.patch("/notifications/:id/read", authMiddleware, markAsRead);

export default router;
