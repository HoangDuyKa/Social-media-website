import { Server } from "socket.io";
import http from "http";
import express from "express";
import cors from "cors";
import User from "../models/User.js";
import FriendRequest from "../models/friendRequest.js";
// import Message from "../models/message.js";
import Conversation from "../models/conversation.js";

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

  // io.emit() is used to send events to all the connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("friend_request", async (data) => {
    const to = await User.findById(data.to).select("socket_id");
    const from = await User.findById(data.from).select("socket_id");
    console.log(to);
    console.log(from);

    // create a friend request
    await FriendRequest.create({
      sender: data.from,
      recipient: data.to,
    });
    // emit event request received to recipient
    io.to(to?.socket_id).emit("new_friend_request", {
      message: "New friend request received",
    });
    io.to(from?.socket_id).emit("request_sent", {
      message: "Request Sent successfully!",
    });
  });

  socket.on("accept_request", async (data) => {
    // accept friend request => add ref of each other in friends array
    console.log(data);
    const request_doc = await FriendRequest.findById(data.request_id);

    console.log(request_doc);

    const sender = await User.findById(request_doc.sender);
    const receiver = await User.findById(request_doc.recipient);

    sender.friends.push(request_doc.recipient.toString());
    receiver.friends.push(request_doc.sender.toString());

    await receiver.save({ new: true, validateModifiedOnly: true });
    await sender.save({ new: true, validateModifiedOnly: true });

    await FriendRequest.findByIdAndDelete(data.request_id);
    // const { to, from } = data;
    console.log(data);
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
