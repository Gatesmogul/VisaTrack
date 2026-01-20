import mongoose from 'mongoose';

/**
 * Visa Types aligned with 5 user flow categories
 */
const VISA_TYPES = [
  'VISA_FREE',        // No visa required, entry stamp only
  'E_VISA',           // Electronic visa (online application)
  'VISA_ON_ARRIVAL',  // VOA at port of entry (being phased out in many countries)
  'EMBASSY_VISA',     // Traditional consular/embassy application
  'TRANSIT_VISA',     // Airport transit only
  'ETA',              // Electronic Travel Authorization (Kenya, Australia)
  'TRAVEL_AUTH'       // Travel Authorization (Seychelles)
];

const TRAVEL_PURPOSES = ['TOURISM', 'BUSINESS', 'TRANSIT', 'STUDY', 'WORK', 'DIPLOMATIC', 'MEDICAL'];

const APPLICATION_METHODS = [
  'ONLINE',           // eVisa portal
  'EMBASSY',          // In-person at embassy/consulate
  'VFS_GLOBAL',       // VFS Global center (South Africa, etc.)
  'TLS_CONTACT',      // TLS Contact center
  'ON_ARRIVAL',       // At port of entry
  'MOBILE_APP',       // Australia ETA app
  'NONE'              // Visa-free entry
];

/**
 * Pre-arrival Digital Requirements (2026 updates)
 * Many countries now require digital forms before travel
 */
const PRE_ARRIVAL_TYPES = [
  'E_TICKET',         // Dominican Republic mandatory digital form
  'TDAC',             // Thailand Digital Arrival Card (72h before)
  'ETA',              // Kenya ETA, Australia ETA
  'TRAVEL_AUTH',      // Seychelles Travel Authorization
  'HEALTH_DECLARATION',
  'DIGITAL_LANDING_CARD'  // Nigeria
];

/**
 * @swagger
 * components:
 *   schemas:
 *     VisaRequirement:
 *       type: object
 *       required:
 *         - passportCountry
 *         - destinationCountry
 *         - travelPurpose
 *         - visaType
 *       properties:
 *         passportCountry:
 *           type: string
 *           description: ID of the passport country
 *         destinationCountry:
 *           type: string
 *           description: ID of the destination country
 *         travelPurpose:
 *           type: string
 *           enum: [TOURISM, BUSINESS, TRANSIT, STUDY, WORK, DIPLOMATIC, MEDICAL]
 *         visaType:
 *           type: string
 *           enum: [VISA_FREE, E_VISA, VISA_ON_ARRIVAL, EMBASSY_VISA, TRANSIT_VISA, ETA, TRAVEL_AUTH]
 *         applicationMethod:
 *           type: string
 *           enum: [ONLINE, EMBASSY, VFS_GLOBAL, TLS_CONTACT, ON_ARRIVAL, MOBILE_APP, NONE]
 *         allowedStayDays:
 *           type: integer
 *         processingTimeMin:
 *           type: integer
 *         processingTimeMax:
 *           type: integer
 *         visaCost:
 *           type: number
 *         passportValidityDays:
 *           type: integer
 */
