import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { FiDownload } from "react-icons/fi";
import axios from "../../../utils/axiosConfig";
import { exportOrderToPDF } from "../../../utils/pdfExport";
import Loading from "../../Common/Loading";

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
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Chi Tiết Đơn Hàng {order && `#${order._id.slice(-8)}`}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleExportPDF}
                            disabled={!order}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition"
                        >
                            <FiDownload /> Xuất PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition"
                        >
                            <AiOutlineClose className="text-xl" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {loading && (
                        <div className="flex justify-center py-12">
                            <Loading />
                        </div>
                    )}

                    {error && (
                        <div className="text-center py-12 text-red-500">{error}</div>
                    )}

                    {order && (
                        <div className="space-y-6">
                            {/* Thông tin đơn hàng */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    Thông Tin Đơn Hàng
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Order ID:</span>{" "}
                                        <span className="text-gray-600">#{order._id.slice(-8)}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Ngày đặt:</span>{" "}
                                        <span className="text-gray-600">
                                            {new Intl.DateTimeFormat("vi-VN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            }).format(new Date(order.createdAt))}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Trạng thái:</span>{" "}
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs text-white ${order.status === "Processing"
                                                ? "bg-yellow-500"
                                                : order.status === "Shipped"
                                                    ? "bg-blue-500"
                                                    : order.status === "Delivered"
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Thanh toán:</span>{" "}
                                        <span className="text-gray-600">{order.paymentMethod}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Thông tin khách hàng */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    👤 Thông Tin Khách Hàng
                                </h3>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium">Tên:</span>{" "}
                                        <span className="text-gray-600">
                                            {order.user?.name || "Khách"}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Email:</span>{" "}
                                        <span className="text-gray-600">
                                            {order.user?.email || "N/A"}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="font-medium">Địa chỉ:</span>{" "}
                                        <span className="text-gray-600">
                                            {order.shippingAddress.address},{" "}
                                            {order.shippingAddress.city},{" "}
                                            {order.shippingAddress.postalCode},{" "}
                                            {order.shippingAddress.country}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Sản phẩm */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    🛍️ Sản Phẩm
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border border-gray-200 rounded-lg">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                    STT
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                    Sản phẩm
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                    Size
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                    Màu
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                    SL
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                    Đơn giá
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                                                    Thành tiền
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {order.orderItems.map((item, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-sm">{index + 1}</td>
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-12 h-12 object-cover rounded"
                                                            />
                                                            <span className="text-sm font-medium">
                                                                {item.name}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        {item.size || "N/A"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">
                                                        {item.color || "N/A"}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-sm">
                                                        ${(item.price ?? 0).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-medium">
                                                        ${((item.price ?? 0) * (item.quantity ?? 0)).toFixed(2)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Tổng kết */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                    💰 Tổng Kết
                                </h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Tạm tính:</span>
                                        <span className="font-medium">
                                            ${(order.subtotal ?? 0).toFixed(2)}
                                        </span>
                                    </div>
                                    {(order.discountAmount ?? 0) > 0 && (
                                        <div className="flex justify-between text-red-500">
                                            <span>Giảm giá:</span>
                                            <span className="font-medium">
                                                -${(order.discountAmount ?? 0).toFixed(2)}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                                        <span>Tổng cộng:</span>
                                        <span className="text-blue-600">
                                            ${(order.totalPrice ?? 0).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
                    >
                        Đóng
                    </button>
                    <button
                        onClick={handleExportPDF}
                        disabled={!order}
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition flex items-center gap-2"
                    >
                        <FiDownload /> Xuất PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;
