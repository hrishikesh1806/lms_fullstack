// server/controllers/courseController.js

import Course from "../models/Course.js";
import ManualUser from "../models/Usermodel.js";

/* ==========================================================
   📚 Get All Courses (Only Published)
   ========================================================== */
export const getAllCourse = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true })
      .select(["-courseContent", "-enrolledStudents"])
      .populate({ path: "educator", select: "name email role" });

    res.json({ success: true, courses });
  } catch (error) {
    console.error("❌ getAllCourse error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch courses" });
  }
};

/* ==========================================================
   📘 Get Course by ID (Hide Non-Free Lecture URLs)
   ========================================================== */
export const getCourseId = async (req, res) => {
  try {
    const { id } = req.params;
    const courseData = await Course.findById(id).populate("educator", "name email role");

    if (!courseData) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Hide locked lectures
    if (Array.isArray(courseData.courseContent)) {
      courseData.courseContent.forEach((chapter) => {
        if (Array.isArray(chapter.chapterContent)) {
          chapter.chapterContent.forEach((lecture) => {
            if (!lecture.isPreviewFree) lecture.lectureUrl = "";
          });
        }
      });
    }

    res.json({ success: true, courseData });
  } catch (error) {
    console.error("❌ getCourseId error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch course details" });
  }
};

/* ==========================================================
   ❌ Delete All Courses (Admin Only)
   ========================================================== */
export const deleteAllCourse = async (req, res) => {
  try {
    await Course.deleteMany({});
    res.json({ success: true, message: "All courses deleted successfully" });
  } catch (error) {
    console.error("❌ deleteAllCourse error:", error.message);
    res.status(500).json({ success: false, message: "Error deleting courses" });
  }
};

/* ==========================================================
   🎓 Enroll in a Course (Manual Users Only)
   ========================================================== */
export const enrollCourse = async (req, res) => {
  try {
    const userId = req.user?._id;
    const { courseId } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: user not found" });
    }

    const [user, course] = await Promise.all([
      ManualUser.findById(userId),
      Course.findById(courseId),
    ]);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    if (user.enrolledCourses.includes(courseId)) {
      return res.json({ success: false, message: "Already enrolled in this course" });
    }

    user.enrolledCourses.push(courseId);
    course.enrolledStudents.push(userId);

    await Promise.all([user.save(), course.save()]);

    res.json({ success: true, message: "Enrolled successfully", user });
  } catch (error) {
    console.error("❌ enrollCourse error:", error.message);
    res.status(500).json({ success: false, message: "Error enrolling in course" });
  }
};
