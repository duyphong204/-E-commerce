import React, { useState, ChangeEvent, FormEvent } from "react";
import { Plus, Percent, DollarSign, Calendar, Hash, Target, Save } from "lucide-react";
import { Coupon, DiscountType } from "../../../types";

const formatDateForInput = (date?: string | Date): string =>
  date ? new Date(date).toISOString().slice(0, 10) : "";

export interface CouponFormData {
  code: string;
  discountType: DiscountType;
  discountValue: number | string;
  maxDiscountValue: number | string;
  minOrderValue: number | string;
  usageLimit: number | string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const buildFormState = (coupon: Partial<Coupon> = {}): CouponFormData => ({
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

const isDuplicateCode = (coupons: Coupon[], code: string, excludeId?: string): boolean => {
  if (!code) return false;
  const upper = code.trim().toUpperCase();
  return coupons.some(
    (c) => c.code?.toUpperCase() === upper && c._id !== excludeId
  );
};

export interface CouponFormProps {
  coupons: Coupon[];
  onSubmit: (data: CouponFormData) => Promise<void>;
}

const CouponForm: React.FC<CouponFormProps> = ({ coupons, onSubmit }) => {
  const [data, setData] = useState<CouponFormData>(buildFormState());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    const type = target.type;
    const checked = (target as HTMLInputElement).checked;

    const nextValue = type === "checkbox" ? checked : value;

    setData((prev) => {
      const next = { ...prev, [name]: nextValue };
      if (name === "discountType" && nextValue !== "percent") {
        next.maxDiscountValue = "";
      }
      return next;
    });

    if (name === "code") {
      const codeStr = String(nextValue);
      setErrors((prev) => ({
        ...prev,
        code: isDuplicateCode(coupons, codeStr) ? "Mã đã tồn tại" : "",
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (errors.code) return;
    try {
      await onSubmit(data);
      setData(buildFormState());
      setErrors({});
    } catch {
      // Handled by parent
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
          <Plus className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Thêm Mã Giảm Giá</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Code */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
            <Hash className="w-4 h-4 text-gray-400" /> Mã giảm giá *
          </label>
          <input
            name="code"
            placeholder="VD: SUMMER2025"
            value={data.code}
            onChange={handleChange}
            className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all uppercase ${
              errors.code ? "border-red-400 ring-1 ring-red-400" : "border-gray-200"
            }`}
            required
          />
          {errors.code && (
            <p className="text-red-500 text-xs font-medium mt-1.5 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500"></span> {errors.code}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Discount Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại giảm</label>
            <select
              name="discountType"
              value={data.discountType}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
            >
              <option value="percent">Phần trăm (%)</option>
              <option value="fixed">Tiền mặt (VND)</option>
            </select>
          </div>

          {/* Discount Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              {data.discountType === "percent" ? (
                <Percent className="w-4 h-4 text-gray-400" />
              ) : (
                <DollarSign className="w-4 h-4 text-gray-400" />
              )}{" "}
              Giá trị *
            </label>
            <input
              name="discountValue"
              placeholder={data.discountType === "percent" ? "VD: 15" : "VD: 50000"}
              value={data.discountValue}
              onChange={handleChange}
              type="number"
              min="1"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Max discount for percent type */}
        {data.discountType === "percent" && (
          <div className="animate-in fade-in slide-in-from-top-1 duration-200">
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-gray-400" /> Giảm tối đa (VND)
            </label>
            <input
              name="maxDiscountValue"
              placeholder="Không giới hạn nếu để trống"
              value={data.maxDiscountValue}
              onChange={handleChange}
              type="number"
              min="0"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {/* Min Order Value */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Đơn tối thiểu</label>
            <input
              name="minOrderValue"
              placeholder="VD: 100000"
              value={data.minOrderValue}
              onChange={handleChange}
              type="number"
              min="0"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>

          {/* Usage Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Số lượng</label>
            <input
              name="usageLimit"
              placeholder="VD: 100"
              value={data.usageLimit}
              onChange={handleChange}
              type="number"
              min="0"
              step="1"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" /> Bắt đầu *
            </label>
            <input
              type="date"
              name="startDate"
              value={data.startDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-gray-400" /> Kết thúc *
            </label>
            <input
              type="date"
              name="endDate"
              value={data.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              required
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="pt-2 pb-1">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                name="isActive"
                checked={data.isActive}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${data.isActive ? "bg-emerald-500" : "bg-gray-200"}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform transform ${data.isActive ? "translate-x-4" : ""}`}></div>
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              Kích hoạt mã ngay lập tức
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={!!errors.code}
          className={`w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-3.5 px-4 rounded-xl transition-all mt-4 ${
            errors.code ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800 active:scale-95"
          }`}
        >
          <Save className="w-5 h-5" /> Thêm Mã Giảm Giá
        </button>
      </form>
    </div>
  );
};

export default CouponForm;
