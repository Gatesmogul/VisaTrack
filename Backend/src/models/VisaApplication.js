import mongoose from 'mongoose';

/**
 * Application Status aligned with Flow #2
 */
const APPLICATION_STATUSES = [
  'NOT_STARTED',
  'DOCUMENTS_IN_PROGRESS',
  'APPOINTMENT_BOOKED',
  'SUBMITTED',
  'UNDER_REVIEW',
  'ADDITIONAL_DOCS_REQUESTED',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
  'EXPIRED'
];

/**
 * Application Channels - where the visa is being processed
 */
const APPLICATION_CHANNELS = [
  'EMBASSY',           // Direct embassy/consulate
  'VFS_GLOBAL',        // VFS Global center
  'TLS_CONTACT',       // TLS Contact center
  'EVISA_PORTAL',      // Official eVisa website
  'ETA_PORTAL',        // ETA system (Kenya, Australia)
  'MOBILE_APP',        // Mobile app (Australia ETA)
  'VISA_ON_ARRIVAL',   // At port of entry
  'AGENCY',            // Third-party visa agency
  'OTHER'
];

/**
 * VisaApplication Model
 * Core entity for Flow #2: Application Tracking
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     VisaApplication:
 *       type: object
 *       required:
 *         - userId
 *         - tripDestinationId
 *       properties:
 *         id:
 *           type: string
 *         userId:
 *           type: string
 *         tripId:
 *           type: string
 *         tripDestinationId:
 *           type: string
 *         destinationIsoCode:
 *           type: string
 *           example: "AU"
 *         applicationChannel:
 *           type: string
 *           enum: [EMBASSY, VFS_GLOBAL, TLS_CONTACT, EVISA_PORTAL, ETA_PORTAL, MOBILE_APP, VISA_ON_ARRIVAL, AGENCY, OTHER]
 *         status:
 *           type: string
 *           enum: [NOT_STARTED, DOCUMENTS_IN_PROGRESS, APPOINTMENT_BOOKED, SUBMITTED, UNDER_REVIEW, ADDITIONAL_DOCS_REQUESTED, APPROVED, REJECTED, CANCELLED, EXPIRED]
 *         referenceNumber:
 *           type: string
 *         latestSubmissionDate:
 *           type: string
 *           format: date-time
 *         recommendedSubmissionDate:
 *           type: string
 *           format: date-time
 */
const visaApplicationSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trip'
    },
    tripDestinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TripDestination',
      required: true
    },
    visaRequirementId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'VisaRequirement' 
    },
    
    // Destination details (denormalized for quick access)
    destinationCountry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country'
    },
    destinationIsoCode: String,
    
    /**
     * Application Channel
     */
    applicationChannel: {
      type: String,
      enum: APPLICATION_CHANNELS,
      default: 'EVISA_PORTAL'
    },
    
    /**
     * Reference Number Tracking
     */
    referenceNumber: String,           // Official application reference
    confirmationNumber: String,        // Confirmation/receipt number
    trackingUrl: String,               // URL to check status online
    
    /**
     * Status Tracking
     */
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: 'NOT_STARTED'
    },
    statusHistory: [{
      status: String,
      changedAt: { type: Date, default: Date.now },
      notes: String,
      changedBy: String                // System or user
    }],
    
    /**
     * Important Dates
     */
    applicationDate: Date,             // When application was started
    appointmentDate: Date,             // Biometric/interview appointment
    submissionDate: Date,              // When submitted to embassy/portal
    decisionDate: Date,                // When decision was made
    collectionDate: Date,              // When passport collected
    
    /**
     * Calculated Dates (Flow #4 Timeline)
     */
    expectedDecisionDate: Date,        // Estimated based on processing time
    latestSubmissionDate: Date,        // Must submit by this date
    recommendedSubmissionDate: Date,   // Recommended start date with buffer
    
    /**
     * Visa Details (if approved)
     */
    visaDetails: {
      visaNumber: String,
      issueDate: Date,
      expiryDate: Date,
      entriesAllowed: {
        type: String,
        enum: ['SINGLE', 'DOUBLE', 'MULTIPLE']
      },
      stayDuration: Number,            // Days
      notes: String
    },
    
    /**
     * Rejection Details (if rejected)
     */
    rejectionDetails: {
      reason: String,
      canReapply: Boolean,
      reapplyAfterDate: Date,
      appealDeadline: Date,
      documents: [String]              // Documents that caused issues
    },
    
    /**
     * Document Checklist Progress
     */
    checklistProgress: {
      totalRequired: { type: Number, default: 0 },
      completed: { type: Number, default: 0 },
      percentage: { type: Number, default: 0 }
    },
    
    /**
     * Fees
     */
    fees: {
      visaFee: Number,
      serviceFee: Number,              // VFS/agency fee
      totalPaid: Number,
      currency: { type: String, default: 'USD' },
      paymentDate: Date,
      paymentReference: String
    },
    
    // Notes
    notes: String,
    
    // Flags
    isUrgent: { type: Boolean, default: false },
    isArchived: { type: Boolean, default: false }
  },
  { timestamps: true }
);

// Indexes for fast lookups
visaApplicationSchema.index({ userId: 1, status: 1 });
visaApplicationSchema.index({ tripId: 1 });
visaApplicationSchema.index({ referenceNumber: 1 });
visaApplicationSchema.index({ userId: 1, isArchived: 1, createdAt: -1 });

/**
 * Pre-save middleware to track status changes
 */
visaApplicationSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      changedAt: new Date(),
      changedBy: 'SYSTEM'
    });
  }
  next();
});

/**
 * Method to update checklist progress
 */
visaApplicationSchema.methods.updateChecklistProgress = function(total, completed) {
  this.checklistProgress = {
    totalRequired: total,
    completed: completed,
    percentage: total > 0 ? Math.round((completed / total) * 100) : 0
  };
};

/**
 * Static method to get user's dashboard data
 */
visaApplicationSchema.statics.getDashboard = async function(userId) {
  return this.find({ 
    userId, 
    isArchived: false,
    status: { $nin: ['CANCELLED', 'EXPIRED'] }
  })
  .populate('tripDestinationId destinationCountry')
  .sort({ createdAt: -1 });
};

/**
 * Static method to find applications needing attention
 */
visaApplicationSchema.statics.findNeedingAttention = async function(userId) {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return this.find({
    userId,
    isArchived: false,
    $or: [
      { status: 'ADDITIONAL_DOCS_REQUESTED' },
      { 
        latestSubmissionDate: { $lte: sevenDaysFromNow },
        status: { $in: ['NOT_STARTED', 'DOCUMENTS_IN_PROGRESS'] }
      }
    ]
  });
};

export default mongoose.model('VisaApplication', visaApplicationSchema);
export { APPLICATION_CHANNELS, APPLICATION_STATUSES };

