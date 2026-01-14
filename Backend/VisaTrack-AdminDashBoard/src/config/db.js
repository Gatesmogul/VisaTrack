const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI || process.env.DATABASE_URL || process.env.DATABASE;
        if (!uri) throw new Error('MongoDB connection string not provided in env (MONGO_URI or DATABASE_URL)');
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
module.exports.connectDB = connectDB;