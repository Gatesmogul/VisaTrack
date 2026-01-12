import mongoose from 'mongoose';

const visaRequirementSchema = new mongoose.Schema(
  {
    passportCountry: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    destinationCountry: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    travelPurpose: {
      type: String,
      enum: ['TOURISM', 'BUSINESS', 'TRANSIT', 'STUDY', 'WORK', 'DIPLOMATIC'],
      required: true
    },
    visaType: {
      type: String,
      enum: ['VISA_FREE', 'E_VISA', 'VISA_ON_ARRIVAL', 'EMBASSY_VISA', 'TRANSIT_VISA'],
      required: true
    },
    visaFreeDays: Number,
    visaCost: Number,
    currency: String,
    processingTimeMin: Number,
    processingTimeMax: Number,
    validityPeriodDays: Number,
    allowedStayDays: Number,
    applicationMethod: {
      type: String,
      enum: ['ONLINE', 'EMBASSY', 'VISA_ON_ARRIVAL', 'CONSULATE', 'NONE'],
      required: true
    },
    applicationUrl: String,
    notes: String,
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model('VisaRequirement', visaRequirementSchema);
