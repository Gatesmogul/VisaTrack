import { USER_STATUS } from "../models/User.js";
import { normalizeCountryCode } from "../utils/country.helper.js";

export const getMe = async (req, res) => {
  const user = req.user.dbUser;

  res.json({
    id: user._id,
    email: user.email,
    name: user.fullName,
    personal: user.personal,
    contact: user.contact,
    passport: user.passport,
    status: user.status,
    acceptedTerms: !!user.termsAccepted,
    profileCompleted: user.status === USER_STATUS.PROFILE_COMPLETED,
  });
};

export const acceptTerms = async (req, res) => {
  const user = req.user.dbUser;

  if (user.status !== USER_STATUS.EMAIL_VERIFIED) {
    return res.status(403).json({ message: "Invalid state" });
  }

  user.termsAccepted = true;
  user.termsAcceptedAt = new Date();
  user.status = USER_STATUS.PROFILE_INCOMPLETE;

  await user.save();

  res.json({ success: true });
};

export const savePersonalProfile = async (req, res) => {
  const user = req.user.dbUser;

  user.personal = req.body;
  
  // Transition TERMS_ACCEPTED -> PROFILE_INCOMPLETE
  if (user.status === USER_STATUS.TERMS_ACCEPTED) {
    user.status = USER_STATUS.PROFILE_INCOMPLETE;
  }
  
  await user.save();

  res.json({ success: true });
};

export const saveContactProfile = async (req, res) => {
  const user = req.user.dbUser;

  user.contact = req.body;
  
  // Transition TERMS_ACCEPTED -> PROFILE_INCOMPLETE (if personal was skipped)
  if (user.status === USER_STATUS.TERMS_ACCEPTED) {
    user.status = USER_STATUS.PROFILE_INCOMPLETE;
  }

  await user.save();

  res.json({ success: true });
};

export const savePassportProfile = async (req, res) => {
  const user = req.user.dbUser;
  const passportData = req.body;

  // Normalize issuing country
  if (passportData.issuingCountry) {
    passportData.issuingCountry = normalizeCountryCode(passportData.issuingCountry) || passportData.issuingCountry;
  }

  // Normalize additional passports
  if (passportData.additionalPassports?.length) {
    passportData.additionalPassports = passportData.additionalPassports.map(p => ({
      ...p,
      issuingCountry: normalizeCountryCode(p.issuingCountry) || p.issuingCountry
    }));
  }

  user.passport = passportData;
  user.profileCompleted = true;
  user.profileCompletedAt = new Date();
  
  // Transition PROFILE_INCOMPLETE -> PROFILE_COMPLETE (standard)
  // Also allow TERMS_ACCEPTED -> PROFILE_COMPLETE (fast-track)
  if (user.status === USER_STATUS.PROFILE_INCOMPLETE || user.status === USER_STATUS.TERMS_ACCEPTED) {
    user.status = USER_STATUS.PROFILE_COMPLETE;
  }

  await user.save();

  res.json({ success: true });
};

export const savePushToken = async (req, res) => {
  const user = req.user.dbUser;
  const { expoPushToken } = req.body;

  user.expoPushToken = expoPushToken;
  await user.save();

  res.json({ success: true });
};
