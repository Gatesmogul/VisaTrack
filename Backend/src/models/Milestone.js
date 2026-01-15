import mongoose from 'mongoose';

/**
 * Milestone Types for Flow #4: Timeline Calculator
 */
const MILESTONE_TYPES = [
  'START_APPLICATION',      // Begin gathering documents
  'COMPLETE_DOCUMENTS',     // All documents ready
  'BOOK_APPOINTMENT',       // Schedule biometric/interview
  'ATTEND_APPOINTMENT',     // Biometric/interview date
  'SUBMIT_APPLICATION',     // Submit to embassy/portal
  'EXPECTED_DECISION',      // Estimated decision date
  'COLLECT_PASSPORT',       // Pick up passport with visa
  'PRE_ARRIVAL_FORM',       // Complete TDAC, e-Ticket, etc.
  'TRAVEL_DATE'             // Actual trip date
];

const REMINDER_CHANNELS = ['EMAIL', 'SMS', 'PUSH'];

/**
 * Milestone Model
 * Tracks application milestones with deadlines and reminders
 * Used by Flow #2: Application Tracking and Flow #4: Timeline Calculator
 */
const milestoneSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'VisaApplication',
      required: true
    },
    
    milestoneType: {
      type: String,
      enum: MILESTONE_TYPES,
      required: true
    },
    
    name: { type: String, required: true },  // Human-readable name
    description: String,
    
    // Date tracking
    dueDate: { type: Date, required: true },
    completedDate: Date,
    
    // Status
    completed: { type: Boolean, default: false },
    skipped: { type: Boolean, default: false },
    
    /**
     * Reminder Configuration
     */
    reminders: [{
      reminderDate: Date,           // When to send reminder
      daysBefore: Number,           // Alternative: days before due date
      channel: {
        type: String,
        enum: REMINDER_CHANNELS
      },
      sent: { type: Boolean, default: false },
      sentAt: Date,
      message: String               // Custom reminder message
    }],
    
    // Risk indicators
    isAtRisk: { type: Boolean, default: false },  // If deadline is too close
    riskReason: String,             // e.g., "Only 3 days until deadline"
    
    // Dependencies
    dependsOn: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Milestone'
    }],
    
    // Notes
    notes: String,
    
    // Ordering
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

// Index for finding milestones by application
milestoneSchema.index({ applicationId: 1, order: 1 });

// Index for finding upcoming milestones (for reminders)
milestoneSchema.index({ dueDate: 1, completed: 1 });

/**
 * Virtual to check if milestone is overdue
 */
milestoneSchema.virtual('isOverdue').get(function() {
  if (this.completed || this.skipped) return false;
  return new Date() > this.dueDate;
});

/**
 * Static method to get timeline for an application
 */
milestoneSchema.statics.getTimeline = async function(applicationId) {
  return this.find({ applicationId })
    .sort({ order: 1 })
    .populate('dependsOn');
};

/**
 * Static method to find milestones needing reminders
 */
milestoneSchema.statics.findUpcomingReminders = async function(withinDays = 7) {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (withinDays * 24 * 60 * 60 * 1000));
  
  return this.find({
    completed: false,
    skipped: false,
    dueDate: { $gte: now, $lte: futureDate },
    'reminders.sent': false
  }).populate('applicationId');
};

export default mongoose.model('Milestone', milestoneSchema);
export { MILESTONE_TYPES, REMINDER_CHANNELS };
