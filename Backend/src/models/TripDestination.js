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
    visaRequired: Boolean,
    visaType: String,
    processingTimeMin: Number,
processingTimeMax: Number,
    notes: String
  },
  { timestamps: true }
);

export default mongoose.model('TripDestination', tripDestinationSchema);