const visaRequirementSchema = new mongoose.Schema(
  {
    // Core relationship: passport nationality → destination country
    passportCountry: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Country', 
      required: true 
    },
    destinationCountry: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Country', 
      required: true 
    },
    travelPurpose: {
      type: String,
      enum: TRAVEL_PURPOSES,
      required: true
    },
    
    // Primary visa type determination
    visaType: {
      type: String,
      enum: VISA_TYPES,
      required: true
    },
    
    // Application method
    applicationMethod: {
      type: String,
      enum: APPLICATION_METHODS,
      required: true
    },
    
    // Stay duration
    visaFreeDays: Number,           // For visa-free entries
    allowedStayDays: Number,        // Maximum permitted stay
    validityPeriodDays: Number,     // How long visa is valid from issuance
    
    // Processing times (in business days)
    processingTimeMin: { type: Number, default: 1 },
    processingTimeMax: { type: Number, default: 7 },
    
    // Fees
    visaCost: Number,
    currency: { type: String, default: 'USD' },
    additionalFees: [{
      name: String,         // e.g., "Biometric fee", "VFS service charge"
      amount: Number,
      currency: String
    }],
    
    // Passport requirements (critical for rejection prevention)
    passportValidityDays: { 
      type: Number, 
      default: 180   // 6 months standard, South Africa uses 30
    },
    blankPagesRequired: { type: Number, default: 2 },
    
    // Required documents for visa application
    requiredDocuments: [{ type: String }],
    
    /**
     * Eligibility Conditions - handles nationality-based exceptions
     * Examples:
     * - ECOWAS members visa-free in Ghana/Nigeria
     * - EAC members visa-free in Kenya/Uganda/Tanzania
     * - GCC nationals need only ID for UAE
     * - Indians with US/UK/EU visa get UAE VOA
     */
    eligibilityConditions: {
      // If traveler's country is in these blocs, apply special rules
      exemptBlocs: [{
        type: String,
        enum: ['ECOWAS', 'EAC', 'GCC', 'AU', 'EU', 'SCHENGEN', 'SADC', 'COMESA']
      }],
      // Conditional VOA (e.g., Indians with valid US/UK/EU visa for UAE)
      conditionalAccess: {
        requiresValidVisaFrom: [String],  // Country ISO codes
        validVisaTypes: [String],         // e.g., ['TOURIST', 'BUSINESS', 'RESIDENCE']
        minVisaValidityDays: Number       // e.g., 6 months for UAE
      },
      // Countries explicitly excluded
      excludedCountries: [String],  // ISO codes
      notes: String
    },
    
    /**
     * Pre-Arrival Digital Requirements (2026 policies)
     * Many countries now require digital submissions before travel
     */
    preArrivalRequirements: [{
      type: {
        type: String,
        enum: PRE_ARRIVAL_TYPES
      },
      name: String,                   // e.g., "Thailand Digital Arrival Card"
      portalUrl: String,              // Official portal URL
      advanceHours: Number,           // How many hours before arrival (72 for TDAC)
      mandatory: { type: Boolean, default: true },
      cost: Number,
      currency: String,
      notes: String
    }],
    
    /**
     * Yellow Fever Requirements
     */
    yellowFeverRequired: {
      type: String,
      enum: ['ALWAYS', 'CONDITIONAL', 'NOT_REQUIRED'],
      default: 'NOT_REQUIRED'
    },
    yellowFeverConditions: {
      // Required if coming from endemic countries
      ifFromEndemicCountry: { type: Boolean, default: false },
      // Required if transiting through endemic country
      ifTransitingEndemic: { type: Boolean, default: false },
      // Age exemptions
      exemptUnderAge: Number,    // e.g., 9 months
      exemptOverAge: Number,     // e.g., 60 years
      notes: String
    },
    
    // Application URLs and resources
    applicationUrl: String,
    officialGuidelinesUrl: String,
    
    // Additional notes and restrictions
    notes: String,
    restrictions: [String],  // e.g., "No paid work permitted", "Land border entry not available"
    
    /**
     * Version tracking for policy updates
     */
    version: { type: Number, default: 1 },
    effectiveDate: { type: Date, default: Date.now },
    deprecatedDate: Date,
    isActive: { type: Boolean, default: true },
    
    // Audit trail
    lastVerifiedDate: Date,
    lastVerifiedSource: String,  // e.g., "Official embassy website", "IATA Timatic"
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Compound index for fast visa lookups (primary use case)
visaRequirementSchema.index({ 
  passportCountry: 1, 
  destinationCountry: 1, 
  travelPurpose: 1,
  isActive: 1 
});

// Index for finding all rules for a destination
visaRequirementSchema.index({ destinationCountry: 1, isActive: 1 });

// Pre-save middleware to update lastUpdated
visaRequirementSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

/**
 * Static method to find applicable visa rule
 */
visaRequirementSchema.statics.findApplicableRule = async function(
  passportCountryId, 
  destinationCountryId, 
  purpose = 'TOURISM'
) {
  return this.findOne({
    passportCountry: passportCountryId,
    destinationCountry: destinationCountryId,
    travelPurpose: purpose,
    isActive: true
  }).populate('passportCountry destinationCountry');
};

export default mongoose.model('VisaRequirement', visaRequirementSchema);
export { APPLICATION_METHODS, PRE_ARRIVAL_TYPES, TRAVEL_PURPOSES, VISA_TYPES };

