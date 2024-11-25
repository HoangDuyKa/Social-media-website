import express from "express";
import {
  createAds,
  getAllAds,
  getRandomAds,
  destroyAds,
} from "../controllers/ads.js";
import { verifyToken } from "../middleware/auth.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

/* CREATE */
router.post("/upload", upload.single("picture"), verifyToken, createAds);

/* READ */
router.get("/random-ads", verifyToken, getRandomAds);
router.get("/", verifyToken, getAllAds);

/* DELETE */
router.delete("/:id", verifyToken, destroyAds);

export default router;
