// src/routes/userProfile.routes.js
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  savePersonalProfile,
  saveContactProfile,
  savePassportProfile,
} from "../controllers/user.controller.js";

const router = express.Router();
router.post("/users/profile/personal", authMiddleware, savePersonalProfile);
router.post("/users/profile/contact", authMiddleware, saveContactProfile);
router.post("/users/profile/passport", authMiddleware, savePassportProfile);

router.post("/passport", async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      passportNumber,
      issuingCountry,
      issueDate,
      expiryDate,
    } = req.body;

    // basic validation
    if (!passportNumber || !issuingCountry || !issueDate || !expiryDate) {
      return res.status(400).json({ message: "Missing passport fields" });
    }

    await User.findByIdAndUpdate(userId, {
      profileCompleted: true,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save passport details" });
  }
});

export default router;