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
  // params: async (req, file) => {
  //   let folder, resource_type, public_id, fileExtension;
  //   if (file.mimetype.startsWith("image/")) {
  //     folder = "images";
  //     resource_type = "image";
  //     public_id = `image-${Date.now()}-${path.basename(
  //       file.originalname,
  //       path.extname(file.originalname)
  //     )}`;
  //   } else if (file.mimetype.startsWith("video/")) {
  //     folder = "videos";
  //     resource_type = "video";
  //     public_id = `video-${Date.now()}-${path.basename(
  //       file.originalname,
  //       path.extname(file.originalname)
  //     )}`;
  //   } else {
  //     // console.log(file.mimetype.split("/")[0]);
  //     folder = "files";
  //     resource_type = "auto";
  //     fileExtension = path.extname(file.originalname).substring(1);
  //     public_id = `file-${Date.now()}-${path.basename(
  //       file.originalname,
  //       path.extname(file.originalname)
  //     )}`;
  //     // throw new Error("Unsupported file type");
  //   }
  //   console.log("public_id", public_id);
  //   return {
  //     folder: folder,
  //     resource_type: resource_type,
  //     public_id: public_id,
  //     format: fileExtension ? fileExtension : null,
  //   };
  // },
  params: async (req, file) => {
    // let folder = "files";
    // let resource_type = "raw";
    // console.log("start");

    // const fileExtension = path.extname(file.originalname).substring(1); // Get file extension without the dot
    // const format = fileExtension;
    // const public_id = `file-${Date.now()}-${path.basename(
    //   file.originalname,
    //   path.extname(file.originalname)
    // )}`;

    // if (file.mimetype.startsWith("image/")) {
    //   folder = "images";
    //   resource_type = "image";
    // } else if (file.mimetype.startsWith("video/")) {
    //   folder = "videos";
    //   resource_type = "video";
    // } else if (file.mimetype.startsWith("audio/")) {
    //   folder = "audio";
    //   resource_type = "video";
    // }
    const folderMap = {
      Image: "images",
      Video: "videos",
      Audio: "audio",
      File: "files",
    };
    const resourceTypeMap = {
      Image: "image",
      Video: "video",
      Audio: "video",
      File: "raw",
    };
    const folder = folderMap[req.body.fileType] || "files";
    const resource_type = resourceTypeMap[req.body.fileType] || "raw";

    const fileExtension = path.extname(file.originalname).substring(1); // Get file extension without the dot
    const public_id = `file-${Date.now()}-${path.basename(
      file.originalname,
      path.extname(file.originalname)
    )}`;
    const format = fileExtension ? fileExtension : null;
    console.log("folder", folder);
    console.log("resource_type", resource_type);
    console.log("public_id", public_id);
    console.log("format", format);

    return {
      folder: folder,
      resource_type: resource_type,
      public_id: public_id,
      format: format, // Ensure the file extension is included in the URL
    };
  },
});

// const upload = multer({ storage: storage });

const upload = multer({
  storage: storage,
  limits: { fileSize: 100000000 }, // Limit file size to 100MB (adjust as needed)
});

/* ROUTES WITH FILES */
app.post("/auth/register", upload.single("picture"), register);
// app.post("/posts", verifyToken, upload.single("picture"), createPost);
app.post(
  "/posts",
  verifyToken,
  // upload.fields([
  //   { name: "picture", maxCount: 1 },
  //   { name: "video", maxCount: 1 },
  //   { name: "file", maxCount: 1 },
  // ]),
  upload.single("file"),
  createPost
);
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
