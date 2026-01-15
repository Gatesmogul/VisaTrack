import express from "express";
import {
    // Flow 5: Multi-Country Trip Planner
    analyzeTrip,
    // Flow 4: Timeline Calculator
    calculateVisaTimeline,
    // Flow 2: Application Tracking
    createApplication,
    // Flow 3: Document Checklist
    getApplicationChecklist,
    getApplicationsDashboard,
    getRecentLookups,
    getSavedRequirements,
    getTripFeasibility,
    getVisaDetailedInfo,
    // Legacy endpoints (backward compatibility)
    lookupVisa,
    // Flow 1: Visa Requirement Lookup
    lookupVisaRequirement,
    removeSavedRequirement,
    saveRequirement,
    updateApplicationStatus
} from "../controllers/visa.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { requireStatus } from "../middlewares/requireStatus.middleware.js";
import { USER_STATUS } from "../models/User.js";

const router = express.Router();

// Middleware for authenticated routes with complete profile
const requireCompleteProfile = [
  authMiddleware,
  requireStatus([USER_STATUS.PROFILE_COMPLETE])
];

/**
 * @swagger
 * tags:
 *   - name: Visa Lookup
 *     description: Flow 1 - Visa Requirement Lookup endpoints
 *   - name: Applications
 *     description: Flow 2 - Visa Application Tracking endpoints
 *   - name: Documents
 *     description: Flow 3 - Document Checklist endpoints
 *   - name: Timeline
 *     description: Flow 4 - Timeline Calculator endpoints
 *   - name: Trip Planning
 *     description: Flow 5 - Multi-Country Trip Planner endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VisaLookupRequest:
 *       type: object
 *       required:
 *         - passportCountry
 *         - destinationCountry
 *       properties:
 *         passportCountry:
 *           type: string
 *           description: ISO 3166-1 alpha-2 country code for passport nationality
 *           example: "NG"
 *         destinationCountry:
 *           type: string
 *           description: ISO 3166-1 alpha-2 country code for destination
 *           example: "TH"
 *         purpose:
 *           type: string
 *           enum: [TOURISM, BUSINESS, TRANSIT, STUDY, WORK, DIPLOMATIC, MEDICAL]
 *           default: TOURISM
 *           description: Purpose of travel
 *         arrivalDate:
 *           type: string
 *           format: date
 *           example: "2026-03-15"
 *           description: Planned arrival date
 *         departureDate:
 *           type: string
 *           format: date
 *           example: "2026-03-30"
 *           description: Planned departure date
 *         hasValidVisaFrom:
 *           type: array
 *           items:
 *             type: string
 *           example: ["US", "GB"]
 *           description: Countries the traveler has valid visas from (for conditional access)
 *
 *     VisaLookupResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             visaType:
 *               type: string
 *               enum: [VISA_FREE, E_VISA, VISA_ON_ARRIVAL, EMBASSY_VISA, TRANSIT_VISA, ETA, TRAVEL_AUTH]
 *               example: "VISA_ON_ARRIVAL"
 *             visaTypeFriendly:
 *               type: string
 *               example: "Visa on Arrival"
 *             destination:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Thailand"
 *                 isoCode:
 *                   type: string
 *                   example: "TH"
 *             passport:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Nigeria"
 *                 isoCode:
 *                   type: string
 *                   example: "NG"
 *             allowedStayDays:
 *               type: integer
 *               example: 15
 *             processingTime:
 *               type: object
 *               properties:
 *                 min:
 *                   type: integer
 *                   example: 0
 *                 max:
 *                   type: integer
 *                   example: 1
 *                 unit:
 *                   type: string
 *                   example: "business days"
 *             fees:
 *               type: object
 *               properties:
 *                 visaCost:
 *                   type: number
 *                   example: 35
 *                 currency:
 *                   type: string
 *                   example: "USD"
 *             passportValidityDays:
 *               type: integer
 *               example: 180
 *             preArrivalRequirements:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: "TDAC"
 *                   name:
 *                     type: string
 *                     example: "Thailand Digital Arrival Card"
 *                   portalUrl:
 *                     type: string
 *                     example: "https://tdac.immigration.go.th"
 *                   advanceHours:
 *                     type: integer
 *                     example: 72
 *                   mandatory:
 *                     type: boolean
 *                     example: true
 *             warnings:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     example: "PRE_ARRIVAL_FORM"
 *                   severity:
 *                     type: string
 *                     enum: [ERROR, WARNING, INFO]
 *                     example: "WARNING"
 *                   message:
 *                     type: string
 *                     example: "Thailand Digital Arrival Card must be completed 72 hours before arrival"
 *
 *     ApplicationCreateRequest:
 *       type: object
 *       required:
 *         - tripDestinationId
 *         - destinationCountry
 *       properties:
 *         tripId:
 *           type: string
 *           description: MongoDB ObjectId of the trip
 *         tripDestinationId:
 *           type: string
 *           description: MongoDB ObjectId of the trip destination
 *         destinationCountry:
 *           type: string
 *           example: "AU"
 *         visaType:
 *           type: string
 *           enum: [VISA_FREE, E_VISA, VISA_ON_ARRIVAL, EMBASSY_VISA, ETA, TRAVEL_AUTH]
 *           example: "ETA"
 *         applicationChannel:
 *           type: string
 *           enum: [EMBASSY, VFS_GLOBAL, TLS_CONTACT, EVISA_PORTAL, ETA_PORTAL, MOBILE_APP, ON_ARRIVAL, AGENCY]
 *           example: "MOBILE_APP"
 *         tripDate:
 *           type: string
 *           format: date
 *           example: "2026-06-01"
 *           description: Travel date for timeline calculation
 *
 *     ApplicationStatusUpdate:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [NOT_STARTED, DOCUMENTS_IN_PROGRESS, APPOINTMENT_BOOKED, SUBMITTED, UNDER_REVIEW, ADDITIONAL_DOCS_REQUESTED, APPROVED, REJECTED, CANCELLED]
 *           example: "SUBMITTED"
 *         notes:
 *           type: string
 *           example: "Application submitted via VFS"
 *         referenceNumber:
 *           type: string
 *           example: "VFS-2026-123456"
 *         appointmentDate:
 *           type: string
 *           format: date-time
 *         submissionDate:
 *           type: string
 *           format: date-time
 *
 *     TimelineRequest:
 *       type: object
 *       required:
 *         - tripDate
 *       properties:
 *         tripDate:
 *           type: string
 *           format: date
 *           example: "2026-06-15"
 *           description: Planned travel date
 *         destinationCountry:
 *           type: string
 *           example: "AU"
 *         visaType:
 *           type: string
 *           example: "E_VISA"
 *         processingTimeMin:
 *           type: integer
 *           example: 3
 *         processingTimeMax:
 *           type: integer
 *           example: 10
 *         visaRequirementId:
 *           type: string
 *           description: MongoDB ObjectId of visa requirement (optional)
 *
 *     TimelineResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             summary:
 *               type: object
 *               properties:
 *                 daysUntilTrip:
 *                   type: integer
 *                   example: 45
 *                 visaType:
 *                   type: string
 *                   example: "E_VISA"
 *             keyDates:
 *               type: object
 *               properties:
 *                 travelDate:
 *                   type: string
 *                   format: date-time
 *                 latestSubmissionDate:
 *                   type: string
 *                   format: date-time
 *                 recommendedStartDate:
 *                   type: string
 *                   format: date-time
 *                 expectedDecisionDate:
 *                   type: string
 *                   format: date-time
 *             riskAssessment:
 *               type: object
 *               properties:
 *                 level:
 *                   type: string
 *                   enum: [LOW, MEDIUM, HIGH, CRITICAL]
 *                   example: "LOW"
 *                 message:
 *                   type: string
 *                   example: "Comfortable timeline for application."
 *                 color:
 *                   type: string
 *                   enum: [green, yellow, orange, red]
 *                   example: "green"
 *             milestones:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   milestoneType:
 *                     type: string
 *                   name:
 *                     type: string
 *                   dueDate:
 *                     type: string
 *                     format: date-time
 *
 *     TripPlanRequest:
 *       type: object
 *       required:
 *         - destinations
 *       properties:
 *         passportCountry:
 *           type: string
 *           example: "NG"
 *           description: ISO country code (uses user profile if not provided)
 *         purpose:
 *           type: string
 *           enum: [TOURISM, BUSINESS, TRANSIT, STUDY, WORK]
 *           default: TOURISM
 *         destinations:
 *           type: array
 *           items:
 *             type: object
 *             required:
 *               - countryCode
 *               - arrivalDate
 *               - departureDate
 *             properties:
 *               countryCode:
 *                 type: string
 *                 example: "TH"
 *               arrivalDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-15"
 *               departureDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-03-22"
 *
 *     TripFeasibilityResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             feasibilityStatus:
 *               type: string
 *               enum: [FEASIBLE, RISKY, IMPOSSIBLE, NOT_ANALYZED]
 *               example: "FEASIBLE"
 *             feasibilityScore:
 *               type: integer
 *               minimum: 0
 *               maximum: 100
 *               example: 85
 *             feasibilityMessage:
 *               type: string
 *               example: "Your trip is feasible with proper planning."
 *             summary:
 *               type: object
 *               properties:
 *                 totalDestinations:
 *                   type: integer
 *                 visaFreeDestinations:
 *                   type: integer
 *                 visasRequired:
 *                   type: integer
 *                 issueCount:
 *                   type: integer
 *             optimalApplicationOrder:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   order:
 *                     type: integer
 *                   countryCode:
 *                     type: string
 *                   countryName:
 *                     type: string
 *                   visaType:
 *                     type: string
 *                   startBy:
 *                     type: string
 *                     format: date
 *
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *         message:
 *           type: string
 */

