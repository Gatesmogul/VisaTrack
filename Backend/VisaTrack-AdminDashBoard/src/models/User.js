const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    // reset password fields
    resetPasswordToken: String,
    resetPasswordExpires: Date,
  
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
