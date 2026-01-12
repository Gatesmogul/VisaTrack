import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['PLANNING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
      default: 'PLANNING'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Trip', tripSchema);
