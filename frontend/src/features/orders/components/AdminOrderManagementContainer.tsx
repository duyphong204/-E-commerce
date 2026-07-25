import { useState } from 'react';
import { useAdminOrders, useOrderMutations } from '../api/useOrders';
import { OrderStatus } from '../types/order.types';
import { NotificationService } from '@/shared/utils/notification';
import { getErrorMessage } from '@/shared/utils/error-utils';
import { ClipboardList, Banknote, Clock, PackageOpen, Eye, CheckCircle } from 'lucide-react';
import { SearchBar } from '@/shared/components/ui/SearchBar';
import { Pagination } from '@/shared/components/ui/Pagination';
import { Loading } from '@/shared/components/feedback/Loading';
import OrderDetailModal from './OrderDetailModal';

export function AdminOrderManagementContainer() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState<{ isOpen: boolean; orderId: string | null }>({
    isOpen: false,
    orderId: null,
  });

  const { data, isLoading, isFetching, error } = useAdminOrders({ page, term: searchTerm, limit: 10 });
  const { updateOrderStatus } = useOrderMutations();

  const handleSearch = (term: string) => {
    setSearchTerm(term.trim());
    setPage(1);
  };

  const handleStatusChange = async (orderId: string, status: OrderStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status });
      NotificationService.success(`Cập nhật trạng thái đơn #${orderId.slice(-8)} thành công`);
    } catch (err: unknown) {
      NotificationService.error(getErrorMessage(err, 'Lỗi cập nhật đơn hàng'));
    }
  };

  if (isLoading && !data) return <Loading />;
  if (error) return <div className="p-6 text-red-500 font-medium">{getErrorMessage(error)}</div>;

  const orders = data?.results || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;
  const totalSales = data?.totalSales || 0;
  const processingCount = data?.processingCount || 0;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative">
      {isFetching && (
        <div className="absolute top-2 right-4 text-xs font-semibold text-blue-600 animate-pulse bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Đang cập nhật dữ liệu...
        </div>
      )}

      {/* Header + search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Quản Lý Đơn Hàng</h2>
          <p className="text-gray-500 text-sm">Theo dõi và cập nhật trạng thái đơn hàng</p>
        </div>
        <div className="w-full md:w-80">
          <SearchBar onSearch={handleSearch} placeholder="Tìm ID, tên, email, SĐT..." />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <ClipboardList className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Tổng Đơn Hàng</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalItems}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Banknote className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Tổng Doanh Thu</p>
            <h3 className="text-2xl font-bold text-gray-900">
              $
              {(totalSales ?? 0).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Đơn Đang Xử Lý</p>
            <h3 className="text-2xl font-bold text-gray-900">{processingCount}</h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-100 whitespace-nowrap">
              <tr>
                <th className="py-4 px-6 uppercase text-xs">Mã đơn</th>
                <th className="py-4 px-6 uppercase text-xs">Khách hàng</th>
                <th className="py-4 px-6 uppercase text-xs">Ngày đặt</th>
                <th className="py-4 px-6 uppercase text-xs">Tổng tiền</th>
                <th className="py-4 px-6 uppercase text-xs">Trạng thái</th>
                <th className="py-4 px-6 uppercase text-xs text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-gray-900 whitespace-nowrap">
                      #{order._id.slice(-8)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {order.user ? order.user.name : 'Khách'}
                        </span>
                        <span className="text-gray-500 text-xs truncate max-w-[150px]">
                          {order.shippingAddress.address}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      {new Intl.DateTimeFormat('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      }).format(new Date(order.createdAt))}
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900 whitespace-nowrap">
                      $
                      {(order.totalPrice ?? 0).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value as OrderStatus)
                          }
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border outline-none cursor-pointer transition-colors appearance-none ${
                            order.status === 'Processing'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : order.status === 'Shipped'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : order.status === 'Delivered'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-red-50 text-red-700 border-red-200'
                          }`}
                        >
                          <option value="Processing">Đang xử lý</option>
                          <option value="Shipped">Đang giao</option>
                          <option value="Delivered">Đã giao</option>
                          <option value="Cancelled">Đã hủy</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          disabled={order.status === 'Delivered'}
                          onClick={() => handleStatusChange(order._id, 'Delivered')}
                          className={`inline-flex items-center justify-center p-2 rounded-xl transition-colors ${
                            order.status === 'Delivered'
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title="Đánh dấu đã giao"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setModalState({ isOpen: true, orderId: order._id })}
                          className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <PackageOpen className="w-12 h-12 mb-3 opacity-50 stroke-1" />
                      <p className="text-base font-medium text-gray-600">Không tìm thấy đơn hàng</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
      </div>

      <OrderDetailModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, orderId: null })}
        orderId={modalState.orderId}
      />
    </div>
  );
}

export default AdminOrderManagementContainer;
