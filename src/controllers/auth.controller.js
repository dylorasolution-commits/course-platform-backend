const User = require("../models/User");
const { sendEmail } = require("../config/mail");
const { generateToken } = require("../utils/jwt.util");

const OTP_EXPIRE_MINUTES = Number(process.env.OTP_EXPIRE_MINUTES || 10);
const buildOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

/* ================= REGISTER ================= */
exports.register = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      confirmPassword,
      phone,
      interestedCourse,
    } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All required fields must be filled" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const otp = buildOtp();

    const user = await User.create({
      fullName,
      email,
      password,
      phone,
      interestedCourse,
      otp,
      otpExpiresAt: Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000,
    });

    await sendEmail({
      to: email,
      subject: "Verify Your Email - Course Platform",
      html: `
        <h2>Hello ${fullName}</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for ${OTP_EXPIRE_MINUTES} minutes</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Registration successful. OTP sent to email.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Registration failed" });
  }
};

/* ================= VERIFY EMAIL ================= */
exports.verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Registration Successful 🎉",
      html: `<h2>Welcome ${user.fullName}</h2><p>Your email is verified.</p>`,
    });

    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New User Registered",
      html: `
        <p><b>Name:</b> ${user.fullName}</p>
        <p><b>Email:</b> ${user.email}</p>
        <p><b>Course:</b> ${user.interestedCourse || "N/A"}</p>
      `,
    });

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Verification failed" });
  }
};

/* ================= LOGIN ================= */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isVerified) {
      return res.status(403).json({ message: "Email not verified" });
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        interestedCourse: user.interestedCourse,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};

/* ================= FORGOT PASSWORD ================= */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = buildOtp();
    user.otp = otp;
    user.otpExpiresAt = Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000;
    await user.save();

    await sendEmail({
      to: user.email,
      subject: "Password Reset OTP - Course Platform",
      html: `
        <h2>Hello ${user.fullName}</h2>
        <p>Your password reset OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for ${OTP_EXPIRE_MINUTES} minutes</p>
      `,
    });

    res.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Forgot password failed" });
  }
};

/* ================= RESET PASSWORD ================= */
exports.resetPassword = async (req, res) => {
  res.json({ message: "Reset password API coming next" });
};

/* ================= PROFILE ================= */
exports.getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Member id is required" });
    }

    if (req.user?._id?.toString() !== id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const user = await User.findById(id).select("-password -otp -otpExpiresAt");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Profile fetch failed" });
  }
};
