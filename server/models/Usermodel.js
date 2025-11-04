import mongoose from "mongoose";

const manualUserSchema = new mongoose.Schema(
  {
    // 👤 Basic Info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },

    // 🧠 Role Management
    role: {
      type: String,
      enum: ["user", "educator", "admin"],
      default: "user",
    },

    // 🎓 Enrolled Courses
    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course", // ✅ Course model reference
      },
    ],

    // 🕓 Last Login or Activity Tracking (optional but useful)
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // ✅ automatically adds createdAt & updatedAt
  }
);

// ✅ Prevent model overwrite errors during development (important for hot reload)
const ManualUser =
  mongoose.models.ManualUser || mongoose.model("ManualUser", manualUserSchema);

export default ManualUser;
