import mongoose from 'mongoose';

const USER_STATUS = {
  NEW: "NEW",
  EMAIL_VERIFIED: "EMAIL_VERIFIED",
  TERMS_ACCEPTED: "TERMS_ACCEPTED",
  PROFILE_INCOMPLETE: "PROFILE_INCOMPLETE",
  PROFILE_COMPLETE: "PROFILE_COMPLETE",
};

const userSchema = new mongoose.Schema(
  {
    authUserId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    fullName: { type: String },
    
    // Primary passport country (used for visa lookups)
    passportCountry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
    },
    
    termsAccepted: { type: Boolean, default: false },
    termsAcceptedAt: { type: Date, default: null },
    profileCompleted: { type: Boolean, default: false },
    profileCompletedAt: { type: Date, default: null },
    
    // Personal Information
    personal: {
      dob: Date,
      gender: { type: String, enum: ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'] },
      nationality: String,
      residence: String,
      placeOfBirth: String
    },
    
    // Contact Information
    contact: {
      phone: String,
      phoneCountryCode: String,
      alternateEmail: String,
      photoUrl: String,
    },
    
    // Passport Details
    passport: {
      passportNumber: String,
      issuingCountry: String,
      issueDate: Date,
      expiryDate: Date,
      // Additional passports (dual nationality)
      additionalPassports: [{
        passportNumber: String,
        issuingCountry: String,
        expiryDate: Date
      }]
    },
    
    /**
     * Notification Preferences (Flow #4: Timeline Calculator)
     */
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      push: { type: Boolean, default: true },
      // Reminder timing preferences
      reminderDaysBefore: { type: Number, default: 7 },
      // Notification types to receive
      types: {
        deadlineReminders: { type: Boolean, default: true },
        statusUpdates: { type: Boolean, default: true },
        policyChanges: { type: Boolean, default: true },
        tips: { type: Boolean, default: false }
      }
    },
    
    /**
     * Travel History (for scrutiny warnings)
     * Some countries like Thailand flag frequent visa-free entries
     */
    travelHistory: [{
      countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country' },
      countryIsoCode: String,
      entryDate: Date,
      exitDate: Date,
      visaType: String,
      purpose: String
    }],
    
    // Push notification token
    expoPushToken: { type: String },
    
    status: {
      type: String,
      enum: Object.values(USER_STATUS),
      default: USER_STATUS.NEW,
    },
    
    // Account settings
    settings: {
      timezone: { type: String, default: 'UTC' },
      language: { type: String, default: 'en' },
      currency: { type: String, default: 'USD' }
    },
    
    // Last activity tracking
    lastLoginAt: Date,
    lastActiveAt: Date
  },
  { timestamps: true }
);

// Index for fast lookups
userSchema.index({ email: 1 });
userSchema.index({ authUserId: 1 });

/**
 * Method to check if user's passport is expiring soon
 */
userSchema.methods.isPassportExpiringSoon = function(daysThreshold = 180) {
  if (!this.passport?.expiryDate) return false;
  const daysUntilExpiry = Math.ceil(
    (new Date(this.passport.expiryDate) - new Date()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilExpiry <= daysThreshold;
};

/**
 * Method to get recent travel to a specific country (for scrutiny check)
 */
userSchema.methods.getRecentTravelToCountry = function(countryIsoCode, monthsBack = 12) {
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - monthsBack);
  
  return this.travelHistory.filter(trip => 
    trip.countryIsoCode === countryIsoCode && 
    new Date(trip.entryDate) >= cutoffDate
  );
};

export default mongoose.model('User', userSchema);
export { USER_STATUS };

