import admin from "../config/firebaseAdmin.js";
import User from "../models/User.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = header.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    let user = await User.findOne({ authUserId: decoded.uid });

    if (!user) {
      user = await User.create({
        authUserId: decoded.uid,
        email: decoded.email,
        fullName: decoded.name || '',
        emailVerified: decoded.email_verified || false,
        status: decoded.email_verified ? 'EMAIL_VERIFIED' : 'NEW'
      });
    } else {
      let modified = false;
      
      // Update email verification status if it changed
      if (decoded.email_verified && !user.emailVerified) {
        user.emailVerified = true;
        
        // Auto-transition from NEW to EMAIL_VERIFIED
        if (user.status === 'NEW') {
          user.status = 'EMAIL_VERIFIED';
        }
        modified = true;
      }

      if (decoded.name && !user.fullName) {
        user.fullName = decoded.name;
        modified = true;
      }

      if (modified) {
        await user.save();
      }
    }

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      _id: user._id,
      dbUser: user,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
