import express from "express";
import {
    acceptTerms,
    getMe,
    saveContactProfile,
    savePassportProfile,
    savePersonalProfile,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireStatus } from "../middlewares/requireStatus.middleware.js";
import { USER_STATUS } from "../models/User.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: User profile and settings management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *         fullName:
 *           type: string
 *         status:
 *           type: string
 *           enum: [PENDING, EMAIL_VERIFIED, PROFILE_INCOMPLETE, PROFILE_COMPLETE, SUSPENDED]
 *         passportCountry:
 *           type: string
 *         residenceCountry:
 *           type: string
 *
 *     PersonalProfileRequest:
 *       type: object
 *       required:
 *         - fullName
 *         - dateOfBirth
 *         - gender
 *       properties:
 *         fullName:
 *           type: string
 *           example: "John Doe"
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: "1990-01-01"
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *           example: "MALE"
 *
 *     ContactProfileRequest:
 *       type: object
 *       required:
 *         - phoneNumber
 *         - residenceCountry
 *         - address
 *       properties:
 *         phoneNumber:
 *           type: string
 *           example: "+2348012345678"
 *         residenceCountry:
 *           type: string
 *           example: "NG"
 *         address:
 *           type: string
 *           example: "123 Main St, Lagos"
 *
 *     PassportProfileRequest:
 *       type: object
 *       required:
 *         - passportNumber
 *         - passportCountry
 *         - expiryDate
 *       properties:
 *         passportNumber:
 *           type: string
 *           example: "A12345678"
 *         passportCountry:
 *           type: string
 *           example: "NG"
 *         expiryDate:
 *           type: string
 *           format: date
 *           example: "2030-12-31"
 */

/**
 * @swagger
 * /v1/users/me:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the profile data of the currently authenticated user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get("/users/me", authMiddleware, getMe);

/**
 * @swagger
 * /v1/users/accept-terms:
 *   post:
 *     summary: Accept terms and conditions
 *     description: Updates user status after they accept terms during onboarding
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Terms accepted successfully
 *       400:
 *         description: User not in correct status to accept terms
 */
router.post(
  "/users/accept-terms",
  authMiddleware,
  requireStatus([USER_STATUS.EMAIL_VERIFIED]),
  acceptTerms
);

/**
 * @swagger
 * /v1/users/profile/personal:
 *   post:
 *     summary: Update personal profile
 *     description: Saves personal details (name, DOB, gender) during onboarding
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PersonalProfileRequest'
 *     responses:
 *       200:
 *         description: Profile updated
 *       400:
 *         description: Invalid data
 */
router.post(
  "/users/profile/personal",
  authMiddleware,
  requireStatus([USER_STATUS.PROFILE_INCOMPLETE]),
  savePersonalProfile
);

/**
 * @swagger
 * /v1/users/profile/contact:
 *   post:
 *     summary: Update contact profile
 *     description: Saves contact details (phone, address, residence) during onboarding
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactProfileRequest'
 *     responses:
 *       200:
 *         description: Contact updated
 */
router.post(
  "/users/profile/contact",
  authMiddleware,
  requireStatus([USER_STATUS.PROFILE_INCOMPLETE]),
  saveContactProfile
);

/**
 * @swagger
 * /v1/users/profile/passport:
 *   post:
 *     summary: Update passport profile
 *     description: Saves passport details during onboarding. Completes user profile.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PassportProfileRequest'
 *     responses:
 *       200:
 *         description: Passport updated and profile completed
 */
router.post(
  "/users/profile/passport",
  authMiddleware,
  requireStatus([USER_STATUS.PROFILE_INCOMPLETE]),
  savePassportProfile
);

export default router;