// ============================================
// FLOW 1: Visa Requirement Lookup
// ============================================

/**
 * @swagger
 * /visa/lookup:
 *   post:
 *     summary: Look up visa requirements
 *     description: Determines what visa (if any) is required for travel from one country to another. Includes pre-arrival requirements, processing times, fees, and validation warnings.
 *     tags: [Visa Lookup]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VisaLookupRequest'
 *           examples:
 *             nigeria-to-thailand:
 *               summary: Nigerian passport to Thailand
 *               value:
 *                 passportCountry: "NG"
 *                 destinationCountry: "TH"
 *                 purpose: "TOURISM"
 *                 arrivalDate: "2026-03-15"
 *             us-to-uae:
 *               summary: US passport to UAE (visa-free)
 *               value:
 *                 passportCountry: "US"
 *                 destinationCountry: "AE"
 *             india-to-uae-with-us-visa:
 *               summary: Indian passport to UAE with US visa
 *               value:
 *                 passportCountry: "IN"
 *                 destinationCountry: "AE"
 *                 hasValidVisaFrom: ["US"]
 *     responses:
 *       200:
 *         description: Visa requirement found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VisaLookupResponse'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "passportCountry and destinationCountry are required"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Server error
 */
router.post("/visa/lookup", authMiddleware, lookupVisaRequirement);

