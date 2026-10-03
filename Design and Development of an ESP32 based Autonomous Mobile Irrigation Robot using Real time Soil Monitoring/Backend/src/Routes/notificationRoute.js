import express from "express";
import protect from "../Middleware/authMiddleware.js";
import { getNotifications, deleteAllNotifications, markAllNotificationsRead } from "../Controller/notificationController.js";

const router = express.Router();

router.get("/", protect, getNotifications);

router.patch("/read-all", protect, markAllNotificationsRead);

router.delete("/", protect, deleteAllNotifications);

export default router;