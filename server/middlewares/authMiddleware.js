import jwt from "jsonwebtoken";
import ManualUser from "../models/Usermodel.js";

/* ==========================================================
   🔐 Protect Route Middleware (Manual Users Only)
   ========================================================== */
export const protectUser = async (req, res, next) => {
  try {
    let token;

    // Extract token from Authorization header: Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized, token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Correct field: id (matches token payload)
    const user = await ManualUser.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Attach user to request
    req.user = user;
    req.userRole = user.role;
    next();
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error.message);
    res
      .status(401)
      .json({ success: false, message: "Not authorized, invalid token" });
  }
};

/* ==========================================================
   🧑‍🏫 Educator Only Middleware
   ========================================================== */
export const protectEducator = (req, res, next) => {
  if (req.user && (req.user.role === "educator" || req.user.role === "admin")) {
    next();
  } else {
    res.status(403).json({ success: false, message: "Educator access only" });
  }
};

/* ==========================================================
   🛡️ Admin Only Middleware
   ========================================================== */
export const protectAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Admin access only" });
  }
};
