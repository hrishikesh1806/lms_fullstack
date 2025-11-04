import express from "express";
import { protectUser, protectAdmin } from "../middlewares/authMiddleware.js";
import { getAdminDashboard } from "../controllers/adminController.js";

const adminRouter = express.Router();

/* ==========================================================
   🛡️ Admin Routes
   ========================================================== */

// ✅ Protect route → Must be a logged-in manual user
// ✅ Additional check → Must have role: 'admin'
adminRouter.get("/dashboard", protectUser, protectAdmin, getAdminDashboard);

export default adminRouter;
