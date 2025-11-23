import { FaToggleOn, FaToggleOff } from "react-icons/fa";

// Chuyển date sang format YYYY-MM-DD
const formatDateForInput = (date) =>
    date ? new Date(date).toISOString().slice(0, 10) : "";

const CouponTable = ({ coupons, page, onToggle, onEdit, onDelete }) => (
    <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
                <tr>
                    <th className="py-3 px-4">STT</th>
                    <th className="py-3 px-4">Mã</th>
                    <th className="py-3 px-4">Loại</th>
                    <th className="py-3 px-4">Giá trị</th>
                    <th className="py-3 px-4">Tối đa</th>
                    <th className="py-3 px-4">Tối thiểu</th>
                    <th className="py-3 px-4">Người dùng</th>
                    <th className="py-3 px-4">Bắt đầu</th>
                    <th className="py-3 px-4">Kết thúc</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Hành động</th>
                </tr>
            </thead>
            <tbody>
                {coupons.length ? (
                    coupons.map((coupon, index) => (
                        <tr key={coupon._id} className="border-b hover:bg-gray-50">
                            <td className="p-4 font-medium text-gray-900">
                                {(page - 1) * 10 + (index + 1)}
                            </td>
                            <td className="p-4 font-medium text-gray-900">{coupon.code}</td>
                            <td className="p-4">{coupon.discountType === "percent" ? "%" : "VND"}</td>
                            <td className="p-4">
                                {Number(coupon.discountValue).toLocaleString("vi-VN")}
                            </td>
                            <td className="p-4">{coupon.maxDiscountValue || "-"}</td>
                            <td className="p-4">{coupon.minOrderValue || "-"}</td>
                            <td className="p-4">
                                {coupon.usedCount || 0}/{coupon.usageLimit || "∞"}
                            </td>
                            <td className="p-4">{formatDateForInput(coupon.startDate)}</td>
                            <td className="p-4">{formatDateForInput(coupon.endDate)}</td>
                            <td className="p-4">
                                <button
                                    onClick={() => onToggle(coupon._id, coupon.isActive)}
                                    className="flex items-center gap-1"
                                >
                                    {coupon.isActive ? (
                                        <FaToggleOn className="text-green-500 text-2xl" />
                                    ) : (
                                        <FaToggleOff className="text-red-500 text-2xl" />
                                    )}
                                    {coupon.isActive ? "Hoạt động" : "Dừng"}
                                </button>
                            </td>
                            <td className="p-4">
                                <button
                                    onClick={() => onEdit(coupon)}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2"
                                >
                                    Sửa
                                </button>
                                <button
                                    onClick={() => onDelete(coupon._id)}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Xóa
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={11} className="text-center p-4 text-gray-500">
                            Không có mã giảm giá nào
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
);

export default CouponTable;
