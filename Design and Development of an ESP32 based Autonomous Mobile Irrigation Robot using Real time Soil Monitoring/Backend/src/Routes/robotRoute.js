import express from "express";
import { pairRobot, getPendingRobots, getMyRobots,deleteRobot} from "../Controller/robotController.js";
import protect from "../Middleware/authMiddleware.js";

const router = express.Router();

router.get("/pending", protect, getPendingRobots);

router.post("/pair", protect, pairRobot);

router.get("/", protect, getMyRobots);

router.delete("/:robotId", protect, deleteRobot);

export default router;