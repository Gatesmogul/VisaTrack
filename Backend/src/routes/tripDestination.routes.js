import express from "express";
import {
  addDestinationToTrip,
  getTripDestinations
} from "../controllers/tripDestination.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/trips/:tripId/destinations",
  authMiddleware,
  addDestinationToTrip
);

router.get(
  "/trips/:tripId/destinations",
  authMiddleware,
  getTripDestinations
);

export default router;
