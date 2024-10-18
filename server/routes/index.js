import express from "express";
const router = express.Router();

import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import postRoutes from "./posts.js";
import messageRoutes from "./message.js";
import notificationRoutes from "./notification.js";
import searchRoutes from "./search.js";
import adsRoutes from "./ads.js";

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/posts", postRoutes);
router.use("/messages", messageRoutes);
router.use("/notifications", notificationRoutes);
router.use("/search", searchRoutes);
router.use("/ads", adsRoutes);

export default router;

// post = {file:{path:"https://res.cloudinary.com/dv2rpmss3/image/upload/v1718226554/images/file-1718226554152-post7.jpg"
// fileType:"Image"
// fileName:"post7.jpeg"}
// _id:"666a0e7b74a7f3df7595cecd"
// userId:"666a0d3474a7f3df7595ce79"
// firstName:"111"
// lastName:"111"
// description:"today, I have a great wedding"
// userPicturePath:"https://res.cloudinary.com/dv2rpmss3/image/upload/v1718226227/images/file-1718226227071-p3.jpg"
// deleted:false
// createdAt:"2024-06-12T21:09:15.274Z"
// updatedAt:"2024-06-13T17:11:10.645Z"
// }

// user = {
// _id:"666a0e7b74a7f3df7595cecd"
// firstName:"111"
// lastName:"111"
// picturePath:"https://res.cloudinary.com/dv2rpmss3/image/upload/v1718226227/images/file-1718226227071-p3.jpg"
// createdAt:"2024-06-12T21:09:15.274Z"
// updatedAt:"2024-06-13T17:11:10.645Z"
// }
