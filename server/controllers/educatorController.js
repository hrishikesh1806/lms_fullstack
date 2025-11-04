// server/controllers/educatorController.js

import { v2 as cloudinary } from "cloudinary";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import ManualUser from "../models/Usermodel.js";

/* ==========================================================
   🔄 Update Role to Educator (ManualUser only)
   ========================================================== */
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: user not found" });
    }

    const user = await ManualUser.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.role = "educator";
    await user.save();

    res.json({ success: true, message: "You are now an educator and can publish courses" });
  } catch (error) {
    console.error("❌ updateRoleToEducator error:", error);
    res.status(500).json({ success: false, message: "Failed to update role" });
  }
};

/* ==========================================================
   🆕 Add New Course
   ========================================================== */
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    const imageFile = req.file;
    const educatorId = req.user?._id;

    if (!educatorId) {
      return res.status(401).json({ success: false, message: "Unauthorized: educator not found" });
    }

    if (!imageFile) {
      return res.status(400).json({ success: false, message: "Thumbnail not attached" });
    }

    const parsedCourseData = JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      folder: "course_thumbnails",
    });

    const newCourse = await Course.create({
      ...parsedCourseData,
      courseThumbnail: imageUpload.secure_url,
    });

    res.json({ success: true, message: "Course added successfully", course: newCourse });
  } catch (error) {
    console.error("❌ addCourse error:", error);
    res.status(500).json({ success: false, message: "Error adding course" });
  }
};

/* ==========================================================
   📘 Get Educator Courses
   ========================================================== */
export const getEducatorCourses = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const educatorId = req.user._id;
    const isAdmin = req.user.role === "admin";

    const query = isAdmin ? {} : { educator: educatorId };
    const courses = await Course.find(query).populate("educator", "name email");

    res.json({ success: true, courses });
  } catch (error) {
    console.error("❌ getEducatorCourses error:", error);
    res.status(500).json({ success: false, message: "Error fetching courses" });
  }
};

/* ==========================================================
   📊 Educator Dashboard Data
   ========================================================== */
export const educatorDashboardData = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const educatorId = req.user._id;
    const isAdmin = req.user.role === "admin";

    const query = isAdmin ? {} : { educator: educatorId };
    const courses = await Course.find(query);

    const totalCourses = courses.length;

    // ✅ Collect enrolled students from Purchase model
    const courseIds = courses.map((c) => c._id);
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle")
      .sort({ createdAt: -1 })
      .limit(10);

    const enrolledStudentsData = purchases.map((p) => ({
      courseTitle: p.courseId?.courseTitle || "Deleted Course",
      student: p.userId,
      enrolledDate: p.createdAt,
    }));

    // ✅ Calculate total earnings
    const allPurchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    });

    const totalEarnings = allPurchases.reduce((acc, p) => acc + (p.amount || 0), 0);

    res.json({
      success: true,
      dashboardData: {
        totalCourses,
        enrolledStudentsData,
        totalEarnings,
      },
    });
  } catch (error) {
    console.error("❌ educatorDashboardData error:", error);
    res.status(500).json({ success: false, message: "Error fetching dashboard data" });
  }
};

/* ==========================================================
   👩‍🎓 Get Enrolled Students Data
   ========================================================== */
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educatorId = req.user._id;

    const courses = await Course.find({ educator: educatorId });
    const courseIds = courses.map((c) => c._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed",
    })
      .populate("userId", "name imageUrl")
      .populate("courseId", "courseTitle");

    const enrolledStudents = purchases.map((p) => ({
      student: p.userId,
      courseTitle: p.courseId?.courseTitle || "Deleted Course",
      purchaseDate: p.createdAt,
    }));

    res.json({ success: true, enrolledStudents });
  } catch (error) {
    console.error("❌ getEnrolledStudentsData error:", error);
    res.status(500).json({ success: false, message: "Error fetching enrolled students" });
  }
};
