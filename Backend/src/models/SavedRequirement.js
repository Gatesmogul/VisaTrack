import mongoose from "mongoose";

const savedRequirementSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    visaRequirement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VisaRequirement",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SavedRequirement", savedRequirementSchema);
