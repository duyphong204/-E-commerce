import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCoupons, addCoupon, deleteCoupon, toggleCouponStatus, searchCoupon, updateCoupon, } from "../../../redux/slices/couponAdminSlice";
import { NotificationService } from "../../../utils/notificationService";
import SearchBar from "../../Common/SearchBar";
import Pagination from "../../Common/Pagination";
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

  if (loading) return <p className="text-center">Đang tải...</p>;
  if (error) return <p className="text-red-500 text-center">Lỗi: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col mb-6">
        <h2 className="text-2xl font-bold mb-6">Quản Lý Mã Giảm Giá</h2>
        <SearchBar onSearch={handleSearch} placeholder="Tìm mã giảm giá..." />
      </div>

      <CouponForm coupons={coupons} onSubmit={handleCreateCoupon} />

      <CouponTable
        coupons={coupons}
        page={page}
        onToggle={handleToggle}
        onEdit={handleEditRequest}
        onDelete={handleDelete}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

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
