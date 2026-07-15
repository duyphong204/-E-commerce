import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { protect, admin } from "../../common/middlewares/auth.middleware";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import { getDashboardStatsSchema } from "./dashboard.schema";

const router = Router();
const dashboardController = new DashboardController();

// Admin stats endpoint (Protected)
router.get("/stats", protect as any, admin as any, validateRequest(getDashboardStatsSchema), dashboardController.getDashboardStats);

export default router;
