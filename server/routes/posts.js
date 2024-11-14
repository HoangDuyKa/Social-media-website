import express from "express";
import {
  getFeedPosts,
  getUserPosts,
  likePost,
  commentPost,
  softDelete,
  restorePost,
  destroyPost,
  getUserTrash,
  deleteComment,
  editComment,
  replyCommentPost,
  deleteReplyComment,
  editReplyComment,
  createPost,
  getDetailPost,
  getUserStorage,
  getUserMemory,
  savePost,
  unsavePost,
  editStatus,
  editPost,
  adminDestroyPost,
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

/* CREATE */
router.post(
  "/",
  verifyToken,
  // upload.fields([
  //   { name: "picture", maxCount: 1 },
  //   { name: "video", maxCount: 1 },
  //   { name: "file", maxCount: 1 },
  // ]),
  upload.single("file"),
  createPost
);
router.post("/:id/save", verifyToken, savePost);

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, commentPost);
router.patch("/:id/deleteComment", verifyToken, deleteComment);
router.put("/:id/editComment", verifyToken, editComment);
router.patch("/:id/replyComment", verifyToken, replyCommentPost);
router.patch("/:id/deleteReplyComment", verifyToken, deleteReplyComment);
router.put("/:id/editReplyComment", verifyToken, editReplyComment);
router.patch("/:id/restore", verifyToken, restorePost);
router.patch("/:id/status", verifyToken, editStatus);
router.put("/:id/edit", verifyToken, upload.single("file"), editPost);

/* DELETE */
router.delete("/:id", verifyToken, softDelete);
router.delete("/:id/force", verifyToken, destroyPost);
router.delete("/:id/adminForce", verifyToken, adminDestroyPost);
router.delete("/:postId/unsave", verifyToken, unsavePost);

/* READ */
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/detail/:postId", verifyToken, getDetailPost);
router.get("/:userId/trash", verifyToken, getUserTrash);
router.get("/:userId/storage", verifyToken, getUserStorage);
router.get("/:userId/memory", verifyToken, getUserMemory);
router.get("/", verifyToken, getFeedPosts);

export default router;
