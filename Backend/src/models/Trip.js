import mongoose from "mongoose";

export const FEASIBILITY_STATUSES = {
  FEASIBLE: "FEASIBLE",
  RISKY: "RISKY",
  IMPOSSIBLE: "IMPOSSIBLE",
};

const tripSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    destinations: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'TripDestination',
  default: []
}],


    title: { type: String, required: true },
    description: String,

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["PLANNING", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
      default: "PLANNING",
    },

    /**
     * Overall trip feasibility
     * Recalculated whenever destinations are added/updated
     */
feasibilityStatus: {
  type: String,
  enum: ["FEASIBLE", "RISKY", "IMPOSSIBLE"],
  default: "FEASIBLE"
},

feasibilityIssues: [
  {
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country"
    },
    message: String
  }
],

  },
  { timestamps: true }
);

export default mongoose.model("Trip", tripSchema);
