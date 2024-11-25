import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getUsersForSidebar,
  getUsers,
  getRequests,
  updateUser,
  destroyUser,
  lockUser,
  getOnlineUsersInformation
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
router.post("/onlineInformation", verifyToken, getOnlineUsersInformation);

/* UPDATE */
router.patch("/:id/lock", verifyToken, lockUser);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.put("/updateUser/:userId", upload.single("picture"), verifyToken, updateUser);

/* DELETE */
router.delete("/:id/force", verifyToken, destroyUser);

export default router;
