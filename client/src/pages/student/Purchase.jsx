import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { loadStripe } from "@stripe/stripe-js";
import { assets } from "../../assets/assets";

const Purchase = () => {
  const { courseId } = useParams();
  const { userData, backendUrl } = useContext(AppContext); // ✅ use backendUrl (manual user system)
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/course/${courseId}`);
        if (data.success) {
          setCourse(data.courseData);
        } else {
          toast.error("Failed to fetch course details");
        }
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong while loading course");
      }
    };
    fetchCourse();
  }, [courseId, backendUrl]);

  // ✅ Handle Stripe Checkout for manual user
  const handlePurchase = async () => {
    try {
      if (!userData?._id) {
        toast.info("Please log in to purchase this course");
        return navigate("/login");
      }

      setLoading(true);

      const token = localStorage.getItem("token"); // ✅ token from manual login
      if (!token) {
        setLoading(false);
        toast.error("User authentication failed");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId },
        { headers }
      );

      if (data.success && data.session_url) {
        const stripe = await loadStripe(
          "pk_test_51Qg1uGSJkMZ7YAKbTbXZPlZ7eC5zR6u4P5kAXk5nZ2VbcRy6BvN9oP7d3eVh6CWWrPbRVU5DYsaKr1q8GmZQeKak00nPccRyq3" // ✅ replace with your actual Stripe public key
        );
        window.location.href = data.session_url;
      } else {
        toast.error(data.message || "Unable to start payment");
      }
    } catch (error) {
      console.error("Purchase error:", error);
      console.error("Purchase: Full error details:", error.response?.data || error.message);
      toast.error("Something went wrong while purchasing");
    } finally {
      setLoading(false);
    }
  };

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <p className="text-gray-400 text-lg">Loading course details...</p>
      </div>
    );
  }

  const discountedPrice =
    course.coursePrice - (course.coursePrice * course.discount) / 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white px-6">
      <div className="bg-slate-950 shadow-2xl rounded-2xl p-8 max-w-md w-full text-center border border-slate-700">
        <img
          src={course.courseThumbnail || assets.placeholderCourse}
          alt="Course Thumbnail"
          className="w-full h-56 object-cover rounded-xl mb-6"
        />
        <h2 className="text-2xl font-semibold mb-2">{course.courseTitle}</h2>
        <p className="text-gray-400 mb-4">{course.courseCategory}</p>

        <div className="flex justify-center items-baseline gap-3 mb-6">
          {course.discount > 0 ? (
            <>
              <span className="text-3xl font-bold text-green-400">
                ${discountedPrice.toFixed(2)}
              </span>
              <span className="text-gray-400 line-through">
                ${course.coursePrice}
              </span>
              <span className="text-sm text-green-400">
                ({course.discount}% off)
              </span>
            </>
          ) : (
            <span className="text-3xl font-bold text-green-400">
              ${course.coursePrice}
            </span>
          )}
        </div>

        <button
          onClick={handlePurchase}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-500 transition-all text-white px-6 py-3 rounded-xl font-semibold w-full"
        >
          {loading ? "Processing..." : "Buy Now"}
        </button>

        <p
          onClick={() => navigate(-1)}
          className="mt-5 text-sm text-gray-400 hover:text-gray-200 cursor-pointer"
        >
          ← Back to Courses
        </p>
      </div>
    </div>
  );
};

export default Purchase;
