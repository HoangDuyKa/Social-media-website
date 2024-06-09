import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* REGISTER USER */
export const register = async (req, res) => {
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
    const userEmail = await User.findOne({ email: email });
    if (userEmail) return res.status(400).json({ error: "User email exist. " });

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
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ error: "User does not exist. " });

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
