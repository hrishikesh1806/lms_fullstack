import mongoose from "mongoose";

const courseProgressSchema = new mongoose.Schema(
  {
    // ✅ Reference ManualUser collection
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ManualUser",
      required: true,
    },

    // ✅ Reference Course collection
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    completed: { type: Boolean, default: false },

    // ✅ Keep track of completed lectures (array of lecture IDs or titles)
    lectureCompleted: [
      {
        lectureId: { type: String }, // or ObjectId if lectures have IDs
        lectureTitle: { type: String },
        completedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { minimize: false, timestamps: true }
);

export const CourseProgress = mongoose.model(
  "CourseProgress",
  courseProgressSchema
);
