import React from "react";
import { Banknote, ShoppingCart, Users, AlertTriangle } from "lucide-react";
import { DashboardStats as IDashboardStats } from "../../../types";

export interface DashboardStatsProps {
  stats?: Partial<IDashboardStats> | null;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const cards = [
    {
      title: "Tổng Doanh Thu",
      value: `$${(stats?.totalRevenue || 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <Banknote className="w-7 h-7" />,
      colorClass: "bg-emerald-50 text-emerald-600",
    },
    {
      title: "Tổng Đơn Hàng",
      value: stats?.totalOrders || 0,
      icon: <ShoppingCart className="w-7 h-7" />,
      colorClass: "bg-blue-50 text-blue-600",
    },
    {
      title: "Tổng Người Dùng",
      value: stats?.totalUsers || 0,
      icon: <Users className="w-7 h-7" />,
      colorClass: "bg-purple-50 text-purple-600",
    },
    {
      title: "Sản Phẩm Sắp Hết",
      value: stats?.lowStockProducts?.length || 0,
      icon: <AlertTriangle className="w-7 h-7" />,
      colorClass: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1 cursor-default"
        >
          <div className={`w-14 h-14 rounded-full flex items-center justify-center ${card.colorClass}`}>
            {card.icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">{card.title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;
