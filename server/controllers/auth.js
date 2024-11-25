import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../services/mailer.js";
import otpGenerator from "otp-generator";
import otp from "../Templates/Mail/otp.js";
import resetPasswordTemplate from "../Templates/Mail/resetPassword.js";
import crypto from "crypto";

/* CREATE */
export const register = async (req, res, next) => {
  try {
    // const imageUrl = req.file.path;
    const {
      firstName,
      lastName,
      email,
      password,
      friends,
      location,
      occupation,
    } = req.body;

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const existing_user = await User.findOne({ email: email });
    if (existing_user && existing_user.verified) {
      console.log("if one");
      return res.status(400).json({ error: "User email exist. " });
    } else if (existing_user) {
      await User.findOneAndUpdate(
        { email: email },
        {
          firstName,
          lastName,
          email,
          password: passwordHash,
          picturePath: req?.file?.path
            ? req?.file?.path
            : "https://res.cloudinary.com/dv2rpmss3/image/upload/v1717890636/images/NoImage.webp",
          friends,
          location,
          occupation,
          viewedProfile: Math.floor(Math.random() * 10000), //Update feature
          impressions: Math.floor(Math.random() * 10000), //Update feature
        },
        {
          new: true,
          validateModifiedOnly: true,
        }
      );
      console.log("else if");

      // generate an otp and send to email
      req.userId = existing_user._id;
      next();
    } else {
      // const new_user = await User.create(req.body);
      console.log("else");

      const newUser = new User({
        firstName,
        lastName,
        email,
        password: passwordHash,
        picturePath: req?.file?.path
          ? req?.file?.path
          : "https://res.cloudinary.com/dv2rpmss3/image/upload/v1717890636/images/NoImage.webp",
        friends,
        location,
        occupation,
        viewedProfile: Math.floor(Math.random() * 10000), //Update feature
        impressions: Math.floor(Math.random() * 10000), //Update feature
      });
      const savedUser = await newUser.save();
      const userWithoutPassword = savedUser.toObject();
      delete userWithoutPassword.password;

      // generate an otp and send to email
      req.userId = savedUser._id;
      next();
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* UPDATE */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ error: "User does not exist. " });

    if (user.verified === false)
      return res
        .status(400)
        .json({ error: "You still not verified for this user!" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    //{ expiresIn: 60 }
    // delete user.password;
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;
    res.status(200).json({ token, user: userWithoutPassword });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const sendOTP = async (req, res, next) => {
  const { userId } = req;
  const new_otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
    lowerCaseAlphabets: false,
  });

  const otp_expiry_time = Date.now() + 10 * 60 * 1000; // 10 Mins after otp is sent

  const user = await User.findByIdAndUpdate(userId, {
    otp_expiry_time: otp_expiry_time,
  });

  user.otp = new_otp.toString();

  await user.save({ new: true, validateModifiedOnly: true });

  console.log(new_otp);

  // TODO send mail
  sendEmail({
    from: "duyka6203@gmail.com",
    to: user.email,
    subject: "Verification OTP",
    html: otp(user.firstName, new_otp),
    attachments: [],
  });

  res.status(200).json({
    status: "success",
    message: "OTP Sent Successfully!",
  });
};

export const verifyOTP = async (req, res, next) => {
  try {
    // Extract email and otp from the request body
    const { email, otp } = req.body;

    // Find the user by email and check if the OTP has not expired
    const user = await User.findOne({
      email,
      otp_expiry_time: { $gt: Date.now() },
    });

    // Check if user exists and if OTP has not expired
    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Email is invalid or OTP expired",
      });
    }

    // Check if the user's email is already verified
    if (user.verified) {
      return res.status(400).json({
        status: "error",
        message: "Email is already verified",
      });
    }

    // Check if the provided OTP matches the user's OTP
    if (user.otp !== otp) {
      return res.status(400).json({
        status: "error",
        message: "OTP is incorrect",
      });
    }

    // OTP is correct, update user as verified and clear the OTP
    user.verified = true;
    user.otp = undefined;
    await user.save({ new: true, validateModifiedOnly: true });

    // Send a success response
    return res.status(200).json({
      status: "success",
      message: "OTP verified successfully!",
    });
  } catch (error) {
    // Catch any unexpected errors and send an appropriate response
    console.error("Error verifying OTP:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while verifying OTP",
    });
  }
};

export const forgotPassword = async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: "error",
      message: "There is no user with email address.",
    });
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  try {
    const resetURL = `http://localhost:3000/new-password?token=${resetToken}`;
    // TODO => Send Email with this Reset URL to user's email address

    console.log(resetURL);

    sendEmail({
      from: "duyka6203@gmail.com",
      to: user.email,
      subject: "Reset Password",
      html: resetPasswordTemplate(user.firstName, resetURL),
      attachments: [],
    });

    res.status(200).json({
      status: "success",
      message:
        "Your request have been sent successfully, Please check your email address to reset your password",
    });
  } catch (err) {
    // In case of error, clear the reset token and expiration
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return res.status(500).json({
      message: "There was an error sending the email. Try again later!",
    });
  }
};

export const resetPassword = async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.body.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Token is Invalid or Expired",
    });
  }
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(req.body.password, salt);
  user.password = passwordHash;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  const userId = user._id;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  res.status(200).json({
    status: "success",
    message: "Password Reseted Successfully",
    token,
  });
};
