import express from "express";
import {
  login,
  register,
  sendOTP,
  verifyOTP,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

/* CREATE */
router.post("/register", upload.single("picture"), register, sendOTP);

/* UPDATE */
router.post("/login", login);
router.post("/verify", verifyOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
