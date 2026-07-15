import dotenv from "dotenv";
import app from "./server";

dotenv.config();

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`[Server] Running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err: any) => {
  console.error(`[Error] Unhandled Rejection: ${err.message || err}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
