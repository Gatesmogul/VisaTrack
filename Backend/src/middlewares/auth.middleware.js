import admin from "../config/firebaseAdmin.js";
import User, { USER_STATUS } from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    console.log("🟡 Auth middleware hit");

    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    console.log("🟢 Token verified:", decoded.uid, decoded.email);

  
    let user = await User.findOneAndUpdate(
      
  { authUserId: decoded.uid },
  
  {
      
    $setOnInsert: {
      authUserId: decoded.uid,
      email: decoded.email,
      emailVerified: decoded.email_verified || false,
      status: decoded.email_verified
        ? USER_STATUS.EMAIL_VERIFIED
        : USER_STATUS.NEW,
    },
  },
  { new: true, upsert: true }
  
);


    // 🔁 Sync but NEVER block
    if (decoded.email_verified && !user.emailVerified) {
      user.emailVerified = true;
      if (user.status === USER_STATUS.NEW) {
        user.status = USER_STATUS.EMAIL_VERIFIED;
      }
      await user.save();
      console.log("🟢 Email verification synced to DB");
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      dbUser: user,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
