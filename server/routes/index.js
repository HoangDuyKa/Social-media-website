import express from "express";
const router = express.Router();

import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import postRoutes from "./posts.js";
import messageRoutes from "./message.js";

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/messages", messageRoutes);

export default router;
