import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import Router from "./routes/index.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

import cloudinary from "./configs/cloudinary.js";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { app, server } from "./socket/socket.js";
import connectToMongoDB from "./configs/db.js";
import { sendMessage } from "./controllers/message.js";

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));
// app.use(morgan("common"));
// app.use(bodyParser.json({ limit: "30mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

/* FILE STORAGE */
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "public/assets");
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   },
// });
// cloudinary.uploader.upload(
//   "https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
//   { public_id: "olympic_flag" },
//   function (error, result) {
//     console.log(result);
//   }
// );

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Posts",
    allowedFormats: ["jpg", "png", "gif", "jpeg"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const upload = multer({ storage: storage });

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);
// app.post("/messages/send/:id", verifyToken, sendMessage);

// /* ROUTES */
app.use("/", Router);
// import authRoutes from "./routes/auth.js";
// import userRoutes from "./routes/users.js";
// import postRoutes from "./routes/posts.js";
// import messageRoutes from "./routes/message.js";

// app.use("/auth", authRoutes);
// app.use("/users", userRoutes);
// app.use("/posts", postRoutes);
// app.use("/messages", messageRoutes);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server Running on port ${PORT}`);
  connectToMongoDB();
  /* ADD DATA ONE TIME */
  // User.insertMany(users);
  // Post.insertMany(posts);
  // uploadImagesAndCreateUsers(users, cloudinary).then(() =>
  //   uploadPostImagesAndCreatePosts(posts, cloudinary)
  // );
});

// import User from "./models/User.js";
// import Post from "./models/Post.js";
// import { users, posts } from "./data/index.js";
// import {
// uploadImagesAndCreateUsers,
// uploadPostImagesAndCreatePosts,
// } from "./data/index.js";
