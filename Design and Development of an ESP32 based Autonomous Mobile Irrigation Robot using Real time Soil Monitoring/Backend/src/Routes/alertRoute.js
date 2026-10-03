import express from "express";
import protect from "../Middleware/authMiddleware.js";
import { getAlerts, deleteAllAlerts, markAllAlertsRead } from "../Controller/alertController.js";

const router = express.Router();

router.get("/", protect, getAlerts);

router.patch("/read-all", protect, markAllAlertsRead);

router.delete("/", protect, deleteAllAlerts);

export default router;