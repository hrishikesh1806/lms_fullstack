// server/controllers/adminController.js

import mongoose from "mongoose";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js";
import ManualUser from "../models/Usermodel.js";

/* ======================================================
   📊 ADMIN DASHBOARD CONTROLLER
   - Shows all courses, total earnings, and enrolled students
   ====================================================== */
export const getAdminDashboard = async (req, res) => {
  try {
    // ✅ Fetch all courses
    const courses = await Course.find({});
    if (!courses.length) {
      return res.json({
        success: true,
        dashboardData: {
          totalCourses: 0,
          totalEarnings: 0,
          enrolledStudentsData: [],
        },
      });
    }

    let totalEarnings = 0;
    const enrolledStudentsData = [];

    // ✅ Get all completed purchases at once (faster)
    const purchases = await Purchase.find({ status: "completed" });

    // ✅ Preload all user IDs to minimize DB hits
    const userIds = [...new Set(purchases.map((p) => p.userId.toString()))];
    const usersMap = new Map();

    const users = await ManualUser.find({ _id: { $in: userIds } }).select("name");
    users.forEach((u) => usersMap.set(u._id.toString(), u));

    // ✅ Process courses + earnings
    for (const course of courses) {
      const coursePurchases = purchases.filter(
        (p) => p.courseId.toString() === course._id.toString()
      );

      // Add to total earnings
      totalEarnings += coursePurchases.reduce(
        (sum, p) => sum + (parseFloat(p.amount) || 0),
        0
      );

      // Collect enrolled student data
      for (const p of coursePurchases) {
        const student = usersMap.get(p.userId.toString()) || { name: "Unknown" };

        enrolledStudentsData.push({
          student,
          courseTitle: course.courseTitle,
          purchaseDate: p.createdAt,
        });
      }
    }

    // ✅ Send Dashboard Summary
    res.json({
      success: true,
      dashboardData: {
        totalCourses: courses.length,
        totalEarnings,
        enrolledStudentsData,
      },
    });
  } catch (err) {
    console.error("❌ Admin dashboard error:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
