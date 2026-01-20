import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const countries = await db.collection('countries').find({ isoCode: { $in: ['GB', 'UK'] } }).toArray();
    console.log('Found:', JSON.stringify(countries));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
