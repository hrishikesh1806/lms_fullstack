import mongoose from 'mongoose';

// Lecture Schema
const lectureSchema = new mongoose.Schema({
  lectureTitle: { type: String, required: true },
  lectureDuration: { type: Number, required: true }, // minutes
  lectureUrl: { type: String, required: true },
  isPreviewFree: { type: Boolean, default: false },
  lectureOrder: { type: Number, required: true }
}, { _id: true });

// Chapter Schema
const chapterSchema = new mongoose.Schema({
  chapterTitle: { type: String, required: true },
  chapterOrder: { type: Number, required: true },
  chapterContent: [lectureSchema]
}, { _id: true });

// Course Schema
const courseSchema = new mongoose.Schema({
  courseTitle: { type: String, required: true },
  courseDescription: { type: String, required: true },
  courseThumbnail: { type: String },
  coursePrice: { type: Number, required: true },
  discount: { type: Number, min: 0, max: 100, default: 0 },
  isPublished: { type: Boolean, default: true },
  courseContent: [chapterSchema],
  educator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ManualUser', // ✅ updated
    required: true
  },
  courseRatings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'ManualUser' }, // ✅ updated
      rating: { type: Number, min: 1, max: 5 }
    }
  ],
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ManualUser' // ✅ updated
    }
  ],
}, { timestamps: true, minimize: false });

const Course = mongoose.model('Course', courseSchema);

export default Course;
