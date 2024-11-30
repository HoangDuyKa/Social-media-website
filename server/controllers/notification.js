import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

/* CREATE */
export const createNotifications = async (
  id, // id of placeId
  userSender, //id of sender notification
  type, // type of notification
  message, // message of notification
  receiverNotification, // who receive notifcation
  navigator = "" // navigate to ?
) => {
  try {
    // Create or update the notification
    const notification = await Notification.findOneAndUpdate(
      { placeId: id },
      {
        placeId: id,
        userSender,
        userId: receiverNotification,
        // senderImage,
        type,
        message,
        isRead: false,
        navigator,
        createdAt: new Date(),
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).populate("userSender", "_id firstName lastName picturePath location");

    // Emit the notification to the receiver if they are connected
    const receiverSocketId = getReceiverSocketId(receiverNotification);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiverNofi", notification);
      console.log("Notification sent:", notification);
    } else {
      console.log("Receiver socket ID not found");
    }
  } catch (error) {
    console.log("Error in createNotifications: ", error.message);
  }
};

/* READ */
export const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId })
      .populate("userSender", "_id firstName lastName picturePath location")
      .sort({
        createdAt: -1,
      });
    // console.log(notifications)
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* UPDATE */
export const updateNotificationStatus = async (req, res) => {
  const { id } = req.params;
  const { isRead } = req.body;

  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead },
      { new: true }
    ).populate("userSender", "_id firstName lastName picturePath location");

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.status(200).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
