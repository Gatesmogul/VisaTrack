import mongoose from 'mongoose';


export default function connectDB() {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection failed', err);
    process.exit(1);
  }
};

