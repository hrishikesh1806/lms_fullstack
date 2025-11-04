import { useEffect, useContext } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    backendUrl,
    fetchUserEnrolledCourses,
    getToken,
  } = useContext(AppContext);

  useEffect(() => {
    const confirmPurchase = async () => {
      const purchaseId = searchParams.get("purchaseId");
      const courseId = searchParams.get("courseId");

      if (!purchaseId || !courseId) {
        toast.error("Invalid payment URL");
        return navigate("/");
      }

      try {
        const token = getToken();
        if (!token) {
          toast.error("User not authenticated. Please login again.");
          return navigate("/login");
        }

        const { data } = await axios.post(
          `${backendUrl}/api/user/confirm-payment`,
          { purchaseId, courseId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success) {
          toast.success("🎉 Payment successful! Course enrolled.");
          await fetchUserEnrolledCourses();
          setTimeout(() => navigate("/my-enrollments"), 1500);
        } else {
          toast.error(data.message || "Payment confirmation failed");
          navigate("/");
        }
      } catch (err) {
        console.error("❌ Payment confirmation error:", err);
        toast.error("Payment confirmation failed.");
        navigate("/");
      }
    };

    confirmPurchase();
  }, [searchParams, navigate, backendUrl, fetchUserEnrolledCourses, getToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 animate-gradient">
      <div className="p-10 max-w-md mx-auto text-center shadow-2xl border border-green-100 rounded-3xl bg-white/70 backdrop-blur-md animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center animate-pulse">
          <svg
            className="w-12 h-12 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-700 mb-6">
          You have successfully enrolled in your course. Redirecting now...
        </p>
        <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 animate-loading-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
