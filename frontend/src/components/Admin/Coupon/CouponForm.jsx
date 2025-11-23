import { useState } from "react";

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

const CouponForm = ({ coupons, onSubmit }) => {
    const [data, setData] = useState(buildFormState());
    const [errors, setErrors] = useState({});

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
                code: isDuplicateCode(coupons, nextValue) ? "Mã đã tồn tại" : "",
            }));
        }
    };

    // Xử lý submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (errors.code) return;
        try {
            await onSubmit(data);
            setData(buildFormState());
            setErrors({});
        } catch {
        }
    };

    return (
        <div className="p-6 rounded-lg mb-6 shadow-lg bg-white">
            <h3 className="text-lg font-bold mb-4">Thêm Mã Giảm Giá</h3>
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
                <div className="col-span-full">
                    <input
                        name="code"
                        placeholder="Mã giảm giá"
                        value={data.code}
                        onChange={handleChange}
                        className="border p-2 rounded w-full"
                        required
                    />
                    {errors.code && (
                        <p className="text-red-500 text-sm mt-1">{errors.code}</p>
                    )}
                </div>

                <select
                    name="discountType"
                    value={data.discountType}
                    onChange={handleChange}
                    className="border p-2 rounded"
                >
                    <option value="percent">Phần trăm (%)</option>
                    <option value="fixed">Giảm cố định (VND)</option>
                </select>

                <input
                    name="discountValue"
                    placeholder="Giá trị giảm"
                    value={data.discountValue}
                    onChange={handleChange}
                    type="number"
                    min="1"
                    className="border p-2 rounded"
                    required
                />

                {data.discountType === "percent" && (
                    <input
                        name="maxDiscountValue"
                        placeholder="Giảm tối đa (nếu %)"
                        value={data.maxDiscountValue}
                        onChange={handleChange}
                        type="number"
                        min="0"
                        className="border p-2 rounded"
                    />
                )}

                <input
                    name="minOrderValue"
                    placeholder="Đơn tối thiểu"
                    value={data.minOrderValue}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    className="border p-2 rounded"
                />

                <input
                    name="usageLimit"
                    placeholder="Số lượng người dùng"
                    value={data.usageLimit}
                    onChange={handleChange}
                    type="number"
                    min="0"
                    step="1"
                    className="border p-2 rounded"
                />

                <input
                    type="date"
                    name="startDate"
                    value={data.startDate}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <input
                    type="date"
                    name="endDate"
                    value={data.endDate}
                    onChange={handleChange}
                    className="border p-2 rounded"
                    required
                />

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={data.isActive}
                        onChange={handleChange}
                    />
                    <span>Kích hoạt ngay</span>
                </label>

                <button
                    type="submit"
                    disabled={!!errors.code}
                    className={`bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 col-span-full ${errors.code ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                >
                    Thêm Mã
                </button>
            </form>
        </div>
    );
};

export default CouponForm;
