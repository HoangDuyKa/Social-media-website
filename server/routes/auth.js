import express from "express";
import { login, register, sendOTP, verifyOTP } from "../controllers/auth.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.post("/register", upload.single("picture"), register, sendOTP);
router.post("/verify", verifyOTP);

router.post("/login", login);

export default router;
