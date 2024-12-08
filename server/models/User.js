import mongoose from "mongoose";
import crypto from "crypto";
import mongooseDelete from "mongoose-delete";

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true },
    firstName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    lastName: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      min: 5,
    },
    picturePath: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    lock: {
      type: Boolean,
      default: false,
    },
    friends: {
      type: Array,
      default: [],
    },
    verified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otp_expiry_time: {
      type: Date,
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
    passwordResetToken: {
      // unselect
      type: String,
    },
    passwordResetExpires: {
      // unselect
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

userSchema.plugin(mongooseDelete, {
  overrideMethods: "all",
  deletedAt: true,
});

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token and set it to passwordResetToken field
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expiration time for the token (10 minutes from now)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
