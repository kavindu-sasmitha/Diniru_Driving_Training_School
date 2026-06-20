import express from "express";
import {
  registerStudent,
  loginUser,
  refreshTokens,
  getMe,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";
import { googleCheck } from "../controllers/authController";

const router = express.Router();

// Public auth endpoints
router.post("/register", registerStudent);
router.post("/login", loginUser);
router.post("/refresh-token", refreshTokens);
router.post("/google-check", googleCheck);

// Protected account profile lookup vector
router.get("/me", protect as any, getMe);

export default router;
