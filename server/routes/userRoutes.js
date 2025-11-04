import express from "express";
import { protectUser } from "../middlewares/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
  getUserEnrolledCourses,
  purchaseCourse,
  confirmPayment,
} from "../controllers/userController.js";

const router = express.Router();

// User profile routes
router.get("/profile", protectUser, getUserProfile);
router.put("/update", protectUser, updateUserProfile);
router.get("/enrolled", protectUser, getUserEnrolledCourses);
router.get("/data", protectUser, getUserProfile);
router.get("/enrolled-courses", protectUser, getUserEnrolledCourses);

// Purchase routes
router.post("/purchase", protectUser, purchaseCourse);
router.post("/confirm-payment", protectUser, confirmPayment);

export default router;