/**
 * @swagger
 * /visa/details/{ruleId}:
 *   get:
 *     summary: Get detailed visa information
 *     description: Returns comprehensive visa details including document checklist, application steps, and guidelines. Use for lazy-loading additional information.
 *     tags: [Visa Lookup]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: ruleId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the visa requirement
 *         example: "507f1f77bcf86cd799439011"
 *     responses:
 *       200:
 *         description: Detailed visa information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     visaType:
 *                       type: string
 *                     documentChecklist:
 *                       type: array
 *                       items:
 *                         type: object
 *                     applicationSteps:
 *                       type: array
 *                       items:
 *                         type: object
 *                     officialGuidelinesUrl:
 *                       type: string
 *       404:
 *         description: Visa rule not found
 *       401:
 *         description: Unauthorized
 */
router.get("/visa/details/:ruleId", authMiddleware, getVisaDetailedInfo);

/**
 * @swagger
 * /visa/lookup:
 *   get:
 *     summary: Look up visa requirements (Legacy)
 *     description: Legacy endpoint using query parameters. Use POST /visa/lookup for new implementations.
 *     tags: [Visa Lookup]
 *     deprecated: true
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: passportCountryId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of passport country
 *       - in: query
 *         name: destinationCountryId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of destination country
 *       - in: query
 *         name: travelPurpose
 *         schema:
 *           type: string
 *           enum: [TOURISM, BUSINESS, TRANSIT, STUDY, WORK]
 *     responses:
 *       200:
 *         description: Visa requirement found
 *       404:
 *         description: No visa information found
 */
router.get("/visa/lookup", requireCompleteProfile, lookupVisa);

