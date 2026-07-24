import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import Loading from "../components/Common/Loading";
import { PackageOpen } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { Order } from "../types";

const MyOrdersPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { orders, loading, error } = useAppSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderId: string): void => {
    navigate(`/order/${orderId}`);
  };

  if (loading) return <Loading />;
  if (error) return <p className="text-red-500 font-medium">Lỗi : {error}</p>;

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Lịch sử đơn hàng</h2>
      <div className="bg-white border border-gray-100 shadow-sm rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/80 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="py-4 px-6">Sản phẩm</th>
                <th className="py-4 px-6">Mã Đơn</th>
                <th className="py-4 px-6">Ngày Đặt</th>
                <th className="py-4 px-6">Giao Đến</th>
                <th className="py-4 px-6">Tổng Tiền</th>
                <th className="py-4 px-6">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders && orders.length > 0 ? (
                orders.map((order: Order) => (
                  <tr
                    key={order._id}
                    onClick={() => handleRowClick(order._id)}
                    className="hover:bg-gray-50/80 cursor-pointer transition-colors duration-200"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={order.orderItems[0]?.image}
                          alt={order.orderItems[0]?.name}
                          className="w-12 h-12 object-cover rounded-xl border border-gray-100 shadow-sm"
                        />
                        {order.orderItems.length > 1 && (
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            +{order.orderItems.length - 1} khác
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-6 font-medium text-gray-900">
                      #{order._id.substring(0, 8)}...
                    </td>

                    <td className="py-4 px-6 whitespace-nowrap">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                    </td>

                    <td className="py-4 px-6 max-w-[150px] truncate" title={order.shippingAddress?.address}>
                      {order.shippingAddress ? order.shippingAddress.address : "N/A"}
                    </td>

                    <td className="py-4 px-6 font-bold text-gray-900">
                      ${order.totalPrice.toLocaleString()}
                    </td>

                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          order.isPaid
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : "bg-amber-50 text-amber-600 border border-amber-200"
                        }`}
                      >
                        {order.isPaid ? "Đã thanh toán" : "Chờ xử lý"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <PackageOpen className="w-16 h-16 mb-4 stroke-1" />
                      <p className="text-lg font-medium text-gray-600 mb-1">Chưa có đơn hàng nào</p>
                      <p className="text-sm">Bạn chưa thực hiện giao dịch nào gần đây.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
