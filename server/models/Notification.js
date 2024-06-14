import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  placeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  userId :{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userSender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  //   sender: {
  //     type: mongoose.Schema.ObjectId,
  //     ref: "User",
  //     required: true,
  //   },
  //   senderName: { type: String, required: true },
  // senderImage: { type: String, required: true },
  type: {
    type: String,
    enum: ["friend_request", "like", "comment"],
    required: true,
  },
  message: { type: String, required: true },
  navigator: { type: String },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", NotificationSchema);

export default Notification;
