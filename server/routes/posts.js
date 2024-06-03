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
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* UPDATE */
router.patch("/:id/like", verifyToken, likePost);
router.patch("/:id/comment", verifyToken, commentPost);
router.patch("/:id/restore", verifyToken, restorePost);

/* DELETE */
router.delete("/:id", verifyToken, softDelete);
router.delete("/:id/force", verifyToken, destroyPost);

/* READ */
router.get("/:userId/posts", verifyToken, getUserPosts);
router.get("/:userId/trash", verifyToken, getUserTrash);
router.get("/", verifyToken, getFeedPosts);

export default router;
