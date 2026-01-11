import mongoose from 'mongoose';

const visaApplicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tripDestinationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TripDestination',
      required: true
    },
    visaRequirementId: { type: mongoose.Schema.Types.ObjectId, ref: 'VisaRequirement' },
    applicationDate: Date,
    appointmentDate: Date,
    submissionDate: Date,
    decisionDate: Date,
    status: {
      type: String,
      enum: [
        'NOT_STARTED',
        'DOCUMENTS_IN_PROGRESS',
        'APPOINTMENT_BOOKED',
        'SUBMITTED',
        'UNDER_REVIEW',
        'APPROVED',
        'REJECTED',
        'CANCELLED'
      ],
      default: 'NOT_STARTED'
    },
    expectedDecisionDate: Date,
    latestSubmissionDate: Date,
    recommendedSubmissionDate: Date,
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model('VisaApplication', visaApplicationSchema);
