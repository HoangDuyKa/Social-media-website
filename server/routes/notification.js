import express from "express";
import {
  getNotifications,
  updateNotificationStatus,
} from "../controllers/notification.js";

const router = express.Router();

router.get("/:userId", getNotifications);
router.patch("/updateNotification/:id", updateNotificationStatus);

export default router;
