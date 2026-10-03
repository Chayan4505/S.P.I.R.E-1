import express from "express";
import protect from "../Middleware/authMiddleware.js";

import { getLatestTelemetry, getTelemetryHistory, getRobotPath } from "../Controller/telemetryController.js";

const router = express.Router();

router.get("/latest/:robotId", protect, getLatestTelemetry);

router.get("/history/:robotId", protect, getTelemetryHistory);

router.get("/path/:robotId", protect, getRobotPath);

export default router;