/**
 * @swagger
 * /visa/recent:
 *   get:
 *     summary: Get recent visa lookups
 *     description: Returns the user's 5 most recent visa requirement lookups
 *     tags: [Visa Lookup]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of recent lookups
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   passportCountry:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                       name:
 *                         type: string
 *                   destinationCountry:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                       name:
 *                         type: string
 *                   visaType:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 */
router.get("/visa/recent", requireCompleteProfile, getRecentLookups);

/**
 * @swagger
 * /visa/save:
 *   post:
 *     summary: Save a visa requirement
 *     description: Saves a visa requirement for quick access later
 *     tags: [Visa Lookup]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - visaRequirementId
 *             properties:
 *               visaRequirementId:
 *                 type: string
 *                 description: MongoDB ObjectId of the visa requirement
 *     responses:
 *       200:
 *         description: Saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Saved successfully"
 */
router.post("/visa/save", requireCompleteProfile, saveRequirement);

/**
 * @swagger
 * /visa/saved:
 *   get:
 *     summary: Get saved visa requirements
 *     description: Returns all visa requirements saved by the user
 *     tags: [Visa Lookup]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of saved requirements
 */
router.get("/visa/saved", requireCompleteProfile, getSavedRequirements);

/**
 * @swagger
 * /saved/{id}:
 *   delete:
 *     summary: Remove a saved visa requirement
 *     description: Removes a visa requirement from saved list
 *     tags: [Visa Lookup]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the saved requirement
 *     responses:
 *       200:
 *         description: Removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 */
router.delete("/saved/:id", requireCompleteProfile, removeSavedRequirement);

// ============================================
// FLOW 2: Application Tracking
// ============================================

/**
 * @swagger
 * /applications:
 *   post:
 *     summary: Create a new visa application
 *     description: Creates a new visa application and optionally calculates timeline milestones
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationCreateRequest'
 *           example:
 *             tripDestinationId: "507f1f77bcf86cd799439011"
 *             destinationCountry: "AU"
 *             visaType: "ETA"
 *             applicationChannel: "MOBILE_APP"
 *             tripDate: "2026-06-01"
 *     responses:
 *       201:
 *         description: Application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     status:
 *                       type: string
 *                       example: "NOT_STARTED"
 *                     latestSubmissionDate:
 *                       type: string
 *                       format: date-time
 *                     recommendedSubmissionDate:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized
 */
router.post("/applications", requireCompleteProfile, createApplication);

/**
 * @swagger
 * /applications/dashboard:
 *   get:
 *     summary: Get application dashboard
 *     description: Returns all user's visa applications with status summary and upcoming deadlines
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     applications:
 *                       type: array
 *                       items:
 *                         type: object
 *                     upcomingDeadlines:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           dueDate:
 *                             type: string
 *                             format: date-time
 *                     statusSummary:
 *                       type: object
 *                       properties:
 *                         notStarted:
 *                           type: integer
 *                         inProgress:
 *                           type: integer
 *                         approved:
 *                           type: integer
 *                         needsAttention:
 *                           type: integer
 *                     totalApplications:
 *                       type: integer
 */
router.get("/applications/dashboard", requireCompleteProfile, getApplicationsDashboard);

/**
 * @swagger
 * /applications/{applicationId}/status:
 *   patch:
 *     summary: Update application status
 *     description: Updates the status and other details of a visa application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApplicationStatusUpdate'
 *           examples:
 *             mark-submitted:
 *               summary: Mark as submitted
 *               value:
 *                 status: "SUBMITTED"
 *                 referenceNumber: "VFS-2026-123456"
 *                 submissionDate: "2026-04-01T10:00:00Z"
 *             mark-approved:
 *               summary: Mark as approved
 *               value:
 *                 status: "APPROVED"
 *                 notes: "Visa approved - 90 days multiple entry"
 *     responses:
 *       200:
 *         description: Status updated successfully
 *       404:
 *         description: Application not found
 *       401:
 *         description: Unauthorized
 */
router.patch("/applications/:applicationId/status", requireCompleteProfile, updateApplicationStatus);

// ============================================
// FLOW 3: Document Checklist
// ============================================

