import express from "express";
import {
    createTrip,
    getMyTrips,
    getTripById,
    updateTripStatus
} from "../controllers/trip.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Trips
 *     description: Trip management for travelers
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     TripDestination:
 *       type: object
 *       required:
 *         - country
 *         - arrivalDate
 *         - departureDate
 *       properties:
 *         country:
 *           type: string
 *           description: ISO country code
 *           example: "TH"
 *         arrivalDate:
 *           type: string
 *           format: date
 *         departureDate:
 *           type: string
 *           format: date
 *
 *     TripCreateRequest:
 *       type: object
 *       required:
 *         - destinations
 *       properties:
 *         name:
 *           type: string
 *           example: "Summer Asia Tour"
 *         destinations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TripDestination'
 *
 *     Trip:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         destinations:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/TripDestination'
 *         status:
 *           type: string
 *           enum: [PLANNING, BOOKED, COMPLETED, CANCELLED]
 *         feasibilityStatus:
 *           type: string
 */

/**
 * @swagger
 * /trips:
 *   post:
 *     summary: Create a new trip
 *     description: Creates a multi-country trip itinerary
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TripCreateRequest'
 *     responses:
 *       201:
 *         description: Trip created
 *   get:
 *     summary: Get my trips
 *     description: Returns all trips for the authenticated user
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of trips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 */
router.post("/trips", authMiddleware, createTrip);
router.get("/trips", authMiddleware, getMyTrips);

/**
 * @swagger
 * /trips/{tripId}:
 *   get:
 *     summary: Get trip details
 *     description: Returns detailed information about a specific trip
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
 *         description: Trip details
 *   patch:
 *     summary: Update trip status
 *     description: Updates the status of a trip (e.g., mark as booked)
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
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PLANNING, BOOKED, COMPLETED, CANCELLED]
 *     responses:
 *       200:
 *         description: Trip updated
 */
router.get("/trips/:tripId", authMiddleware, getTripById);
router.patch("/trips/:tripId", authMiddleware, updateTripStatus);


export default router;
