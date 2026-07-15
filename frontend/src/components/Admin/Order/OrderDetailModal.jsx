import { useEffect, useState } from "react";
import axios from "../../../utils/axiosConfig";
import { exportOrderToPDF } from "../../../utils/pdfExport";
import Loading from "../../Common/Loading";
import { XCircle, Download, FileText, User, ShoppingBag, CreditCard, Calendar, Hash, MapPin } from "lucide-react";

const OrderDetailModal = ({ isOpen, onClose, orderId }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch order detail khi modal mở
    useEffect(() => {
        if (isOpen && orderId) {
            fetchOrderDetail();
        }
    }, [isOpen, orderId]);

    const fetchOrderDetail = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/orders/${orderId}`
            );
            setOrder(data);
        } catch (err) {
            setError(err.response?.data?.message || "Không thể tải chi tiết đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    // Handle ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            window.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    const handleExportPDF = () => {
        if (order) {
            exportOrderToPDF(order);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-3xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto scale-in-center flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 sm:px-8 py-5 flex justify-between items-center rounded-t-3xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FileText className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Chi Tiết Đơn Hàng</h2>
                            {order && <p className="text-sm text-gray-500 font-medium mt-0.5">#{order._id.slice(-8).toUpperCase()}</p>}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                            onClick={handleExportPDF}
                            disabled={!order || loading}
                            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all active:scale-95"
                        >
                            <Download className="w-4 h-4" /> <span className="hidden sm:inline">Xuất PDF</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 bg-gray-50 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <XCircle className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
                    {loading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <Loading />
                            <p className="mt-4 text-gray-500 font-medium">Đang tải dữ liệu...</p>
                        </div>
                    )}

                    {error && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4">
                                <XCircle className="w-8 h-8" />
                            </div>
                            <p className="text-lg font-bold text-gray-900 mb-1">Lỗi tải dữ liệu</p>
                            <p className="text-gray-500 text-center">{error}</p>
                        </div>
                    )}

                    {order && !loading && !error && (
                        <div className="space-y-6 sm:space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                                {/* Thông tin chung */}
                                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-gray-400" /> Thông Tin Đơn Hàng
                                    </h3>
                                    <div className="space-y-4 text-sm">
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span className="text-gray-500 flex items-center gap-2">
                                                <Calendar className="w-4 h-4" /> Ngày đặt
                                            </span>
                                            <span className="font-medium text-gray-900">
                                                {new Intl.DateTimeFormat("vi-VN", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                }).format(new Date(order.createdAt))}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span className="text-gray-500">Trạng thái</span>
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                                                ${order.status === "Processing" ? "bg-amber-50 text-amber-700 border border-amber-200" 
                                                : order.status === "Shipped" ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                : order.status === "Delivered" ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : "bg-red-50 text-red-700 border border-red-200"}`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-500 flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" /> Thanh toán
                                            </span>
                                            <span className="font-medium text-gray-900">{order.paymentMethod}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Thông tin khách hàng */}
                                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                                    <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <User className="w-4 h-4 text-gray-400" /> Khách Hàng
                                    </h3>
                                    <div className="space-y-4 text-sm">
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span className="text-gray-500">Người nhận</span>
                                            <span className="font-medium text-gray-900">{order.user?.name || "Khách"}</span>
                                        </div>
                                        <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                                            <span className="text-gray-500">Email</span>
                                            <span className="font-medium text-gray-900 truncate max-w-[200px]" title={order.user?.email}>{order.user?.email || "N/A"}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500 flex items-center gap-2 mb-1.5">
                                                <MapPin className="w-4 h-4" /> Địa chỉ giao hàng
                                            </span>
                                            <p className="font-medium text-gray-900 leading-relaxed">
                                                {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Sản phẩm */}
                            <div>
                                <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-purple-500" /> Sản Phẩm Đã Đặt
                                </h3>
                                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full text-left text-sm">
                                            <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-100">
                                                <tr>
                                                    <th className="py-3 px-4 uppercase text-xs">Sản phẩm</th>
                                                    <th className="py-3 px-4 uppercase text-xs">Size</th>
                                                    <th className="py-3 px-4 uppercase text-xs">Màu</th>
                                                    <th className="py-3 px-4 uppercase text-xs text-center">SL</th>
                                                    <th className="py-3 px-4 uppercase text-xs text-right">Đơn giá</th>
                                                    <th className="py-3 px-4 uppercase text-xs text-right">Tổng</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                                {order.orderItems.map((item, index) => (
                                                    <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="py-3 px-4">
                                                            <div className="flex items-center gap-3">
                                                                <img
                                                                    src={item.image}
                                                                    alt={item.name}
                                                                    className="w-12 h-12 object-cover rounded-xl border border-gray-100 shadow-sm"
                                                                />
                                                                <span className="font-medium text-gray-900 truncate max-w-[150px] sm:max-w-[250px]" title={item.name}>
                                                                    {item.name}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="py-3 px-4 font-medium">{item.size || "-"}</td>
                                                        <td className="py-3 px-4 font-medium">{item.color || "-"}</td>
                                                        <td className="py-3 px-4 text-center font-bold text-gray-900">{item.quantity}</td>
                                                        <td className="py-3 px-4 text-right">${(item.price ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                                        <td className="py-3 px-4 text-right font-bold text-gray-900">
                                                            ${((item.price ?? 0) * (item.quantity ?? 0)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Tổng kết */}
                            <div className="flex justify-end">
                                <div className="w-full sm:w-80 bg-gray-50/80 p-6 rounded-2xl border border-gray-100 space-y-3">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-500">Tạm tính:</span>
                                        <span className="font-medium text-gray-900">
                                            ${(order.subtotal ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    {(order.discountAmount ?? 0) > 0 && (
                                        <div className="flex justify-between items-center text-sm text-red-500">
                                            <span>Giảm giá:</span>
                                            <span className="font-medium">
                                                -${(order.discountAmount ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>
                                    )}
                                    <div className="pt-3 mt-3 border-t border-gray-200 flex justify-between items-center">
                                        <span className="font-bold text-gray-900 text-base">Tổng cộng:</span>
                                        <span className="text-2xl font-bold text-blue-600">
                                            ${(order.totalPrice ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer mobile - show only on small screens */}
                <div className="sm:hidden border-t border-gray-100 p-4 bg-gray-50 rounded-b-3xl flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleExportPDF}
                        disabled={!order || loading}
                        className="flex-1 px-4 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 disabled:bg-gray-300 transition-colors flex items-center justify-center gap-2"
                    >
                        <Download className="w-4 h-4" /> PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;
