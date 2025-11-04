// server/controllers/authController.js
import ManualUser from "../models/Usermodel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ============================
// REGISTER USER
// ============================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existing = await ManualUser.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await ManualUser.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    return res.status(201).json({ success: true, message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ success: false, message: "Server error during registration" });
  }
};

// ============================
// LOGIN USER
// ============================
export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await ManualUser.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Server error during login" });
  }
};
