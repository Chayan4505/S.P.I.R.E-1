import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import errorHandler from "./src/Middleware/errorMiddleware.js";
import authRoutes from "./src/Routes/authRoute.js";
import robotRoutes from "./src/Routes/robotRoute.js";
import telemetryRoutes from "./src/Routes/telemetryRoute.js";
import alertRoutes from "./src/Routes/alertRoute.js";
import notificationRoutes from "./src/Routes/notificationRoute.js";
import exportRoutes from "./src/Routes/exportRoute.js";
import graphRoutes from "./src/Routes/graphRoute.js";
import weatherRoutes from "./src/Routes/weatherRoutes.js";

const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      (origin && origin.endsWith(".vercel.app"))
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
  ],
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static("Uploads"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Smart Irrigation Bot Running"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    server: "Running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/robot", robotRoutes);
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/graphs", graphRoutes);
app.use("/api/weather", weatherRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found"
  });
});

app.use(errorHandler);

export default app;