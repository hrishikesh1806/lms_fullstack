import axios from "axios";
import { toast } from "react-toastify";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const enrollCourse = async (courseId) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please log in to enroll in a course");
      return;
    }

    // ✅ Use manual JWT token
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const res = await axios.post(
      `${BACKEND_URL}/api/course/enroll`,
      { courseId },
      { headers }
    );

    if (res.data.success) {
      toast.success("🎉 Enrolled successfully!");
      return true;
    } else {
      toast.error(res.data.message || "Enrollment failed");
      return false;
    }
  } catch (err) {
    console.error("Enroll error:", err);
    toast.error(err.response?.data?.message || "Error enrolling in course");
    return false;
  }
};
