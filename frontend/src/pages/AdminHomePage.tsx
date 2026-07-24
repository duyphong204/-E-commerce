import React, { useEffect, useState } from "react";
import axios from "../utils/axiosConfig";
import DashboardStats from "../components/Admin/Dashboard/DashboardStats";
import SalesChart from "../components/Admin/Dashboard/SalesChart";
import TopProducts from "../components/Admin/Dashboard/TopProducts";
import Loading from "../components/Common/Loading";
import { SalesChartData, TopSellingProduct, LowStockProduct, TopWishlistProduct } from "../types";

export interface AdminDashboardFullStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts?: number;
  totalUsers: number;
  salesData: SalesChartData[];
  topSellingProducts: TopSellingProduct[];
  lowStockProducts: LowStockProduct[];
  topWishlistProducts: TopWishlistProduct[];
}

export type TimeRange = "daily" | "monthly" | "yearly";

const AdminHomePage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardFullStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<TimeRange>("daily");

  useEffect(() => {
    const fetchStats = async (): Promise<void> => {
      setLoading(true);
      try {
        const response = await axios.get<AdminDashboardFullStats>(
          `${import.meta.env.VITE_API_URL}/api/admin/stats?timeRange=${timeRange}`
        );
        setStats(response.data);
      } catch (err: unknown) {
        console.error("Error fetching dashboard stats:", err);
        setError("Không thể tải dữ liệu bảng điều khiển.");
        setStats({
          totalRevenue: 0,
          totalOrders: 0,
          totalUsers: 0,
          salesData: [],
          topSellingProducts: [],
          lowStockProducts: [],
          topWishlistProducts: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeRange]);

  if (loading) return <Loading />;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 sm:p-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 whitespace-nowrap mb-1">Bảng Điều Khiển Admin</h1>
          <p className="text-gray-500 text-sm">Tổng quan về tình hình kinh doanh của cửa hàng</p>
        </div>

        {/* Modern Segmented Control */}
        <div className="flex p-1 bg-gray-200/60 rounded-xl">
          <button
            onClick={() => setTimeRange("daily")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              timeRange === "daily" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Hôm nay
          </button>
          <button
            onClick={() => setTimeRange("monthly")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              timeRange === "monthly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Tháng này
          </button>
          <button
            onClick={() => setTimeRange("yearly")}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              timeRange === "yearly" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Năm nay
          </button>
        </div>
      </div>

      {stats && (
        <>
          <DashboardStats stats={stats} />
          <SalesChart data={stats.salesData} />
          <TopProducts
            topSelling={stats.topSellingProducts}
            lowStock={stats.lowStockProducts}
            topWishlist={stats.topWishlistProducts}
          />
        </>
      )}
    </div>
  );
};

export default AdminHomePage;
