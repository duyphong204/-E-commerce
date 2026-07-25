import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { XCircle, Save, Hash, Percent, DollarSign, Target, Calendar } from "lucide-react";
import { Coupon } from "../../../types";
import { CouponFormData } from "./CouponForm";

const formatDateForInput = (date?: string | Date): string =>
  date ? new Date(date).toISOString().slice(0, 10) : "";

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

export interface EditCouponModalProps {
  open: boolean;
  coupon: Coupon | null;
  coupons: Coupon[];
  onClose: () => void;
  onSubmit: (id: string, payload: CouponFormData) => Promise<void>;
}

const EditCouponModal: React.FC<EditCouponModalProps> = ({ open, coupon, coupons, onClose, onSubmit }) => {
  const [data, setData] = useState<CouponFormData>(buildFormState());
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open && coupon) {
      setData(buildFormState(coupon));
      setErrors({});
    }
  }, [open, coupon]);

  if (!open || !coupon) return null;

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
        code: isDuplicateCode(coupons, codeStr, coupon._id) ? "Mã đã tồn tại" : "",
      }));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto scale-in-center">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Chỉnh Sửa Mã Giảm Giá</h3>
            <button
              onClick={onClose}
              className="p-2 bg-gray-50 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Đóng"
            >
              <XCircle className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Mã giảm giá */}
              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                  <Hash className="w-4 h-4 text-gray-400" /> Mã giảm giá *
                </label>
                <input
                  name="code"
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

              {/* Loại giảm */}
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

              {/* Giá trị giảm */}
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
                  type="number"
                  min="1"
                  value={data.discountValue}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              {/* Giảm tối đa */}
              {data.discountType === "percent" && (
                <div className="col-span-full animate-in fade-in slide-in-from-top-1 duration-200">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1.5">
                    <Target className="w-4 h-4 text-gray-400" /> Giảm tối đa (VND)
                  </label>
                  <input
                    name="maxDiscountValue"
                    type="number"
                    min="0"
                    value={data.maxDiscountValue}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Không giới hạn nếu để trống"
                  />
                </div>
              )}

              {/* Đơn tối thiểu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Đơn tối thiểu (VND)</label>
                <input
                  name="minOrderValue"
                  type="number"
                  min="0"
                  value={data.minOrderValue}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              {/* Giới hạn người dùng */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Số lượng</label>
                <input
                  name="usageLimit"
                  type="number"
                  min="0"
                  step="1"
                  value={data.usageLimit}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Bỏ trống để không giới hạn</p>
              </div>

              {/* Ngày bắt đầu */}
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

              {/* Ngày kết thúc */}
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

            {/* Kích hoạt */}
            <div className="pt-2">
              <label className="flex items-center gap-3 cursor-pointer group w-max">
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
                  Kích hoạt mã ngay
                </span>
              </label>
            </div>

            {/* Thao tác */}
            <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
              <button
                type="submit"
                disabled={!!errors.code}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" /> Lưu Thay Đổi
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-xl transition-all"
              >
                Hủy Bỏ
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditCouponModal;
