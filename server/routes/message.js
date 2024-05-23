import express from "express";
import { getMessages, sendMessage } from "../controllers/message.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/send/:id", verifyToken, sendMessage);
router.get("/:id", verifyToken, getMessages);

export default router;
