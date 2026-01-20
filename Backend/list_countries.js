import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

async function check() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const db = mongoose.connection.db;
    const countries = await db.collection('countries').find({}).toArray();
    console.log('ISO Codes:', countries.map(c => c.isoCode));
    console.log('Names:', countries.map(c => c.name));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
