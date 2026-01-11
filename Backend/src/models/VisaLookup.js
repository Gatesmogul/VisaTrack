import mongoose from "mongoose";

const visaLookupSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    passportCountry: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
    destinationCountry: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },
    travelPurpose: {
      type: String,
      enum: ["TOURISM", "BUSINESS", "TRANSIT", "STUDY", "WORK"],
      default: "TOURISM",
    },
    visaRequirement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VisaRequirement",
    },
  },
  { timestamps: true }
);

export default mongoose.model("VisaLookup", visaLookupSchema);
