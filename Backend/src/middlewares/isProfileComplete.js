import User from "../models/User.js";

export async function isProfileComplete(req, res, next) {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("profileCompleted");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.profileCompleted) {
      return res.status(403).json({
        message: "Profile setup not completed",
        code: "PROFILE_INCOMPLETE",
      });
    }

    next();
  } catch (err) {
    console.error("Profile guard error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
