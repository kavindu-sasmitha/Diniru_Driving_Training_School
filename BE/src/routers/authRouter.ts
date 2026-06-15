import express from "express";
import {
  registerStudent,
  loginUser,
  refreshTokens,
  getMe,
  getSingleStudentForAdmin, 
} from "../controllers/authController";
import { protect, restrictToAdmin } from "../middleware/authMiddleware"; 
import { googleCheck } from "../controllers/authController";

const router = express.Router();

// Public auth endpoints
router.post("/register", registerStudent);
router.post("/login", loginUser);
router.post("/refresh-token", refreshTokens);
router.post("/google-check", googleCheck);


router.get("/me", protect as any, getMe);


router.get("/students/:query", protect as any, restrictToAdmin as any, getSingleStudentForAdmin);
export default router;