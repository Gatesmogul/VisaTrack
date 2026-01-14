// Helper script to fix the database indexes
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./src/models/User');

async function fixIndexes() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.DATABASE_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Drop all indexes on User collection (except _id)
        await User.collection.dropIndexes();
        console.log('Dropped all indexes on User collection');

        // Recreate indexes based on schema
        await User.collection.createIndex({ username: 1 }, { unique: true });
        console.log('Recreated unique index on username');

        // Disconnect
        await mongoose.disconnect();
        console.log('Database fix complete!');
    } catch (error) {
        console.error('Error fixing database:', error);
        process.exit(1);
    }
}

fixIndexes();
