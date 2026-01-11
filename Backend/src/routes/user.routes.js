import express from "express";
import { syncUser, getMe, savePushToken, acceptTerms } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.post("/users", authMiddleware, syncUser);
router.post("/users/accept-terms", authMiddleware, acceptTerms);
router.post(
  "/users/push-token",
  authMiddleware,
  savePushToken
);

router.get("/users/me", authMiddleware, getMe);
router.post("/users/sync", authMiddleware, syncUser)

export default router;
