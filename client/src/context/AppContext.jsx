// client/src/context/AppContext.jsx
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import humanizeDuration from "humanize-duration";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  // =========================================================
  // 🌍 Backend Config
  // =========================================================
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();

  // =========================================================
  // 💾 Global States
  // =========================================================
  const [showLogin, setShowLogin] = useState(false);
  const [isEducator, setIsEducator] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allCourses, setAllCourses] = useState([]);
  const [userData, setUserData] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [token, setTokenState] = useState(localStorage.getItem("token") || "");

  // Custom setToken to update both state and localStorage
  const setToken = (newToken) => {
    localStorage.setItem("token", newToken);
    setTokenState(newToken);
  };

  // =========================================================
  // ⚙️ Axios Config (auto add token)
  // =========================================================
  useEffect(() => {
    axios.defaults.baseURL = backendUrl;
    axios.defaults.headers.common["Authorization"] = token
      ? `Bearer ${token}`
      : "";
  }, [token]);

  // =========================================================
  // 🧠 Helper: Get Token (Manual Auth)
  // =========================================================
  const getToken = async () => {
    // ✅ Only from localStorage now
    return localStorage.getItem("token");
  };

  // =========================================================
  // 📚 Fetch All Courses
  // =========================================================
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get("/api/course/all");
      if (data.success) setAllCourses(data.courses);
      else toast.error(data.message || "Failed to load courses");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching courses");
    }
  };

  // =========================================================
  // 👤 Fetch Logged-in User Data (Manual Users)
  // =========================================================
  const fetchUserData = async () => {
    if (!token) return;

    try {
      const { data } = await axios.get("/api/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success && data.user) {
        setUserData(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsAdmin(data.user.role === "admin");
        setIsEducator(data.user.role === "educator");
      } else {
        toast.error(data.message || "User not found");
      }
    } catch (error) {
      console.error("Fetch user data error:", error.message);
      toast.error("Failed to fetch user data");
    }
  };

  // =========================================================
  // 🎓 Fetch User Enrolled Courses (Manual Users)
  // =========================================================
  const fetchUserEnrolledCourses = async () => {
    if (!token) {
      setEnrolledCourses([]);
      return;
    }

    try {
      const { data } = await axios.get("/api/user/enrolled-courses", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setEnrolledCourses(data.enrolledCourses?.reverse() || []);
      } else {
        setEnrolledCourses([]);
        toast.error(data.message || "No enrolled courses found");
      }
    } catch (error) {
      setEnrolledCourses([]);
      toast.error(error.response?.data?.message || "Error fetching enrollments");
    }
  };

  // =========================================================
  // ⏱ Utility Functions
  // =========================================================
  const calculateChapterTime = (chapter) => chapter?.duration || 0;

  const calculateCourseDuration = (course) => {
    if (!course?.chapters) return "0 min";
    const total = course.chapters.reduce((sum, ch) => sum + (ch.duration || 0), 0);
    return humanizeDuration(total * 60000);
  };

  const calculateNoOfLectures = (course) => course?.chapters?.length || 0;

  const calculateRating = (course) => {
    if (!course?.ratings?.length) return 0;
    return (
      course.ratings.reduce((sum, r) => sum + r.value, 0) / course.ratings.length
    );
  };

  // =========================================================
  // 🚪 Logout
  // =========================================================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userId");
    setToken("");
    setUserData(null);
    setIsAdmin(false);
    setIsEducator(false);
    setEnrolledCourses([]);
    navigate("/login");
  };

  // =========================================================
  // 🔄 Auto Load Data
  // =========================================================
  useEffect(() => {
    fetchAllCourses();

    if (token) {
      fetchUserData();
      fetchUserEnrolledCourses();
    } else {
      setUserData(null);
      setIsAdmin(false);
      setIsEducator(false);
      setEnrolledCourses([]);
    }
  }, [token]);

  // =========================================================
  // 🌟 Context Value
  // =========================================================
  const value = {
    showLogin,
    setShowLogin,
    backendUrl,
    currency,
    navigate,
    token,
    setToken,
    userData,
    setUserData,
    allCourses,
    fetchAllCourses,
    enrolledCourses,
    fetchUserEnrolledCourses,
    calculateChapterTime,
    calculateCourseDuration,
    calculateRating,
    calculateNoOfLectures,
    isEducator,
    setIsEducator,
    isAdmin,
    setIsAdmin,
    logout,
    getToken, // ✅ added here for MyEnrollments and others
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
