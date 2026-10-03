import express from "express";
import { testWeather } from "../Controller/weatherController.js";

const router = express.Router();

router.get("/test", testWeather);

export default router;