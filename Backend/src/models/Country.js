import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isoCode: { type: String, required: true, unique: true },
    region: { type: String }
  },
  { timestamps: true }
);

export default mongoose.model('Country', countrySchema);
