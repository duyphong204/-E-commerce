import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import { errorHandler } from "./common/middlewares/error.middleware";
import rootRoutes from "./routes/root.routes";
import { NotFoundException } from "./common/exceptions/HttpException";

const app: Application = express();

// Connect DB if running server
connectDB();

// Middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", rootRoutes);

// 404 Handler
app.use((req, res, next) => {
  next(new NotFoundException(`Route ${req.originalUrl} not found`));
});

// Global Error Handler MUST be the last middleware
app.use(errorHandler);

export default app;

