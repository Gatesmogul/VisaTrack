import mongoose from 'mongoose';


const USER_STATUS = {
  NEW: "NEW",                     // account created
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
    status: {
  type: String,
  enum: Object.values(USER_STATUS),
  default: USER_STATUS.NEW,
},

  
  },
  { timestamps: true }
);



export default mongoose.model('User', userSchema);
export { USER_STATUS };
