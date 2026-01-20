import mongoose from 'mongoose';

const TRIP_PURPOSES = ['TOURISM', 'BUSINESS', 'TRANSIT', 'STUDY', 'WORK', 'MEDICAL', 'FAMILY_VISIT'];
const TRIP_STATUSES = ['PLANNING', 'APPLICATIONS_IN_PROGRESS', 'READY_TO_TRAVEL', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];
const FEASIBILITY_STATUSES = ['FEASIBLE', 'RISKY', 'IMPOSSIBLE', 'NOT_ANALYZED'];

/**
 * Trip Model
 * Core entity for Flow #5: Multi-Country Trip Planner
 */
const tripSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    
    title: { type: String, required: true },
    description: String,
    
    // Trip dates
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    
    // Destinations list (Flow #1 & #5)
    destinations: [{
      country: String,      // Display name
      countryCode: String,  // ISO-3166-1 alpha-2
      flag: String,
      visaStatus: {
        type: String,
        enum: ['not_started', 'pending', 'approved', 'rejected'],
        default: 'not_started'
      }
    }],
    
    // Primary purpose of trip
    purpose: {
      type: String,
      enum: TRIP_PURPOSES,
      default: 'TOURISM'
    },
    
    // Trip status
    status: {
      type: String,
      enum: TRIP_STATUSES,
      default: 'PLANNING'
    },
    
    /**
     * Feasibility Analysis (Flow #5)
     */
    feasibilityStatus: {
      type: String,
      enum: FEASIBILITY_STATUSES,
      default: 'NOT_ANALYZED'
    },
    
    // Why is the trip risky or impossible?
    feasibilityIssues: [{
      type: {
        type: String,
        enum: [
          'INSUFFICIENT_TIME',         // Not enough time to get visas
          'PROCESSING_OVERLAP',        // Visa processing times overlap
          'PASSPORT_SUBMISSION_CONFLICT', // Passport needed for multiple applications
          'PASSPORT_EXPIRY',           // Passport expires too soon
          'IMPOSSIBLE_VISA',           // Visa not available for nationality
          'YELLOW_FEVER_REQUIRED',     // Need vaccination
          'TRANSIT_VISA_NEEDED',       // Transit visa required
          'OTHER'
        ]
      },
      severity: {
        type: String,
        enum: ['ERROR', 'WARNING', 'INFO'],
        default: 'WARNING'
      },
      message: String,
      affectedDestination: String,     // Country ISO code
      suggestion: String               // How to resolve
    }],
    
    /**
     * Timeline Conflicts (Flow #5)
     */
    timelineConflicts: [{
      conflictType: String,            // e.g., "OVERLAPPING_PROCESSING"
      description: String,
      destinations: [String],          // Affected country ISO codes
      suggestedResolution: String
    }],
    
    /**
     * Smart Recommendations (Flow #5)
     */
    recommendations: [{
      type: {
        type: String,
        enum: [
          'APPLICATION_ORDER',          // Suggested visa application sequence
          'TIMELINE_ADJUSTMENT',         // Suggest moving dates
          'ALTERNATIVE_ROUTE',           // Different order of countries
          'BUFFER_NEEDED',               // Add more time
          'APPLY_EARLIER',               // Start applications sooner
          'SKIP_DESTINATION',            // Remove problematic country
          'OTHER'
        ]
      },
      priority: { type: Number, default: 0 },
      title: String,
      description: String,
      actionable: { type: Boolean, default: true }
    }],
    
    // Optimal application order (calculated)
    optimalApplicationOrder: [{
      destinationIsoCode: String,
      order: Number,
      startApplicationBy: Date,
      reason: String
    }],
    
    // Notes
    notes: String,
    
    // Analysis timestamps
    lastFeasibilityCheck: Date,
    lastTimelineCalculation: Date
  },
  { timestamps: true }
);

// Index for user's trips
tripSchema.index({ userId: 1, status: 1 });
tripSchema.index({ userId: 1, startDate: -1 });

/**
 * Virtual to get trip duration in days
 */
tripSchema.virtual('durationDays').get(function() {
  if (!this.startDate || !this.endDate) return 0;
  return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

/**
 * Virtual to check if trip is upcoming
 */
tripSchema.virtual('isUpcoming').get(function() {
  return this.startDate > new Date();
});

/**
 * Method to get days until trip
 */
tripSchema.methods.getDaysUntilTrip = function() {
  if (!this.startDate) return null;
  return Math.ceil((this.startDate - new Date()) / (1000 * 60 * 60 * 24));
};

export default mongoose.model('Trip', tripSchema);
export { FEASIBILITY_STATUSES, TRIP_PURPOSES, TRIP_STATUSES };

