import mongoose from 'mongoose';

/**
 * Document Types required for visa applications
 * Aligned with Flow #3: Document Checklist
 */
const DOCUMENT_TYPES = [
  'PASSPORT',
  'PASSPORT_PHOTO',
  'BANK_STATEMENT',
  'FLIGHT_RESERVATION',
  'HOTEL_BOOKING',
  'INVITATION_LETTER',
  'TRAVEL_INSURANCE',
  'EMPLOYMENT_LETTER',
  'BUSINESS_LETTER',
  'STUDENT_LETTER',
  'YELLOW_FEVER_CERTIFICATE',
  'VACCINATION_CERTIFICATE',
  'COVER_LETTER',
  'ITINERARY',
  'PROOF_OF_FUNDS',
  'PROOF_OF_TIES',          // For Australia - ties to home country
  'SPONSOR_DOCUMENTS',
  'MARRIAGE_CERTIFICATE',
  'BIRTH_CERTIFICATE',
  'POLICE_CLEARANCE',
  'MEDICAL_CERTIFICATE',
  'BIOMETRIC_APPOINTMENT',
  'OTHER'
];

const VALIDATION_STATUS = ['PENDING', 'VALID', 'INVALID', 'EXPIRED'];

/**
 * DocumentRequirement Model
 * Defines what documents are required for a specific visa requirement
 * Used by Flow #3: Document Checklist Generation
 */
const documentRequirementSchema = new mongoose.Schema(
  {
    visaRequirementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VisaRequirement',
      required: true
    },
    documentType: {
      type: String,
      enum: DOCUMENT_TYPES,
      required: true
    },
    name: { type: String, required: true },  // Human-readable name
    description: String,
    
    // Is this document mandatory or optional?
    mandatory: { type: Boolean, default: true },
    
    /**
     * Document Specifications for validation
     */
    specifications: {
      // Photo specifications (for passport photos)
      photo: {
        widthMM: Number,          // e.g., 35mm
        heightMM: Number,         // e.g., 45mm
        widthPx: Number,          // e.g., 600px
        heightPx: Number,         // e.g., 600px
        backgroundColors: [String], // ['white', 'light-grey']
        maxFileSizeMB: { type: Number, default: 5 },
        allowedFormats: {
          type: [String],
          default: ['JPEG', 'PNG']
        },
        requirements: [String]    // e.g., "No glasses", "Neutral expression"
      },
      
      // Document specifications
      document: {
        maxFileSizeMB: { type: Number, default: 10 },
        allowedFormats: {
          type: [String],
          default: ['PDF', 'JPEG', 'PNG']
        },
        maxPages: Number,
        minPages: Number
      },
      
      // Validity requirements
      validity: {
        notOlderThanDays: Number,   // e.g., bank statement not older than 30 days
        notOlderThanMonths: Number, // e.g., 6 months for bank statements (Australia)
        mustBeValidForDays: Number, // e.g., passport valid for 180 days after trip
        issuedWithinDays: Number    // e.g., photo issued within 6 months
      }
    },
    
    /**
     * Validation Rules for rejection prevention
     */
    validationRules: {
      // Specific checks to perform
      checks: [{
        checkType: String,          // e.g., "passport_validity", "photo_background"
        errorMessage: String,       // User-friendly error message
        severity: {
          type: String,
          enum: ['ERROR', 'WARNING', 'INFO'],
          default: 'ERROR'
        }
      }],
      
      // Country-specific notes
      countryNotes: String
    },
    
    /**
     * Nationality-specific variations
     * Some countries require extra documents for certain nationalities
     */
    nationalitySpecificRules: [{
      nationalityIsoCodes: [String],  // Which nationalities this applies to
      additionalRequirements: String,
      exempted: Boolean               // Some nationalities may be exempt
    }],
    
    // Template URLs (sample documents, photo templates)
    templateUrls: [String],
    guidelinesUrl: String,
    
    // Ordering for checklist display
    displayOrder: { type: Number, default: 0 },
    
    // Tips for users
    tips: [String],  // e.g., "Ensure bank statement shows your name and account number"
    
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Index for fast lookup by visa requirement
documentRequirementSchema.index({ visaRequirementId: 1, mandatory: -1, displayOrder: 1 });

/**
 * Static method to get checklist for a visa requirement
 */
documentRequirementSchema.statics.getChecklistForVisa = async function(visaRequirementId) {
  return this.find({
    visaRequirementId,
    isActive: true
  }).sort({ mandatory: -1, displayOrder: 1 });
};

export default mongoose.model('DocumentRequirement', documentRequirementSchema);
export { DOCUMENT_TYPES, VALIDATION_STATUS };
