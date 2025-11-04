import express from 'express';
import {
  addCourse,
  educatorDashboardData,
  getEducatorCourses,
  getEnrolledStudentsData,
  updateRoleToEducator
} from '../controllers/educatorController.js';
import upload from '../configs/multer.js';
import { protectUser, protectEducator } from '../middlewares/authMiddleware.js';

const educatorRouter = express.Router();

/* ==========================================================
   🧑‍🏫 EDUCATOR ROLE MANAGEMENT
   ========================================================== */
// Upgrade a normal user to educator
educatorRouter.get('/update-role', protectUser, updateRoleToEducator);

/* ==========================================================
   📘 COURSE MANAGEMENT (Educator)
   ========================================================== */
// Add a new course (thumbnail upload supported)
educatorRouter.post('/add-course', protectUser, upload.single('image'), addCourse);

// Get all courses created by the logged-in educator
educatorRouter.get('/courses', protectUser, getEducatorCourses);

/* ==========================================================
   📊 EDUCATOR DASHBOARD
   ========================================================== */
// Get educator dashboard summary (requires educator role)
educatorRouter.get('/dashboard', protectUser, protectEducator, educatorDashboardData);

/* ==========================================================
   👩‍🎓 ENROLLED STUDENTS
   ========================================================== */
// Get all students enrolled in educator’s courses
educatorRouter.get('/enrolled-students', protectUser, getEnrolledStudentsData);

export default educatorRouter;
