import Country from "../models/Country.js";
import DocumentRequirement from "../models/DocumentRequirement.js";
import Milestone from "../models/Milestone.js";
import SavedRequirement from "../models/SavedRequirement.js";
import Trip from "../models/Trip.js";
import VisaApplication from "../models/VisaApplication.js";
import VisaLookup from "../models/VisaLookup.js";

import { analyzeMultiCountryFeasibility } from "../services/feasibility.service.js";
import { calculateTimeline, createMilestonesForApplication } from "../services/timeline.service.js";
import { determineVisaRequirement, getVisaDetails } from "../services/visaRulesEngine.service.js";

/**
 * ============================================
 * FLOW 1: Visa Requirement Lookup
 * ============================================
 */

/**
 * POST /api/v1/visa/lookup
 * Main visa requirement lookup endpoint
 */
export const lookupVisaRequirement = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { 
      passportCountry,      // ISO code (e.g., 'US')
      destinationCountry,   // ISO code (e.g., 'TH')
      purpose = 'TOURISM',
      arrivalDate,
      departureDate,
      hasValidVisaFrom      // Optional: array of countries for conditional access
    } = req.body;

    if (!passportCountry || !destinationCountry) {
      return res.status(400).json({ 
        error: 'passportCountry and destinationCountry are required' 
      });
    }

    // Call the rules engine
    const result = await determineVisaRequirement(
      passportCountry,
      destinationCountry,
      purpose,
      { arrivalDate, departureDate },
      { 
        hasValidVisaFrom,
        passportExpiryDate: req.user?.passport?.expiryDate
      }
    );

    // Log the lookup for history
    if (userId) {
      const passportDoc = await Country.findOne({ isoCode: passportCountry.toUpperCase() });
      const destDoc = await Country.findOne({ isoCode: destinationCountry.toUpperCase() });
      
      await VisaLookup.create({
        user: userId,
        passportCountry: passportDoc?._id,
        destinationCountry: destDoc?._id,
        travelPurpose: purpose,
        visaType: result.visaType
      });
    }

    res.json({
      success: true,
      data: result
    });
  } catch (err) {
    console.error('Visa lookup error:', err);
    res.status(500).json({ 
      error: 'Visa lookup failed', 
      message: err.message 
    });
  }
};

/**
 * GET /api/v1/visa/details/:ruleId
 * Get detailed visa information (lazy-loaded)
 */
export const getVisaDetailedInfo = async (req, res) => {
  try {
    const { ruleId } = req.params;
    
    const details = await getVisaDetails(ruleId);
    
    res.json({
      success: true,
      data: details
    });
  } catch (err) {
    console.error('Visa details error:', err);
    res.status(500).json({ 
      error: 'Failed to get visa details', 
      message: err.message 
    });
  }
};

/**
 * ============================================
 * FLOW 2: Application Tracking
 * ============================================
 */

/**
 * POST /api/v1/applications
 * Create a new visa application
 */
export const createApplication = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      tripId,
      tripDestinationId,
      destinationCountry,
      visaType,
      applicationChannel,
      referenceNumber
    } = req.body;

    // Get visa requirement if available
    const destCountry = await Country.findOne({ 
      $or: [
        { isoCode: destinationCountry },
        { _id: destinationCountry }
      ]
    });

    const application = await VisaApplication.create({
      userId,
      tripId,
      tripDestinationId,
      destinationCountry: destCountry?._id,
      destinationIsoCode: destCountry?.isoCode,
      applicationChannel: applicationChannel || 'EVISA_PORTAL',
      referenceNumber,
      status: 'NOT_STARTED'
    });

    // Calculate timeline and create milestones
    if (req.body.tripDate) {
      const timeline = await calculateTimeline({
        tripDate: req.body.tripDate,
        destinationIsoCode: destCountry?.isoCode,
        visaType
      });
      
      await createMilestonesForApplication(application._id, timeline);
      
      // Update application with timeline dates
      application.latestSubmissionDate = timeline.keyDates.latestSubmissionDate;
      application.recommendedSubmissionDate = timeline.keyDates.recommendedStartDate;
      application.expectedDecisionDate = timeline.keyDates.expectedDecisionDate;
      await application.save();
    }

    res.status(201).json({
      success: true,
      data: application
    });
  } catch (err) {
    console.error('Create application error:', err);
    res.status(500).json({ 
      error: 'Failed to create application', 
      message: err.message 
    });
  }
};

/**
 * GET /api/v1/applications/dashboard
 * Get user's application dashboard
 */
