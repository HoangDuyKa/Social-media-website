import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const createNotifications = async (
  id, // id of placeId
  // senderImage,
  userSender, //id of sender notification
  type, // type of notification
  message, // message of notification
  receiverNotification, // who receive notifcation
  navigator = "" // navigate to ?
) => {
  //   try {
  //     const place = await Notification.find();
  //     const findPlace = place.find((plc) => plc.placeId.toString() === id);

  //     if (!findPlace) {
  //       const notification = new Notification({
  //         placeId: id,
  //         userId: postUserId,
  //         senderImage,
  //         type: type,
  //         message: message,
  //       });
  //       await notification.save();

  //       const receiverSocketId = getReceiverSocketId(postUserId);
  //       if (receiverSocketId) {
  //         io.to(receiverSocketId).emit("receiverNofi", notification);
  //         console.log("Notification sent:", notification);
  //       } else {
  //         console.log("Receiver socket ID not found");
  //       }
  //     } else {
  //       findPlace.placeId = id;
  //       findPlace.userId = postUserId;
  //       findPlace.senderImage = senderImage;
  //       findPlace.type = type;
  //       findPlace.message = message;

  //       await findPlace.save();

  //       const receiverSocketId = getReceiverSocketId(postUserId);
  //       if (receiverSocketId) {
  //         io.to(receiverSocketId).emit("receiverNofi", findPlace);
  //         console.log("Notification sent:", findPlace);
  //       } else {
  //         console.log("Receiver socket ID not found");
  //       }
  //     }
  //   } catch (error) {
  //     console.log("Error in createNotifications: ", error.message);
  //   }
  try {
    // Create or update the notification
    const notification = await Notification.findOneAndUpdate(
      { placeId: id },
      {
        placeId: id, //the place where the notification looking for is located
        userSender,
        userId: receiverNotification,
        // senderImage,
        type,
        message,
        isRead: false,
        navigator,
        createdAt: new Date(), // Set the current date and time
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
