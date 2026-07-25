import React from "react";
import { ToggleLeft, ToggleRight, Edit, Trash2, Tag, Percent, DollarSign } from "lucide-react";
import { Coupon } from "../../../types";

const formatDateForInput = (date?: string | Date): string =>
  date ? new Date(date).toISOString().slice(0, 10) : "";

export interface CouponTableProps {
  coupons: Coupon[];
  page: number;
  onToggle: (id: string, currentStatus: boolean) => void;
  onEdit: (coupon: Coupon) => void;
  onDelete: (id: string) => void;
}

const CouponTable: React.FC<CouponTableProps> = ({ coupons, page, onToggle, onEdit, onDelete }) => (
  <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/80 border-b border-gray-100">
            <th className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">STT</th>
            <th className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mã Giảm Giá</th>
            <th className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Chi Tiết</th>
            <th className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Lượt Dùng</th>
            <th className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Thời Hạn</th>
            <th className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Trạng Thái</th>
            <th className="py-4 px-5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Thao Tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {coupons.length ? (
            coupons.map((coupon, index) => (
              <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="py-4 px-5 text-sm font-medium text-gray-500">
                  {(page - 1) * 10 + (index + 1)}
                </td>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                      <Tag className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-gray-900 tracking-wide uppercase">{coupon.code}</span>
                  </div>
                </td>
                <td className="py-4 px-5">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                      {coupon.discountType === "percent" ? <Percent className="w-3.5 h-3.5" /> : <DollarSign className="w-3.5 h-3.5" />}
                      {Number(coupon.discountValue).toLocaleString("vi-VN")} {coupon.discountType === "percent" ? "" : "đ"}
                    </span>
                    <div className="text-xs text-gray-500 flex flex-col gap-0.5">
                      {coupon.minOrderValue && coupon.minOrderValue > 0 ? (
                        <span>Min: {Number(coupon.minOrderValue).toLocaleString("vi-VN")}đ</span>
                      ) : null}
                      {coupon.discountType === "percent" && coupon.maxDiscountValue && coupon.maxDiscountValue > 0 ? (
                        <span>Max: {Number(coupon.maxDiscountValue).toLocaleString("vi-VN")}đ</span>
                      ) : null}
                    </div>
                  </div>
                </td>
                <td className="py-4 px-5">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden w-20">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{
                          width: coupon.usageLimit
                            ? `${Math.min(100, ((coupon.usedCount || 0) / coupon.usageLimit) * 100)}%`
                            : "0%",
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-600">
                      {coupon.usedCount || 0}/{coupon.usageLimit || "∞"}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-5 text-sm text-gray-600">
                  <div className="flex flex-col gap-1">
                    <span className="text-emerald-600">Từ: {formatDateForInput(coupon.startDate)}</span>
                    <span className="text-rose-600">Đến: {formatDateForInput(coupon.endDate)}</span>
                  </div>
                </td>
                <td className="py-4 px-5 text-center">
                  <button
                    onClick={() => onToggle(coupon._id, coupon.isActive)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                      coupon.isActive ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                    }`}
                  >
                    {coupon.isActive ? (
                      <>
                        <ToggleRight className="w-4 h-4" /> Hoạt động
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-4 h-4" /> Đã dừng
                      </>
                    )}
                  </button>
                </td>
                <td className="py-4 px-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(coupon)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(coupon._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center p-8">
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <Tag className="w-12 h-12 mb-3 text-gray-300" />
                  <p className="text-base font-medium text-gray-500">Chưa có mã giảm giá nào</p>
                  <p className="text-sm">Hãy tạo mã giảm giá mới ở form bên trái.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);

export default CouponTable;
