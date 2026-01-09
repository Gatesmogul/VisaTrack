const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    authUserId: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    },
    passportCountry: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Country',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
