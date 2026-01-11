import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    authUserId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    fullName: { type: String,  },
    passportCountry: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Country',
    
    },
    termsAccepted: { type: Boolean, default: false },
     personal: {
      dob: Date,
      gender: String,
      nationality: String,
      residence: String,
    },
    profileCompleted: { type: Boolean, default: false },
    termsAcceptedAt: { type: Date, default: null },
    profileCompletedAt: { type: Date, default: null },
     contact: {
      phone: String,
      photoUrl: String,
    },
      passport: {
      passportNumber: String,
      issuingCountry: String,
      issueDate: Date,
      expiryDate: Date,
    },
    expoPushToken:{type:String, default: false,

    },
  
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
