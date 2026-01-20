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
    visaType: {
      type: String,
      enum: ['VISA_FREE', 'E_VISA', 'VISA_ON_ARRIVAL', 'EMBASSY_VISA', 'TRANSIT_VISA', 'ETA', 'TRAVEL_AUTH'],
    },

  },
  { timestamps: true }
);

export default mongoose.model("VisaLookup", visaLookupSchema);
