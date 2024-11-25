import express from "express";
import { getSearchs } from "../controllers/search.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/", verifyToken, getSearchs);

export default router;
