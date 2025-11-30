// server/controllers/userController.js
import bcrypt from "bcryptjs";
import ManualUser from "../models/Usermodel.js";
import Course from "../models/Course.js";
import { Purchase } from "../models/Purchase.js"; // ✅ Correct import (named export)

/* ==========================================================
   👤 Get User Profile (Manual User)
   ========================================================== */
export const getUserProfile = async (req, res) => {
  try {
    const user = await ManualUser.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("❌ getUserProfile Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ==========================================================
   ✏️ Update User Profile (with secure password update)
   ========================================================== */
export const updateUserProfile = async (req, res) => {
  try {
    const user = await ManualUser.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, email, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email.toLowerCase();

    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();
    const updatedUser = await ManualUser.findById(user._id).select("-password");

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("❌ updateUserProfile Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ==========================================================
   📚 Get User Enrolled Courses (Manual User)
   ========================================================== */
export const getUserEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    const purchases = await Purchase.find({
      userId,
      status: "completed",
    }).populate("courseId");

    const enrolledCourses = purchases
      .map((p) => p.courseId)
      .filter((course) => course);

    res.json({ success: true, enrolledCourses });
  } catch (error) {
    console.error("❌ getUserEnrolledCourses Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ==========================================================
   💳 Purchase Course (Manual User - Stripe Integration)
   ========================================================== */
export const purchaseCourse = async (req, res) => {
  try {
    const userId = req.user._id;
    const { courseId } = req.body;

    if (!courseId) {
      return res
        .status(400)
        .json({ success: false, message: "Course ID is required" });
    }

    const [user, course] = await Promise.all([
      ManualUser.findById(userId),
      Course.findById(courseId),
    ]);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });

    // Check if already enrolled
    if (user.enrolledCourses.includes(courseId)) {
      return res.json({ success: false, message: "Already enrolled in this course" });
    }

    // Calculate discounted price
    const discountedPrice =
      course.coursePrice - (course.coursePrice * course.discount) / 100;
    const amount = Math.round(discountedPrice * 100);

    // Stripe key validation
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error("❌ STRIPE_SECRET_KEY missing in .env");
      return res
        .status(500)
        .json({ success: false, message: "Payment service not configured" });
    }

    // ✅ Save purchase record first
    const purchase = new Purchase({
      userId,
      courseId,
      amount: discountedPrice,
      status: "pending",
    });
    await purchase.save();

    // Initialize Stripe
    const stripe = (await import("stripe")).default(process.env.STRIPE_SECRET_KEY);

    // ✅ Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.courseTitle,
              description: course.courseDescription.slice(0, 100),
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/payment-success?purchaseId=${purchase._id}&courseId=${courseId}`,
      cancel_url: `${process.env.FRONTEND_URL}/course/${courseId}`,
      metadata: {
        userId: userId.toString(),
        courseId: courseId.toString(),
        purchaseId: purchase._id.toString(),
      },
    });

    // Update purchase with stripeSessionId
    purchase.stripeSessionId = session.id;
    await purchase.save();

    res.json({
      success: true,
      session_url: session.url,
      session_id: session.id,
    });
  } catch (error) {
    console.error("❌ purchaseCourse Error:", error.message);
    console.error("❌ Full error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ==========================================================
   ✅ Confirm Payment (Manual User - Stripe Webhook Alternative)
   ========================================================== */
export const confirmPayment = async (req, res) => {
  try {
    const { purchaseId, courseId } = req.body;
    const userId = req.user._id;

    console.log("confirmPayment called with:", { purchaseId, courseId, userId });

    if (!purchaseId || !courseId) {
      console.log("Missing purchaseId or courseId");
      return res
        .status(400)
        .json({ success: false, message: "Purchase ID and Course ID required" });
    }

    const purchase = await Purchase.findById(purchaseId);
    console.log("Purchase found:", purchase);

    if (!purchase) {
      console.log("Purchase not found by ID");
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }

    if (purchase.userId.toString() !== userId.toString()) {
      console.log("User ID mismatch:", purchase.userId, userId);
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }

    if (purchase.courseId.toString() !== courseId.toString()) {
      console.log("Course ID mismatch:", purchase.courseId, courseId);
      return res
        .status(404)
        .json({ success: false, message: "Purchase not found" });
    }

    if (purchase.status === "completed") {
      return res.json({ success: false, message: "Payment already confirmed" });
    }

    // ✅ Mark payment as completed
    purchase.status = "completed";
    await purchase.save();

    // ✅ Add course to user's enrollments
    const [user, course] = await Promise.all([
      ManualUser.findById(userId),
      Course.findById(courseId),
    ]);

    if (user && course) {
      if (!user.enrolledCourses.includes(courseId)) {
        user.enrolledCourses.push(courseId);
        await user.save();
      }

      if (!course.enrolledStudents.includes(userId)) {
        course.enrolledStudents.push(userId);
        // Save without validating educator field (migration issue)
        await course.save({ validateBeforeSave: false });
      }
    }

    res.json({ success: true, message: "Payment confirmed and course enrolled" });
  } catch (error) {
    console.error("❌ confirmPayment Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
