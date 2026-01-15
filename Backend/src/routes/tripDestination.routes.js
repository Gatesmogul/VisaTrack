import express from "express";
import {
    addDestinationToTrip,
    getTripDestinations
} from "../controllers/tripDestination.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * /trips/{tripId}/destinations:
 *   post:
 *     summary: Add a destination to a trip
 *     description: Adds a new country destination to an existing trip itinerary
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TripDestination'
 *     responses:
 *       201:
 *         description: Destination added
 *   get:
 *     summary: Get trip destinations
 *     description: Returns all destinations for a specific trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of destinations
 */
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
