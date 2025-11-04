import express from 'express';
import {
  getAllCourse,
  getCourseId,
  deleteAllCourse,
  enrollCourse,
} from '../controllers/courseController.js';
import { protectUser, protectAdmin } from '../middlewares/authMiddleware.js';

const courseRouter = express.Router();

/* ==========================================================
   📚 PUBLIC ROUTES
   ========================================================== */
// Get all published courses
courseRouter.get('/all', getAllCourse);

// Get single course by ID
courseRouter.get('/:id', getCourseId);

/* ==========================================================
   🎓 PROTECTED ROUTES (Manual Users)
   ========================================================== */
// Enroll in a course (requires login)
courseRouter.post('/enroll', protectUser, enrollCourse);

/* ==========================================================
   🛑 ADMIN ROUTES
   ========================================================== */
// Delete all courses (admin only)
courseRouter.delete('/deleteall', protectUser, protectAdmin, deleteAllCourse);

export default courseRouter;
