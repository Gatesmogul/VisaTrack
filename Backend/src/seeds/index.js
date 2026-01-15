/**
 * Main Seed Script
 * Populates the database with 2026-accurate visa data for 15 countries
 * 
 * Usage:
 *   NODE_ENV=development node src/seeds/index.js
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load environment variables
dotenv.config();

// Import seed functions
import { seedCountries } from './seedCountries.js';
import seedVisaRequirements from './seedVisaRequirements.js';

async function runSeeds() {
  console.log('========================================');
  console.log('  VisaTrack Database Seeder');
  console.log('  2026 Visa Policies for 15 Countries');
  console.log('========================================\n');
  
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/visatrack';
    console.log(`Connecting to MongoDB: ${mongoUri.split('@').pop() || mongoUri}`);
    
    await mongoose.connect(mongoUri);
    console.log('✓ Connected to MongoDB\n');
    
    // Run seeders in order
    console.log('Step 1: Seeding Countries...');
    await seedCountries();
    
    console.log('\nStep 2: Seeding Visa Requirements...');
    await seedVisaRequirements();
    
    console.log('\n========================================');
    console.log('  ✅ All seeds completed successfully!');
    console.log('========================================');
    
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run if called directly
runSeeds();

export default runSeeds;
