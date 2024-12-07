import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import User from "../models/User.js";
import FriendRequest from "../models/friendRequest.js";
// import Message from "../models/message.js";
import Conversation from "../models/conversation.js";
import { createNotifications } from "../controllers/notification.js";

const app = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}
io.on("connection", async (socket) => {
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  //Other listeners
  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("friend_request", async (data) => {
    try {
      const toSocketId = userSocketMap[data.to];
      const fromSocketId = userSocketMap[data.from];

      // if (!toSocketId || !fromSocketId) {
      //   console.error("Recipient or sender socket_id missing.");
      //   return;
      // }

      const existingRequest = await FriendRequest.findOne({
        sender: data.from,
        recipient: data.to,
      });

      if (existingRequest) {
        io.to(fromSocketId).emit("request_already_sent", {
          message: "Friend request already sent.",
        });
        return;
      }

      await FriendRequest.create({ sender: data.from, recipient: data.to });

      createNotifications(
        data.to,
        data.from, //id of sender
        "Friend request",
        `${data.name} have just sent you a friend request`,
        data.to, //id of receiver
        `/profile/${data.from}`
      );

      io.to(toSocketId).emit("new_friend_request", {
        message: "New friend request received.",
      });
      io.to(fromSocketId).emit("request_sent", {
        message: "Request sent successfully!",
      });
    } catch (error) {
      console.error("Error handling friend request:", error);
    }
  });

  socket.on("accept_request", async (data) => {
    // accept friend request => add ref of each other in friends array
    const request_doc = await FriendRequest.findById(data.request_id);

    const sender = await User.findById(request_doc.sender);
    const receiver = await User.findById(request_doc.recipient);

    sender.friends.push(request_doc.recipient.toString());
    receiver.friends.push(request_doc.sender.toString());

    await receiver.save({ new: true, validateModifiedOnly: true });
    await sender.save({ new: true, validateModifiedOnly: true });

    await FriendRequest.findByIdAndDelete(data.request_id);
    // check if there is any existing conversation
    const existing_conversations = await Conversation.find({
      participants: { $size: 2, $all: [receiver._id, sender._id] },
    }).populate("participants", "firstName lastName _id email status");

    // console.log(existing_conversations[0], "Existing Conversation");

    if (existing_conversations.length === 0) {
      let new_chat = await Conversation.create({
        participants: [receiver._id, sender._id],
      });

      new_chat = await Conversation.findById(new_chat).populate(
        "participants",
        "firstName lastName _id email status"
      );
    }

    // emit event request accepted to both
    io.to(sender?.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });
    io.to(receiver?.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });
  });

  socket.on("deny_request", async (data) => {
    const { request_id } = data;

    try {
      // Find and delete the friend request by its ID
      const request = await FriendRequest.findByIdAndDelete(request_id);

      if (request) {
        const senderSocketId = userSocketMap[request.sender];
        const recipientSocketId = userSocketMap[request.recipient];

        // Notify the sender about the denial
        if (senderSocketId) {
          io.to(senderSocketId).emit("request_denied", {
            message: "Your friend request was denied.",
          });
        }

        // Optionally, notify the recipient as well
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("deny_confirmation", {
            message: "Friend request denied successfully.",
          });
        }

        console.log(`Friend request ${request_id} denied.`);
      } else {
        console.error(`Friend request with ID ${request_id} not found.`);
      }
    } catch (error) {
      console.error("Error denying friend request:", error);
    }
  });

  //Messages
  socket.on("get_direct_conversations", async ({ user_id }, callback) => {
    const existing_conversations = await Conversation.find({
      participants: { $all: [user_id] },
    })
      .populate(
        "participants",
        "firstName lastName picturePath _id email status"
      )
      .populate("messages", "message");

    callback(existing_conversations);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
