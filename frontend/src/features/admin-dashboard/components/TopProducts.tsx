import React from "react";
import { Trophy, AlertTriangle, Heart } from "lucide-react";
import { TopSellingProduct, LowStockProduct, TopWishlistProduct } from "../../../types";

export interface TopProductsProps {
  topSelling?: TopSellingProduct[];
  lowStock?: LowStockProduct[];
  topWishlist?: TopWishlistProduct[];
}

const TopProducts: React.FC<TopProductsProps> = ({
  topSelling = [],
  lowStock = [],
  topWishlist = [],
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {/* Top sản phẩm bán chạy */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-500 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Sản Phẩm Bán Chạy</h3>
        </div>
        <ul className="space-y-4 flex-1">
          {topSelling.length > 0 ? (
            topSelling.map((product) => (
              <li
                key={product._id}
                className="flex items-center justify-between group hover:bg-gray-50/50 p-2 -mx-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={product.image || "/no-image.png"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-xl border border-gray-100 shadow-sm shrink-0"
                  />
                  <div className="truncate">
                    <p
                      className="text-sm font-bold text-gray-900 group-hover:text-amber-600 transition-colors truncate"
                      title={product.name}
                    >
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      Đã bán: <span className="text-gray-700">{product.totalSold}</span>
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-600 shrink-0 ml-2">
                  $
                  {(product.revenue ?? 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Chưa có dữ liệu</p>
          )}
        </ul>
      </div>

      {/* Sắp hết hàng */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Sản Phẩm Sắp Hết</h3>
        </div>
        <ul className="space-y-4 flex-1">
          {lowStock.length > 0 ? (
            lowStock.map((product) => (
              <li
                key={product._id}
                className="flex items-center justify-between group hover:bg-gray-50/50 p-2 -mx-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={product.images?.[0]?.url || "/no-image.png"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-xl border border-gray-100 shadow-sm shrink-0"
                  />
                  <div className="truncate">
                    <p
                      className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors truncate"
                      title={product.name}
                    >
                      {product.name}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full shrink-0 ml-2 border border-red-100">
                  SL: {product.countInStock}
                </span>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Không có sản phẩm nào sắp hết hàng</p>
          )}
        </ul>
      </div>

      {/* Top sản phẩm yêu thích */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Sản Phẩm Được Yêu Thích</h3>
        </div>
        <ul className="space-y-4 flex-1">
          {topWishlist.length > 0 ? (
            topWishlist.map((product) => (
              <li
                key={product._id}
                className="flex items-center justify-between group hover:bg-gray-50/50 p-2 -mx-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <img
                    src={product.image || "/no-image.png"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-xl border border-gray-100 shadow-sm shrink-0"
                  />
                  <div className="truncate">
                    <p
                      className="text-sm font-bold text-gray-900 group-hover:text-pink-600 transition-colors truncate"
                      title={product.name}
                    >
                      {product.name}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-bold text-pink-600 shrink-0 ml-2 bg-pink-50 px-2 py-1 rounded-lg">
                  {product.count} <Heart className="w-3 h-3 inline fill-pink-500" />
                </span>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Chưa có dữ liệu</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default TopProducts;
