import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendEmail } from "../services/mailer.js";
import otpGenerator from "otp-generator";
import otp from "../Templates/Mail/otp.js";

/* REGISTER USER */
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
  // verify otp and update user accordingly
  const { email, otp } = req.body;
  const user = await User.findOne({
    email,
    otp_expiry_time: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Email is invalid or OTP expired",
    });
  }

  if (user.verified) {
    return res.status(400).json({
      status: "error",
      message: "Email is already verified",
    });
  }

  // if (!(await user.correctOTP(otp, user.otp))) {
  //   res.status(400).json({
  //     status: "error",
  //     message: "OTP is incorrect",
  //   });

  //   return;
  // }
  if ((await user.otp) !== otp) {
    res.status(400).json({
      status: "error",
      message: "OTP is incorrect",
    });
  }

  // OTP is correct

  user.verified = true;
  user.otp = undefined;
  await user.save({ new: true, validateModifiedOnly: true });

  // const token = signToken(user._id);

  // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  // const userWithoutPassword = user.toObject();
  // delete userWithoutPassword.password;
  res.status(200).json({
    status: "success",
    message: "OTP verified Successfully!",
    // token,
    // user: userWithoutPassword,
  });
};

/* LOGGING IN */
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
