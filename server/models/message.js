import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
    },
    type: {
      type: String,
      enum: ["Text", "Media", "Document", "Link"],
    },
    created_at: {
      type: Date,
      default: Date.now(),
    },
    // text: {
    //   type: String,
    //   required: true,
    // },
    file: {
      type: String,
    },
    // createdAt, updatedAt
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
