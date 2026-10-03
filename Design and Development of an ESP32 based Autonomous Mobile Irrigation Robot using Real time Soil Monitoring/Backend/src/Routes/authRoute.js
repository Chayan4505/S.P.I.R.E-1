import express from "express";
import { register, verifyEmail, login, logout, getMe, resendOTP, changePassword, deleteProfile } from "../Controller/authController.js";
import protect from "../Middleware/authMiddleware.js";
import { registerLimiter, loginLimiter, otpLimiter, verifyOtpLimiter } from "../Middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/register", registerLimiter, register);

router.post("/verify-email", verifyOtpLimiter, verifyEmail);

router.post("/resend-otp", otpLimiter, resendOTP);

router.post("/login", loginLimiter, login);

router.get("/me", protect, getMe);

router.patch("/change-password", protect, changePassword);

router.delete("/delete-profile", protect, deleteProfile);

router.post("/logout", protect, logout);

export default router;