import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons, addCoupon, deleteCoupon, toggleCouponStatus, searchCoupon, updateCoupon, } from "../../../redux/slices/couponAdminSlice";
import { NotificationService } from "../../../utils/notificationService";
import { TicketPercent } from "lucide-react";
import SearchBar from "../../Common/SearchBar";
import Pagination from "../../Common/Pagination";
import Loading from "../../Common/Loading";
import CouponForm from "./CouponForm";
import CouponTable from "./CouponTable";
import EditCouponModal from "./EditCouponModal";

const CouponManagement = () => {
  const dispatch = useDispatch();
  const { coupons = [], loading, error, page = 1, totalPages = 1 } =
    useSelector((state) => state.coupon || {});

  const [searchTerm, setSearchTerm] = useState("");
  const searchTimer = useRef(null);
  const [modal, setModal] = useState({ open: false, coupon: null });

  useEffect(() => {
    dispatch(fetchCoupons({ page: 1 }));
  }, [dispatch]);

  const handleCreateCoupon = async (payload) => {
    try {
      await dispatch(addCoupon(payload)).unwrap();
      NotificationService.success("Thêm mã giảm giá thành công");
    } catch (err) {
      NotificationService.error(err?.message || "Thêm mã giảm giá thất bại");
      throw err;
    }
  };

  const handleUpdateCoupon = async (id, payload) => {
    try {
      await dispatch(updateCoupon({ id, couponData: payload })).unwrap();
      NotificationService.success("Cập nhật mã giảm giá thành công");
    } catch (err) {
      NotificationService.error(err?.message || "Cập nhật mã giảm giá thất bại");
      throw err;
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      await dispatch(
        toggleCouponStatus({ id, isActive: !currentStatus })
      ).unwrap();
      NotificationService.success("Cập nhật trạng thái mã thành công");
    } catch (err) {
      NotificationService.error(err?.message || "Cập nhật thất bại");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa mã này?")) return;
    try {
      await dispatch(deleteCoupon(id)).unwrap();
      NotificationService.success("Xóa mã giảm giá thành công");
    } catch (err) {
      NotificationService.error(err?.message || "Xóa thất bại");
    }
  };

  const handleSearch = (term) => {
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearchTerm(term);
      if (term.trim()) {
        dispatch(searchCoupon({ term: term.trim(), page: 1 }));
      } else {
        dispatch(fetchCoupons({ page: 1 }));
      }
    }, 500);
  };

  const handlePageChange = (newPage) => {
    if (searchTerm) {
      dispatch(searchCoupon({ term: searchTerm, page: newPage }));
    } else {
      dispatch(fetchCoupons({ page: newPage }));
    }
  };

  const handleEditRequest = (coupon) => {
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
                coupons={coupons}
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