export const getApplicationsDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const applications = await VisaApplication.getDashboard(userId);
    
    // Get upcoming deadlines (next 14 days)
    const now = new Date();
    const twoWeeks = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    const upcomingMilestones = await Milestone.find({
      applicationId: { $in: applications.map(a => a._id) },
      completed: false,
      dueDate: { $gte: now, $lte: twoWeeks }
    }).sort({ dueDate: 1 });

    // Calculate status summary
    const statusSummary = {
      notStarted: applications.filter(a => a.status === 'NOT_STARTED').length,
      inProgress: applications.filter(a => ['DOCUMENTS_IN_PROGRESS', 'APPOINTMENT_BOOKED', 'SUBMITTED', 'UNDER_REVIEW'].includes(a.status)).length,
      approved: applications.filter(a => a.status === 'APPROVED').length,
      needsAttention: applications.filter(a => a.status === 'ADDITIONAL_DOCS_REQUESTED').length
    };

    res.json({
      success: true,
      data: {
        applications,
        upcomingDeadlines: upcomingMilestones,
        statusSummary,
        totalApplications: applications.length
      }
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).json({ 
      error: 'Failed to load dashboard', 
      message: err.message 
    });
  }
};

/**
 * PATCH /api/v1/applications/:applicationId/status
 * Update application status
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status, notes, referenceNumber, appointmentDate, submissionDate } = req.body;
    
    const application = await VisaApplication.findOne({
      _id: applicationId,
      userId: req.user._id
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (status) application.status = status;
    if (notes) application.notes = notes;
    if (referenceNumber) application.referenceNumber = referenceNumber;
    if (appointmentDate) application.appointmentDate = appointmentDate;
    if (submissionDate) application.submissionDate = submissionDate;

    await application.save();

    res.json({
      success: true,
      data: application
    });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ 
      error: 'Failed to update status', 
      message: err.message 
    });
  }
};

/**
 * ============================================
 * FLOW 3: Document Checklist
 * ============================================
 */

/**
 * GET /api/v1/applications/:applicationId/checklist
 * Get document checklist for an application
 */
export const getApplicationChecklist = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    const application = await VisaApplication.findOne({
      _id: applicationId,
      userId: req.user._id
    }).populate('visaRequirementId');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Get document requirements
    const requirements = await DocumentRequirement.getChecklistForVisa(
      application.visaRequirementId
    );

    // Get uploaded documents
    const VisaApplicationDocument = (await import('../models/VisaApplicationDocument.js')).default;
    const uploadedDocs = await VisaApplicationDocument.find({
      visaApplicationId: applicationId
    });

    // Build checklist with status
    const checklist = requirements.map(req => {
      const uploaded = uploadedDocs.find(d => d.documentType === req.documentType);
      return {
        id: req._id,
        documentType: req.documentType,
        name: req.name,
        description: req.description,
        mandatory: req.mandatory,
        specifications: req.specifications,
        tips: req.tips,
        templateUrls: req.templateUrls,
        status: uploaded ? (uploaded.verified ? 'VALID' : 'UPLOADED') : 'PENDING',
        uploadedDoc: uploaded || null
      };
    });

    // Calculate progress
    const totalRequired = requirements.filter(r => r.mandatory).length;
    const completed = uploadedDocs.filter(d => 
      requirements.find(r => r.documentType === d.documentType && r.mandatory)
    ).length;
    const percentage = totalRequired > 0 ? Math.round((completed / totalRequired) * 100) : 0;

    res.json({
      success: true,
      data: {
        checklist,
        progress: {
          totalRequired,
          completed,
          percentage
        },
        validationErrors: uploadedDocs
          .filter(d => !d.verified && d.validationErrors?.length > 0)
          .flatMap(d => d.validationErrors)
      }
    });
  } catch (err) {
    console.error('Checklist error:', err);
    res.status(500).json({ 
      error: 'Failed to load checklist', 
      message: err.message 
    });
  }
};

/**
 * ============================================
 * FLOW 4: Timeline Calculator
 * ============================================
 */

/**
 * POST /api/v1/timeline/calculate
 * Calculate visa application timeline
 */
export const calculateVisaTimeline = async (req, res) => {
  try {
    const {
      tripDate,
      destinationCountry,
      visaType,
      processingTimeMin,
      processingTimeMax,
      visaRequirementId
    } = req.body;

    if (!tripDate) {
      return res.status(400).json({ error: 'tripDate is required' });
    }

    const destCountry = await Country.findOne({ 
      $or: [
        { isoCode: destinationCountry },
        { _id: destinationCountry }
      ]
    });

    const timeline = await calculateTimeline({
      visaRequirementId,
      tripDate,
      destinationIsoCode: destCountry?.isoCode || destinationCountry,
      visaType,
      processingTimeMin,
      processingTimeMax,
      userPreferences: req.user?.notificationPreferences || {}
    });

    res.json({
      success: true,
      data: timeline
    });
  } catch (err) {
    console.error('Timeline calculation error:', err);
    res.status(500).json({ 
      error: 'Failed to calculate timeline', 
      message: err.message 
    });
  }
};

/**
 * ============================================
 * FLOW 5: Multi-Country Trip Planner
 * ============================================
 */

/**
 * POST /api/v1/trips/plan
 * Analyze multi-country trip feasibility
 */
