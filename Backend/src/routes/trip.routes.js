import express from "express";
import {
  createTrip,
  getMyTrips,
  getTripById,
  updateTripStatus
} from "../controllers/trip.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/trips", authMiddleware, createTrip);
router.get("/trips", authMiddleware, getMyTrips);
router.get("/trips/:tripId", authMiddleware, getTripById);
router.patch("/trips/:tripId", authMiddleware, updateTripStatus);

export default router;
