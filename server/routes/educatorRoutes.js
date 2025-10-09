import express from 'express'
import { 
    addCourse, 
    educatorDashboardData, 
    getEducatorCourses, 
    getEnrolledStudentsData, 
    updateRoleToEducator,
    updateCourse // <<< NEW: Import the new controller function
} from '../controllers/educatorController.js'; 
import upload from '../configs/multer.js';
import { protectEducator } from '../middlewares/authMiddleware.js';


const educatorRouter = express.Router()

// Add Educator Role 
educatorRouter.get('/update-role', updateRoleToEducator)

// Add Courses (POST)
educatorRouter.post('/add-course', upload.single('image'), protectEducator, addCourse)

// Update Courses (PUT) <<< NEW ROUTE ADDED
// The frontend calls this via /api/educator/update/:id
educatorRouter.put('/update/:id', upload.single('courseThumbnail'), protectEducator, updateCourse) 

// Get Educator Courses 
educatorRouter.get('/courses', protectEducator, getEducatorCourses)

// Get Educator Dashboard Data
educatorRouter.get('/dashboard', protectEducator, educatorDashboardData)

// Get Educator Students Data
educatorRouter.get('/enrolled-students', protectEducator, getEnrolledStudentsData)


export default educatorRouter;