// client/src/pages/student/Login.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });

  // ✅ Pre-fill from register (if recently registered)
  useEffect(() => {
    const lastRegistered = JSON.parse(localStorage.getItem("lastRegistered") || "{}");
    if (lastRegistered.email && lastRegistered.password) {
      setFormData({
        email: lastRegistered.email,
        password: lastRegistered.password,
        role: lastRegistered.role || "user",
      });
      localStorage.removeItem("lastRegistered");
    }
  }, []);

  // ✅ Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (data.success && data.token) {
        toast.success(data.message || "Login successful!");

        // ✅ Save to localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.user.role);
        localStorage.setItem("userId", data.user._id);
        localStorage.setItem("user", JSON.stringify(data.user));

        // ✅ Redirect based on role
        if (data.user.role === "educator" || data.user.role === "admin") {
          navigate("/educator");
        } else {
          navigate("/my-enrollments");
        }
      } else {
        toast.error(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  // ✅ UI
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="user">User</option>
            <option value="educator">Educator</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
