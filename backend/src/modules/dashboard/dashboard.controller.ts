import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";
import { catchAsync } from "../../common/utils/catchAsync";

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const timeRange = (req.query.timeRange as string) || "daily";
    const stats = await this.dashboardService.getDashboardStats(timeRange);
    return res.status(200).json(stats);
  });
}
