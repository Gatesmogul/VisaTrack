const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

class AuthController {
  async renderRegister(req, res) {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return res.render("auth/register", { query: req.query });
  }

  async renderLogin(req, res) {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    return res.render("auth/login", { query: req.query });
  }

  async register(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).render("auth/register", {
          error: "Username and password required",
        });
      }

      const existing = await User.findOne({ username });
      if (existing) {
        return res.status(400).render("auth/register", {
          error: "Username already exists",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({
        username,
        password: hashedPassword,
        isAdmin: true,
      });

      await user.save();
      return res.redirect("/login?msg=Account created. Please login.");
    } catch (error) {
      return res.status(500).render("auth/register", { error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).render("auth/login", {
          error: "Username and password required",
        });
      }

      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).render("auth/login", {
          error: "Invalid credentials",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).render("auth/login", {
          error: "Invalid credentials",
        });
      }

      const token = jwt.sign(
        { id: user._id, username: user.username, isAdmin: user.isAdmin },
        process.env.JWT_SECRET || "your_secret_key",
        { expiresIn: "7d" }
      );

      res.cookie("authToken", token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.redirect("/admin/dashboard");
    } catch (error) {
      return res.status(500).render("auth/login", { error: error.message });
    }
  }

  async logout(req, res) {
    res.clearCookie("authToken");
    return res.redirect("/login");
  }

  
  // FORGOT PASSWORD

// FORGOT PASSWORD

async showForgotPassword(req, res) {
  return res.render("forgot-password", {
    error: null,
    success: null,
    resetLink: null,
  });
}

async forgotPassword(req, res) {
  const { username } = req.body;

  const user = await User.findOne({ username, isAdmin: true });
  if (!user) {
    return res.render("forgot-password", {
      error: "Admin user not found",
      success: null,
      resetLink: null,
    });
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

  await user.save();

  const resetLink = `http://localhost:3001/reset-password/${token}`;

  return res.render("forgot-password", {
    error: null,
    success: "Reset link generated successfully",
    resetLink,
  });
}


  async showResetPassword(req, res) {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.send("Reset link is invalid or expired");
    }

    return res.render("reset-password", { token: req.params.token });
  }

  async resetPassword(req, res) {
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.send("Reset link is invalid or expired");
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();
    return res.redirect("/login?msg=Password reset successful");
  }
}

module.exports = new AuthController();
