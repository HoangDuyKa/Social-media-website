import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getUsersForSidebar,
  getUsers,
  getRequests,
  updateUser,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";

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
router.put(
  "/updateUser/:userId",
  upload.single("picture"),
  verifyToken,
  updateUser
);

export default router;
