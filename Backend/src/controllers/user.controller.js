import { USER_STATUS } from "../models/User.js";

export const getMe = async (req, res) => {
  const user = req.user.dbUser;

  res.json({
    id: user._id,
    email: user.email,
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

  if (user.status !== USER_STATUS.PROFILE_INCOMPLETE) {
    return res.status(403).json({ message: "Invalid state" });
  }

  user.personal = req.body;
  await user.save();

  res.json({ success: true });
};

export const saveContactProfile = async (req, res) => {
  const user = req.user.dbUser;

  if (user.status !== USER_STATUS.PROFILE_INCOMPLETE) {
    return res.status(403).json({ message: "Invalid state" });
  }

  user.contact = req.body;
  await user.save();

  res.json({ success: true });
};

export const savePassportProfile = async (req, res) => {
  const user = req.user.dbUser;

  if (user.status !== USER_STATUS.PROFILE_INCOMPLETE) {
    return res.status(403).json({ message: "Invalid state" });
  }

  user.passport = req.body;
  user.profileCompleted = true;
  user.profileCompletedAt = new Date();
  user.status = USER_STATUS.PROFILE_COMPLETED;

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
