import User from "../models/User.js";

export async function syncUser(req, res) {
  try {
    const { uid, email } = req.user;
    const { fullName } = req.body;

    const user = await User.findOneAndUpdate(
      { authUserId: uid },
      {
        authUserId: uid,
        email,
        ...(fullName && { fullName }),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    res.json(user);
  } catch (err) {
    console.error("SYNC USER ERROR:", err);
    res.status(400).json({ message: err.message });
  }
}




export async function getMe(req, res) {
  const user = await User.findOne({ authUserId: req.user.uid });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 🚫 DO NOT user.save()
  res.json({
    id: user._id,
    email: user.email,
    acceptedTerms: user.termsAccepted,
    profileCompleted: user.profileCompleted,
  });
}
export const acceptTerms = async (req, res) => {
  try {
    const { uid } = req.user;

    const user = await User.findOneAndUpdate(
      { authUserId: uid },
      {
        termsAccepted: true,
        termsAcceptedAt: new Date(),
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Accept terms error:", error);
    res.status(500).json({ message: "Failed to accept terms" });
  }
};


// export const saveUserProfile = async (req, res) => {
//   try {
//     const { uid } = req.user;
//     const {
//       fullName,
//       dateOfBirth,
//       gender,
//       nationality,
//       residenceCountry
//     } = req.body;

//     if (!fullName || !dateOfBirth || !gender || !nationality || !residenceCountry) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     const user = await User.findOne({ authUserId: uid });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     user.fullName = fullName;
//     user.dateOfBirth = dateOfBirth;
//     user.gender = gender;
//     user.nationality = nationality;
//     user.residenceCountry = residenceCountry;
//     user.profileCompleted = true;

//     await user.save();

//     res.json({ message: "Profile saved successfully" });
//   } catch (error) {
//     console.error("Profile save error:", error);
//     res.status(500).json({ message: "Failed to save profile" });
//   }
// };
// controllers/user.controller.js


export async function upsertProfile(req, res) {
  const userId = req.user.id; // from Firebase middleware

  const profile = await UserProfile.findOneAndUpdate(
    { userId },
    {
      ...req.body,
      completed: true,
    },
    { new: true, upsert: true }
  );

  res.json(profile);
}

export const saveContactProfile = async (req, res) => {
  const { phone, photoUrl } = req.body;

  const user = await User.findOne({ authUserId: req.user.uid });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.contact = { phone, photoUrl };
  await user.save();

  res.json({ message: "Contact profile saved" });
};

export const savePassportProfile = async (req, res) => {
  const { passportNumber, issuingCountry, issueDate, expiryDate } = req.body;

  const user = await User.findOne({ authUserId: req.user.uid });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.passport = {
    passportNumber,
    issuingCountry,
    issueDate,
    expiryDate,
  };

  user.profileCompleted = true;
  await user.save();

  res.json({ message: "Profile completed" });
};

export const savePersonalProfile = async (req, res) => {
  const { dob, gender, nationality, residence } = req.body;

  const user = await User.findOne({ authUserId: req.user.uid });
  if (!user) return res.status(404).json({ message: "User not found" });

  user.personal = { dob, gender, nationality, residence };
  await user.save();

  res.json({ message: "Personal profile saved" });
};

export async function savePushToken(req, res) {
  const { expoPushToken } = req.body;

  if (!expoPushToken) {
    return res.status(400).json({ error: "Missing push token" });
  }

  await User.findByIdAndUpdate(req.user._id, {
    expoPushToken
  });

  res.json({ success: true });
}