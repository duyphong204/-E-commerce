import { useState } from 'react';
import { useAdminStats } from '../api/useAdminStats';
import { TimeRange } from '../types/admin-dashboard.types';
import DashboardStats from './DashboardStats';
import SalesChart from './SalesChart';
import TopProducts from './TopProducts';
import { Loading } from '@/shared/components/feedback/Loading';
import { getErrorMessage } from '@/shared/utils/error-utils';

export function AdminDashboardContainer() {
  const [timeRange, setTimeRange] = useState<TimeRange>('daily');
  const { data: stats, isLoading, isFetching, error } = useAdminStats(timeRange);

  if (isLoading && !stats) return <Loading />;
  if (error) return <div className="p-6 text-red-500 font-medium">{getErrorMessage(error)}</div>;

  return (
    <div className="p-6 sm:p-8 bg-gray-50/50 min-h-screen relative">
      {isFetching && (
        <div className="absolute top-4 right-8 text-xs font-semibold text-blue-600 animate-pulse bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Đang cập nhật dữ liệu...
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 whitespace-nowrap mb-1">Bảng Điều Khiển Admin</h1>
          <p className="text-gray-500 text-sm">Tổng quan về tình hình kinh doanh của cửa hàng</p>
        </div>

        {/* Modern Segmented Control */}
        <div className="flex p-1 bg-gray-200/60 rounded-xl">
          <button
            onClick={() => setTimeRange('daily')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              timeRange === 'daily' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Hôm nay
          </button>
          <button
            onClick={() => setTimeRange('monthly')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              timeRange === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Tháng này
          </button>
          <button
            onClick={() => setTimeRange('yearly')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
              timeRange === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
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
}
