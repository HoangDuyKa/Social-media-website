import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getUsersForSidebar,
  getUsers,
  getRequests,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/getUsersForSidebar", verifyToken, getUsersForSidebar);
router.get("/get-users", verifyToken, getUsers);
router.get("/get-requests", verifyToken, getRequests);
// router.get("/get-friends", verifyToken, getFriends);
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