export const analyzeTrip = async (req, res) => {
  try {
    const {
      destinations,  // Array of { countryCode, arrivalDate, departureDate }
      purpose = 'TOURISM'
    } = req.body;

    if (!destinations || destinations.length === 0) {
      return res.status(400).json({ error: 'destinations array is required' });
    }

    // Get passport country from user profile
    const user = req.user;
    let passportCountryCode = req.body.passportCountry;
    
    if (!passportCountryCode && user?.passportCountry) {
      const passportCountry = await Country.findById(user.passportCountry);
      passportCountryCode = passportCountry?.isoCode;
    }

    if (!passportCountryCode) {
      return res.status(400).json({ 
        error: 'passportCountry is required (either in request or user profile)' 
      });
    }

    const analysis = await analyzeMultiCountryFeasibility({
      passportCountryCode,
      destinations,
      purpose,
      userContext: {
        passportExpiryDate: user?.passport?.expiryDate
      }
    });

    res.json({
      success: true,
      data: analysis
    });
  } catch (err) {
    console.error('Trip analysis error:', err);
    res.status(500).json({ 
      error: 'Failed to analyze trip', 
      message: err.message 
    });
  }
};

/**
 * GET /api/v1/trips/:tripId/feasibility
 * Get feasibility analysis for an existing trip
 */
export const getTripFeasibility = async (req, res) => {
  try {
    const { tripId } = req.params;
    
    const trip = await Trip.findOne({
      _id: tripId,
      userId: req.user._id
    });

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Get trip destinations
    const TripDestination = (await import('../models/TripDestination.js')).default;
    const tripDestinations = await TripDestination.find({ tripId })
      .populate('countryId')
      .sort({ entryDate: 1 });

    if (tripDestinations.length === 0) {
      return res.json({
        success: true,
        data: {
          feasibilityStatus: 'NOT_ANALYZED',
          message: 'No destinations added to trip yet'
        }
      });
    }

    // Get passport country
    const user = req.user;
    const passportCountry = await Country.findById(user.passportCountry);

    // Run analysis
    const analysis = await analyzeMultiCountryFeasibility({
      passportCountryCode: passportCountry?.isoCode,
      destinations: tripDestinations.map(td => ({
        countryCode: td.countryId.isoCode,
        arrivalDate: td.entryDate,
        departureDate: td.exitDate
      })),
      purpose: trip.purpose,
      userContext: {
        passportExpiryDate: user?.passport?.expiryDate
      }
    });

    // Update trip with analysis results
    trip.feasibilityStatus = analysis.feasibilityStatus;
    trip.feasibilityIssues = analysis.issues;
    trip.recommendations = analysis.recommendations;
    trip.optimalApplicationOrder = analysis.optimalApplicationOrder;
    trip.lastFeasibilityCheck = new Date();
    await trip.save();

    res.json({
      success: true,
      data: analysis
    });
  } catch (err) {
    console.error('Trip feasibility error:', err);
    res.status(500).json({ 
      error: 'Failed to get trip feasibility', 
      message: err.message 
    });
  }
};

/**
 * ============================================
 * Legacy endpoints (backward compatibility)
 * ============================================
 */

export const lookupVisa = async (req, res) => {
  try {
    const userId = req.user._id;
    const { passportCountryId, destinationCountryId, travelPurpose } = req.query;

    const passportCountry = await Country.findById(passportCountryId);
    const destCountry = await Country.findById(destinationCountryId);

    if (!passportCountry || !destCountry) {
      return res.status(400).json({ error: 'Invalid country IDs' });
    }

    const result = await determineVisaRequirement(
      passportCountry.isoCode,
      destCountry.isoCode,
      travelPurpose || 'TOURISM'
    );

    await VisaLookup.create({
      user: userId,
      passportCountry: passportCountryId,
      destinationCountry: destinationCountryId,
      travelPurpose,
      visaType: result.visaType
    });

    res.json({
      requirement: result,
      documents: result.documentChecklist || []
    });
  } catch (err) {
    console.error('Legacy lookup error:', err);
    res.status(500).json({ message: "Visa lookup failed" });
  }
};

export const getRecentLookups = async (req, res) => {
  const lookups = await VisaLookup.find({ user: req.user?.dbUser?._id || req.user?._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("passportCountry destinationCountry");

  res.json(
    lookups.map((l) => ({
      id: l._id,
      passportCountry: {
        code: l.passportCountry?.isoCode,
        name: l.passportCountry?.name,
      },
      destinationCountry: {
        code: l.destinationCountry?.isoCode,
        name: l.destinationCountry?.name,
      },
      travelPurpose: l.travelPurpose,
      visaType: l.visaType ?? "UNKNOWN",
      createdAt: l.createdAt,
    }))
  );
};

export const saveRequirement = async (req, res) => {
  const { visaRequirementId } = req.body;
  await SavedRequirement.create({
    user: req.user._id,
    visaRequirement: visaRequirementId,
  });
  res.json({ message: "Saved successfully" });
};

export const getSavedRequirements = async (req, res) => {
  const saved = await SavedRequirement.find({ user: req.user._id })
    .populate({
      path: "visaRequirement",
      populate: [
        { path: "passportCountry" },
        { path: "destinationCountry" },
      ],
    })
    .sort({ createdAt: -1 });
  res.json(saved);
};

export const removeSavedRequirement = async (req, res) => {
  await SavedRequirement.deleteOne({
    _id: req.params.id,
    user: req.user._id,
  });
  res.json({ success: true });
};
