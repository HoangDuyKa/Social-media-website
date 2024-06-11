import express from "express";
const router = express.Router();

import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import postRoutes from "./posts.js";
import messageRoutes from "./message.js";
import notificationRoutes from "./notification.js";

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/messages", messageRoutes);
router.use("/notifications", notificationRoutes);

export default router;
