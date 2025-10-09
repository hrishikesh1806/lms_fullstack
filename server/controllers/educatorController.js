import { v2 as cloudinary } from 'cloudinary'
import Course from '../models/Course.js';
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';
import { clerkClient } from '@clerk/express'

// update role to educator
export const updateRoleToEducator = async (req, res) => {
    // ... (existing implementation)
    try {

        const userId = req.auth.userId

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            },
        })

        res.json({ success: true, message: 'You can publish a course now' })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Add New Course
export const addCourse = async (req, res) => {
    // ... (existing implementation)
    try {

        const { courseData } = req.body

        const imageFile = req.file

        const educatorId = req.auth.userId

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' })
        }

        const parsedCourseData = await JSON.parse(courseData)

        parsedCourseData.educator = educatorId

        const newCourse = await Course.create(parsedCourseData)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        newCourse.courseThumbnail = imageUpload.secure_url

        await newCourse.save()

        res.json({ success: true, message: 'Course Added' })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }
}

// Get Educator Courses
export const getEducatorCourses = async (req, res) => {
    // ... (existing implementation)
    try {

        const educator = req.auth.userId

        const courses = await Course.find({ educator })

        res.json({ success: true, courses })

    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

// Get Educator Dashboard Data ( Total Earning, Enrolled Students, No. of Courses)
export const educatorDashboardData = async (req, res) => {
    // ... (existing implementation)
    try {
        const educator = req.auth.userId;

        const courses = await Course.find({ educator });

        const totalCourses = courses.length;

        const courseIds = courses.map(course => course._id);

        // Calculate total earnings from purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

        // Collect unique enrolled student IDs with their course titles
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find({
                _id: { $in: course.enrolledStudents }
            }, 'name imageUrl');

            students.forEach(student => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student
                });
            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings,
                enrolledStudentsData,
                totalCourses
            }
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Enrolled Students Data with Purchase Data
export const getEnrolledStudentsData = async (req, res) => {
    // ... (existing implementation)
    try {
        const educator = req.auth.userId;

        // Fetch all courses created by the educator
        const courses = await Course.find({ educator });

        // Get the list of course IDs
        const courseIds = courses.map(course => course._id);

        // Fetch purchases with user and course data
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        }).populate('userId', 'name imageUrl').populate('courseId', 'courseTitle');

        // enrolled students data
        const enrolledStudents = purchases.map(purchase => ({
            student: purchase.userId,
            courseTitle: purchase.courseId.courseTitle,
            purchaseDate: purchase.createdAt
        }));

        res.json({
            success: true,
            enrolledStudents
        });

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        });
    }
};


// ------------------------------------------------------------------
// NEW FUNCTION: updateCourse 
// ------------------------------------------------------------------
export const updateCourse = async (req, res) => {
    try {
        const courseId = req.params.id;
        const educatorId = req.auth.userId; 
        const file = req.file; 

        // Text fields are directly in req.body
        const { courseTitle, courseDescription } = req.body;

        // 1. Find Course and Authorize
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }
        
        // Ensure the logged-in user is the course owner
        if (course.educator.toString() !== educatorId) {
             return res.status(403).json({ success: false, message: "Unauthorized: You do not own this course." });
        }

        const updateFields = {};
        
        // 2. Update Text Fields (only if they are provided in the request)
        if (courseTitle) updateFields.courseTitle = courseTitle;
        if (courseDescription) updateFields.courseDescription = courseDescription;

        // 3. Handle Image Update
        if (file) {
            // Use the same Cloudinary upload method as in addCourse
            const imageUpload = await cloudinary.uploader.upload(file.path); 
            
            // Store the new public URL
            updateFields.courseThumbnail = imageUpload.secure_url;
            
            // OPTIONAL: Delete the old image from Cloudinary if needed.
        }

        // 4. Database Update
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $set: updateFields },
            { new: true, runValidators: true } 
        );

        res.json({ 
            success: true, 
            message: "Course updated successfully!", 
            course: updatedCourse 
        });

    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}