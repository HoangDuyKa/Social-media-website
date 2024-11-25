import express from "express";
import {
  getNotifications,
  updateNotificationStatus,
} from "../controllers/notification.js";

const router = express.Router();

/* READ */
router.get("/:userId", getNotifications);

/* UPDATE */
router.patch("/updateNotification/:id", updateNotificationStatus);

export default router;
