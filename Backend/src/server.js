import dotenv from 'dotenv';
import mongoose from 'mongoose';
import app from './app.js';

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(console.error);
