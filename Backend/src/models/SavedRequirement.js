import mongoose from "mongoose";

const savedRequirementSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    visaRequirement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VisaRequirement",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate saves per user
savedRequirementSchema.index(
  { user: 1, visaRequirement: 1 },
  { unique: true }
);

export default mongoose.model("SavedRequirement", savedRequirementSchema);
