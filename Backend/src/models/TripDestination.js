import mongoose from 'mongoose';

const tripDestinationSchema = new mongoose.Schema(
  {
    tripId: { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    entryDate: { type: Date, required: true },
    exitDate: { type: Date, required: true },
    travelPurpose: {
      type: String,
      enum: ['TOURISM', 'BUSINESS', 'TRANSIT', 'STUDY', 'WORK', 'DIPLOMATIC'],
      required: true
    },
    visaRequired: { type: Boolean, default: false },
    visaType: String,

    processingTimeMin: Number,
    processingTimeMax: Number,

    /** ✅ Feasibility (persisted) */
    feasibilityStatus: {
      type: String,
      enum: ["FEASIBLE", "RISKY", "IMPOSSIBLE"],
      default: "FEASIBLE",
    },

    feasibilityReason: String,

    notes: String,
  },
  { timestamps: true }
);

export default mongoose.model('TripDestination', tripDestinationSchema);

