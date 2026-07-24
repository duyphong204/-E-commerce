import React, { useEffect, useRef, useState } from "react";
import {
  fetchCoupons,
  createCoupon,
  deleteCoupon,
  toggleCouponStatus,
  updateCoupon,
} from "../../../redux/slices/couponAdminSlice";
import { NotificationService } from "../../../utils/notificationService";
import SearchBar from "../../Common/SearchBar";
import Pagination from "../../Common/Pagination";
import Loading from "../../Common/Loading";
import CouponForm, { CouponFormData } from "./CouponForm";
import CouponTable from "./CouponTable";
import EditCouponModal from "./EditCouponModal";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { Coupon, CreateCouponPayload } from "../../../types";

const CouponManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { coupons = [], loading, error } = useAppSelector((state) => state.coupon || {});

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [modal, setModal] = useState<{ open: boolean; coupon: Coupon | null }>({ open: false, coupon: null });

  useEffect(() => {
    dispatch(fetchCoupons());
  }, [dispatch]);

  const handleCreateCoupon = async (data: CouponFormData): Promise<void> => {
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
      await dispatch(createCoupon(payload)).unwrap();
      NotificationService.success("Thêm mã giảm giá thành công");
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      NotificationService.error(errObj?.message || "Thêm mã giảm giá thất bại");
      throw err;
    }
  };

  const handleUpdateCoupon = async (id: string, data: CouponFormData): Promise<void> => {
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
      await dispatch(updateCoupon(payload)).unwrap();
      NotificationService.success("Cập nhật mã giảm giá thành công");
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      NotificationService.error(errObj?.message || "Cập nhật mã giảm giá thất bại");
      throw err;
    }
  };

  const handleToggle = async (id: string): Promise<void> => {
    try {
      await dispatch(toggleCouponStatus(id)).unwrap();
      NotificationService.success("Cập nhật trạng thái mã thành công");
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      NotificationService.error(errObj?.message || "Cập nhật thất bại");
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Bạn chắc chắn muốn xóa mã này?")) return;
    try {
      await dispatch(deleteCoupon(id)).unwrap();
      NotificationService.success("Xóa mã giảm giá thành công");
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      NotificationService.error(errObj?.message || "Xóa thất bại");
    }
  };

  const handleSearch = (term: string): void => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearchTerm(term);
      setPage(1);
    }, 500);
  };

  const filteredCoupons = coupons.filter((c) =>
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredCoupons.length / ITEMS_PER_PAGE) || 1;
  const paginatedCoupons = filteredCoupons.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number): void => {
    setPage(newPage);
  };

  const handleEditRequest = (coupon: Coupon): void => {
    setModal({ open: true, coupon });
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-6 text-red-500 font-medium">Lỗi: {error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
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
            onEdit={handleEditRequest}
            onDelete={handleDelete}
          />

          <div className="mt-6 flex justify-end">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
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
};

export default CouponManagement;
