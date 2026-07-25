import { useState } from 'react';
import { useCoupons, useCouponMutations } from '../api/useCoupons';
import { NotificationService } from '@/shared/utils/notification';
import { getErrorMessage } from '@/shared/utils/error-utils';
import { SearchBar } from '@/shared/components/ui/SearchBar';
import { Pagination } from '@/shared/components/ui/Pagination';
import { Loading } from '@/shared/components/feedback/Loading';
import CouponForm, { CouponFormData } from './CouponForm';
import CouponTable from './CouponTable';
import EditCouponModal from './EditCouponModal';
import { Coupon, CreateCouponPayload } from '@/types';

export function CouponManagementContainer() {
  const { data: coupons = [], isLoading, isFetching, error } = useCoupons();
  const { createCoupon, updateCoupon, deleteCoupon, toggleCouponStatus } = useCouponMutations();

  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState<{ open: boolean; coupon: Coupon | null }>({ open: false, coupon: null });

  const handleCreateCoupon = async (data: CouponFormData) => {
    try {
      const payload: CreateCouponPayload = {
        code: data.code.trim().toUpperCase(),
        discountType: data.discountType,
        discountValue: Number(data.discountValue),
        minOrderValue: data.minOrderValue ? Number(data.minOrderValue) : undefined,
        maxDiscountValue: data.maxDiscountValue ? Number(data.maxDiscountValue) : undefined,
        usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive,
      };
      await createCoupon(payload);
      NotificationService.success('Thêm mã giảm giá thành công');
    } catch (err: unknown) {
      NotificationService.error(getErrorMessage(err, 'Thêm mã giảm giá thất bại'));
      throw err;
    }
  };

  const handleUpdateCoupon = async (id: string, data: CouponFormData) => {
    try {
      const payload = {
        id,
        code: data.code.trim().toUpperCase(),
        discountType: data.discountType,
        discountValue: Number(data.discountValue),
        minOrderValue: data.minOrderValue ? Number(data.minOrderValue) : undefined,
        maxDiscountValue: data.maxDiscountValue ? Number(data.maxDiscountValue) : undefined,
        usageLimit: data.usageLimit ? Number(data.usageLimit) : undefined,
        startDate: data.startDate,
        endDate: data.endDate,
        isActive: data.isActive,
      };
      await updateCoupon(payload);
      NotificationService.success('Cập nhật mã giảm giá thành công');
    } catch (err: unknown) {
      NotificationService.error(getErrorMessage(err, 'Cập nhật mã giảm giá thất bại'));
      throw err;
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await toggleCouponStatus(id);
      NotificationService.success('Cập nhật trạng thái mã thành công');
    } catch (err: unknown) {
      NotificationService.error(getErrorMessage(err, 'Cập nhật thất bại'));
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa mã này?')) return;
    try {
      await deleteCoupon(id);
      NotificationService.success('Xóa mã giảm giá thành công');
    } catch (err: unknown) {
      NotificationService.error(getErrorMessage(err, 'Xóa thất bại'));
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE) || 1;
  const paginatedCoupons = filteredCoupons.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  if (isLoading && !coupons.length) return <Loading />;
  if (error) return <div className="p-6 text-red-500 font-medium">{getErrorMessage(error)}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative">
      {isFetching && (
        <div className="absolute top-2 right-4 text-xs font-semibold text-blue-600 animate-pulse bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Đang cập nhật dữ liệu...
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Quản Lý Mã Giảm Giá</h2>
          <p className="text-gray-500 text-sm">Cấu hình các chương trình khuyến mãi và chiến dịch giảm giá</p>
        </div>
        <div className="w-full md:w-72">
          <SearchBar onSearch={handleSearch} placeholder="Tìm kiếm theo mã..." />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CouponForm coupons={coupons} onSubmit={handleCreateCoupon} />
        </div>

        <div className="lg:col-span-2">
          <CouponTable
            coupons={paginatedCoupons}
            page={page}
            onToggle={handleToggle}
            onEdit={(c) => setModal({ open: true, coupon: c })}
            onDelete={handleDelete}
          />

          <div className="mt-6 flex justify-end">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>
      </div>

      <EditCouponModal
        open={modal.open}
        coupon={modal.coupon}
        coupons={coupons}
        onClose={() => setModal({ open: false, coupon: null })}
        onSubmit={handleUpdateCoupon}
      />
    </div>
  );
}

export default CouponManagementContainer;
