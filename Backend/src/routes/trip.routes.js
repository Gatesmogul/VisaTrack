import express from "express";
import {
  createTrip,
  getMyTrips,
  getTripById,
  updateTripStatus, 
} from "../controllers/trip.controller.js";
import { getDestinationSummary } from "../controllers/tripDestination.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/trips", authMiddleware, createTrip);
router.get("/trips", authMiddleware, getMyTrips);
router.get("/trips/:tripId", authMiddleware, getTripById);
router.patch("/trips/:tripId", authMiddleware, updateTripStatus);
router.get(
  '/trips/:tripId/destinations/:destinationId/summary',
  authMiddleware,
  getDestinationSummary
);

export default router;
