const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    purpose: {
      type: String,
      enum: ["EMAIL_VERIFY", "PASSWORD_RESET"],
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    },
    isUsed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Otp", otpSchema);
