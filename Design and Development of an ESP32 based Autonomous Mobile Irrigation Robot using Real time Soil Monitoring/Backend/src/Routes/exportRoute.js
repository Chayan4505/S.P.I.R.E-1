import express from "express";
import protect from "../Middleware/authMiddleware.js";
import { exportTelemetryCSV } from "../Controller/exportController.js";

const router = express.Router();

router.get("/csv/:robotId", protect, exportTelemetryCSV);

// router.get("/json/:robotId", protect, exportTelemetryJSON);

export default router;