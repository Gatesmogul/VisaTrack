import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireStatus } from "../middlewares/requireStatus.middleware.js";
import {
  getMe,
  acceptTerms,
  savePersonalProfile,
  saveContactProfile,
  savePassportProfile,
} from "../controllers/user.controller.js";
import { USER_STATUS } from "../models/User.js";

const router = express.Router();

router.get("/users/me", authMiddleware, getMe);

router.post(
  "/users/accept-terms",
  authMiddleware,
  requireStatus([USER_STATUS.EMAIL_VERIFIED]),
  acceptTerms
);

router.post(
  "/users/profile/personal",
  authMiddleware,
  requireStatus([USER_STATUS.PROFILE_INCOMPLETE]),
  savePersonalProfile
);

router.post(
  "/users/profile/contact",
  authMiddleware,
  requireStatus([USER_STATUS.PROFILE_INCOMPLETE]),
  saveContactProfile
);

router.post(
  "/users/profile/passport",
  authMiddleware,
  requireStatus([USER_STATUS.PROFILE_INCOMPLETE]),
  savePassportProfile
);

export default router;