/**
 * @swagger
 * /applications/{applicationId}/checklist:
 *   get:
 *     summary: Get document checklist
 *     description: Returns the document checklist for a visa application with upload status and validation errors
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the application
 *     responses:
 *       200:
 *         description: Document checklist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     checklist:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           documentType:
 *                             type: string
 *                             example: "PASSPORT"
 *                           name:
 *                             type: string
 *                             example: "Valid Passport"
 *                           mandatory:
 *                             type: boolean
 *                           status:
 *                             type: string
 *                             enum: [PENDING, UPLOADED, VALID, INVALID]
 *                           tips:
 *                             type: array
 *                             items:
 *                               type: string
 *                     progress:
 *                       type: object
 *                       properties:
 *                         totalRequired:
 *                           type: integer
 *                           example: 5
 *                         completed:
 *                           type: integer
 *                           example: 2
 *                         percentage:
 *                           type: integer
 *                           example: 40
 *                     validationErrors:
 *                       type: array
 *                       items:
 *                         type: string
 *       404:
 *         description: Application not found
 */
router.get("/applications/:applicationId/checklist", requireCompleteProfile, getApplicationChecklist);

// ============================================
// FLOW 4: Timeline Calculator
// ============================================

/**
 * @swagger
 * /timeline/calculate:
 *   post:
 *     summary: Calculate visa application timeline
 *     description: Calculates key dates, milestones, and risk assessment for a visa application based on travel date and processing times. Includes peak season detection.
 *     tags: [Timeline]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TimelineRequest'
 *           examples:
 *             australia-trip:
 *               summary: Trip to Australia
 *               value:
 *                 tripDate: "2026-06-15"
 *                 destinationCountry: "AU"
 *                 visaType: "E_VISA"
 *             peak-season:
 *               summary: Peak season trip
 *               value:
 *                 tripDate: "2026-12-20"
 *                 destinationCountry: "TH"
 *                 visaType: "E_VISA"
 *                 processingTimeMax: 7
 *     responses:
 *       200:
 *         description: Timeline calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimelineResponse'
 *       400:
 *         description: Missing tripDate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "tripDate is required"
 */
router.post("/timeline/calculate", authMiddleware, calculateVisaTimeline);

// ============================================
// FLOW 5: Multi-Country Trip Planner
// ============================================

/**
 * @swagger
 * /trips/plan:
 *   post:
 *     summary: Analyze multi-country trip feasibility
 *     description: Analyzes feasibility of a multi-country trip, detects timeline conflicts, passport submission overlaps, and recommends optimal visa application order
 *     tags: [Trip Planning]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TripPlanRequest'
 *           examples:
 *             southeast-asia:
 *               summary: Southeast Asia tour
 *               value:
 *                 passportCountry: "NG"
 *                 purpose: "TOURISM"
 *                 destinations:
 *                   - countryCode: "TH"
 *                     arrivalDate: "2026-03-15"
 *                     departureDate: "2026-03-22"
 *                   - countryCode: "VN"
 *                     arrivalDate: "2026-03-22"
 *                     departureDate: "2026-03-28"
 *                   - countryCode: "KH"
 *                     arrivalDate: "2026-03-28"
 *                     departureDate: "2026-04-03"
 *             africa-safari:
 *               summary: Africa safari tour
 *               value:
 *                 passportCountry: "US"
 *                 destinations:
 *                   - countryCode: "KE"
 *                     arrivalDate: "2026-07-01"
 *                     departureDate: "2026-07-05"
 *                   - countryCode: "TZ"
 *                     arrivalDate: "2026-07-05"
 *                     departureDate: "2026-07-10"
 *                   - countryCode: "RW"
 *                     arrivalDate: "2026-07-10"
 *                     departureDate: "2026-07-14"
 *     responses:
 *       200:
 *         description: Trip analysis completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TripFeasibilityResponse'
 *       400:
 *         description: Missing destinations or passport country
 */
router.post("/trips/plan", authMiddleware, analyzeTrip);

/**
 * @swagger
 * /trips/{tripId}/feasibility:
 *   get:
 *     summary: Get trip feasibility analysis
 *     description: Returns feasibility analysis for an existing trip, updating the trip with latest analysis results
 *     tags: [Trip Planning]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the trip
 *     responses:
 *       200:
 *         description: Feasibility analysis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TripFeasibilityResponse'
 *       404:
 *         description: Trip not found
 */
router.get("/trips/:tripId/feasibility", requireCompleteProfile, getTripFeasibility);

export default router;


