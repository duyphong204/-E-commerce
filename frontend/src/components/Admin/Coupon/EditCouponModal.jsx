import { useEffect, useState } from "react";

// Chuyển date sang format YYYY-MM-DD cho input
const formatDateForInput = (date) =>
    date ? new Date(date).toISOString().slice(0, 10) : "";

// Tạo state ban đầu cho form
const buildFormState = (coupon = {}) => ({
    code: coupon.code || "",
    discountType: coupon.discountType || "percent",
    discountValue: coupon.discountValue ?? "",
    maxDiscountValue:
        coupon.discountType === "percent" ? coupon.maxDiscountValue ?? "" : "",
    minOrderValue: coupon.minOrderValue ?? "",
    usageLimit: coupon.usageLimit ?? "",
    startDate: coupon.startDate ? formatDateForInput(coupon.startDate) : "",
    endDate: coupon.endDate ? formatDateForInput(coupon.endDate) : "",
    isActive: coupon.isActive ?? true,
});

// Kiểm tra mã coupon đã tồn tại chưa
const isDuplicateCode = (coupons, code, excludeId) => {
    if (!code) return false;
    const upper = code.trim().toUpperCase();
    return coupons.some(
        (c) => c.code?.toUpperCase() === upper && c._id !== excludeId
    );
};

const EditCouponModal = ({ open, coupon, coupons, onClose, onSubmit }) => {
    const [data, setData] = useState(buildFormState());
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open && coupon) {
            setData(buildFormState(coupon));
            setErrors({});
        }
    }, [open, coupon]);

    if (!open || !coupon) return null;

    // Xử lý thay đổi input
    const handleChange = ({ target: { name, value, type, checked } }) => {
        const nextValue = type === "checkbox" ? checked : value;
        setData((prev) => {
            const next = { ...prev, [name]: nextValue };
            if (name === "discountType" && nextValue !== "percent") {
                next.maxDiscountValue = "";
            }
            return next;
        });

        if (name === "code") {
            setErrors((prev) => ({
                ...prev,
                code: isDuplicateCode(coupons, nextValue, coupon._id)
                    ? "Mã đã tồn tại"
                    : "",
            }));
        }
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (errors.code) return;
        try {
            await onSubmit(coupon._id, data);
            onClose();
        } catch {
            // Error handled by parent
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    aria-label="Đóng"
                >
                    ✕
                </button>

                <h3 className="text-xl font-semibold mb-4">Chỉnh sửa mã giảm giá</h3>

                <form
                    onSubmit={handleSubmit}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mã giảm giá
                        </label>
                        <input
                            name="code"
                            value={data.code}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                        {errors.code && (
                            <p className="text-red-500 text-sm mt-1">{errors.code}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Loại giảm
                        </label>
                        <select
                            name="discountType"
                            value={data.discountType}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        >
                            <option value="percent">Phần trăm (%)</option>
                            <option value="fixed">Giảm cố định (VND)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giá trị giảm
                        </label>
                        <input
                            name="discountValue"
                            type="number"
                            min="1"
                            value={data.discountValue}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>

                    {data.discountType === "percent" && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giảm tối đa
                            </label>
                            <input
                                name="maxDiscountValue"
                                type="number"
                                min="0"
                                value={data.maxDiscountValue}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Đơn tối thiểu
                        </label>
                        <input
                            name="minOrderValue"
                            type="number"
                            min="0"
                            value={data.minOrderValue}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Giới hạn người dùng
                        </label>
                        <input
                            name="usageLimit"
                            type="number"
                            min="0"
                            step="1"
                            value={data.usageLimit}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Bỏ trống để không giới hạn.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày bắt đầu
                        </label>
                        <input
                            type="date"
                            name="startDate"
                            value={data.startDate}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Ngày kết thúc
                        </label>
                        <input
                            type="date"
                            name="endDate"
                            value={data.endDate}
                            onChange={handleChange}
                            className="border p-2 rounded w-full"
                            required
                        />
                    </div>

                    <label className="flex items-center gap-2 mt-2">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={data.isActive}
                            onChange={handleChange}
                        />
                        <span>Kích hoạt</span>
                    </label>

                    <div className="col-span-full flex justify-end gap-3 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCouponModal;
