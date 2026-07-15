import { DashboardRepository } from "./dashboard.repository";

export class DashboardService {
  private dashboardRepository: DashboardRepository;

  constructor() {
    this.dashboardRepository = new DashboardRepository();
  }

  async getDashboardStats(timeRange: string) {
    let dateGroupFormat = "%Y-%m-%d";
    const startDate = new Date();

    if (timeRange === "monthly") {
      startDate.setFullYear(startDate.getFullYear() - 1);
      dateGroupFormat = "%Y-%m";
    } else if (timeRange === "yearly") {
      startDate.setFullYear(startDate.getFullYear() - 5);
      dateGroupFormat = "%Y";
    } else {
      // Default daily (last 30 days)
      startDate.setDate(startDate.getDate() - 30);
      dateGroupFormat = "%Y-%m-%d";
    }

    const [
      totalRevenueResult,
      salesData,
      topSellingProducts,
      lowStockProducts,
      totalUsers,
      topWishlistProducts,
    ] = await Promise.all([
      this.dashboardRepository.getTotalRevenueAndOrders(),
      this.dashboardRepository.getSalesDataOverTime(startDate, dateGroupFormat),
      this.dashboardRepository.getTopSellingProducts(),
      this.dashboardRepository.getLowStockProducts(),
      this.dashboardRepository.getTotalUsers(),
      this.dashboardRepository.getTopWishlistProducts(),
    ]);

    return {
      totalRevenue: totalRevenueResult[0]?.total || 0,
      totalOrders: totalRevenueResult[0]?.count || 0,
      totalUsers,
      salesData,
      topSellingProducts,
      lowStockProducts,
      topWishlistProducts,
    };
  }
}
