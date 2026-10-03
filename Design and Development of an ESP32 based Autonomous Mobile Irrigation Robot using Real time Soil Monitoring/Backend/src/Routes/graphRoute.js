import express from "express";
import protect from "../Middleware/authMiddleware.js";
import { getGraphData } from "../Controller/graphController.js";

const router = express.Router();

router.get("/:robotId", protect, getGraphData );

export default router;