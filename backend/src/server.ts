import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import { connectRedis } from "./config/redis";
import { errorHandler } from "./common/middlewares/error.middleware";
import { responseFormatter } from "./common/middlewares/response.middleware";
import rootRoutes from "./routes/root.routes";
import { NotFoundException } from "./common/exceptions/HttpException";

import { globalLimiter } from "./common/middlewares/rateLimit.middleware";

const app: Application = express();

// Trust proxy for correct rate limiting IP extraction
app.set("trust proxy", 1);

connectDB();
connectRedis();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(globalLimiter);
app.use(responseFormatter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/api", rootRoutes);

app.use((req, res, next) => {
  next(new NotFoundException(`Route ${req.originalUrl} not found`));
});

app.use(errorHandler);

export default app;

