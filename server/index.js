import express from "express";
// import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cron from "node-cron";
import cors from "cors";
// import path from "path";
// import { fileURLToPath } from "url";

import Router from "./routes/index.js";

import { app, server } from "./socket/socket.js";
import connectToMongoDB from "./configs/db.js";
import { createAnniversaryPosts } from "./controllers/posts.js";
import Post from "./models/Post.js";
// import { sendMessage } from "./controllers/message.js";
// import { updateUser } from "./controllers/users.js";
// import { upload } from "./utils/upload.js";

/* CONFIGURATIONS */
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
dotenv.config();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("dev"));

// Middleware to manually set CORS headers
// app.use((req, res, next) => {
//   res.header(
//     "Access-Control-Allow-Origin",
//     // "https://connectu-lemon.vercel.app"
//     process.env.CLIENT_URL
//   ); // Replace with your frontend URL
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE"
//   );
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.header("Access-Control-Allow-Credentials", "true"); // This is needed if you're sending cookies with requests
//   // Handle preflight requests
//   if (req.method === "OPTIONS") {
//     return res.sendStatus(204);
//   }
//   next();
// });
// app.use(cors());

// app.use(
//   cors({
//     origin: "http://localhost:3000", // or '*'
//     credentials: true,
//   })
// );

// app.use(
//   cors({
//     // origin: "https://connectu-lemon.vercel.app", // Replace with your frontend URL
//     origin: process.env.CLIENT_URL, // Replace with your frontend URL
//     // credentials: true, // This is needed if you're sending cookies with requests
//   })
// );
// app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// /* ROUTES */
app.use("/", Router);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 5000;

// Schedule the task to run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running the anniversary check...");
  await createAnniversaryPosts();
});

// // check auto after a minute
// cron.schedule("* * * * *", async () => {
//   createAnniversaryPosts();
//   console.log("Running the anniversary check...");
// });

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
