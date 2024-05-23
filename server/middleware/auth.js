import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const verifyToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(403).send("Access Denied");
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trimLeft();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (!verified) {
      return res.status(401).json({ error: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(verified.id).select("-password");
    // console.log(user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    req.user = user;
    // console.log(req.user._id.toString());
    // console.log(req.user);
    // req.user = verified;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
