import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

const SalesChart = ({ data }) => {
    const chartData = data || [];
    return (
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Biểu Đồ Doanh Thu & Đơn Hàng</h2>
                    <p className="text-sm text-gray-500 font-medium mt-0.5">Thống kê theo thời gian</p>
                </div>
            </div>
            
            <div className="w-full h-[400px] min-w-[600px] overflow-x-auto" style={{ minHeight: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="_id"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return `${date.getDate()}/${date.getMonth() + 1}`;
                            }}
                        />
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dx={-10}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', padding: '12px' }}
                            labelStyle={{ color: '#374151', fontWeight: 'bold', marginBottom: '4px' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
                        <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="#10B981"
                            name="Doanh Thu ($)"
                            activeDot={{ r: 8, strokeWidth: 0 }}
                            strokeWidth={3}
                            dot={{ strokeWidth: 2, r: 4 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="count"
                            stroke="#3B82F6"
                            name="Đơn Hàng (SL)"
                            strokeWidth={3}
                            activeDot={{ r: 8, strokeWidth: 0 }}
                            dot={{ strokeWidth: 2, r: 4 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
                {chartData.length === 0 && (
                    <div className="flex justify-center items-center h-full -mt-[400px]">
                        <p className="text-gray-500 font-medium bg-white/80 px-4 py-2 rounded-xl backdrop-blur-sm">Chưa có dữ liệu doanh thu (Đơn hàng đã thanh toán).</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesChart;
