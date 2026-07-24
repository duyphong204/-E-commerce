import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { deleteProduct, fetchAdminProducts, searchAdminProducts } from "../../../redux/slices/adminProductSlice";
import { NotificationService } from "../../../utils/notificationService";
import { Package, CheckCircle2, AlertTriangle, Plus, Edit, Trash2, Box } from "lucide-react";
import SearchBar from "../../Common/SearchBar";
import Pagination from "../../Common/Pagination";
import Loading from "../../Common/Loading";
import { useAppDispatch, useAppSelector } from "../../../redux/store";

const ProductManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { products, loading, error, page, totalPages, totalItems, statistics } = useAppSelector(
    (state) => state.adminProducts
  );

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    dispatch(fetchAdminProducts({ page: 1 }));
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (searchTimer) clearTimeout(searchTimer);
    };
  }, [searchTimer]);

  const { activeCount = 0, lowStockCount = 0 } = statistics || {};

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      NotificationService.success("Xóa sản phẩm thành công");
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      NotificationService.error(errObj?.message || "Xóa sản phẩm thất bại");
    }
  };

  const handleSearch = (term: string): void => {
    if (searchTimer) clearTimeout(searchTimer);
    const timer = setTimeout(() => {
      setSearchTerm(term);
      if (term.trim()) {
        dispatch(searchAdminProducts({ term: term.trim(), page: 1 }));
      } else {
        dispatch(fetchAdminProducts({ page: 1 }));
      }
    }, 500);
    setSearchTimer(timer);
  };

  const handlePageChange = (newPage: number): void => {
    if (searchTerm) {
      dispatch(searchAdminProducts({ term: searchTerm, page: newPage }));
    } else {
      dispatch(fetchAdminProducts({ page: newPage }));
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-6 text-red-500 font-medium">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Quản Lý Sản Phẩm</h2>
          <p className="text-gray-500 text-sm">Quản lý kho hàng và danh mục sản phẩm</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="w-full sm:w-72">
            <SearchBar onSearch={handleSearch} placeholder="Tìm Tên, SKU..." />
          </div>
          <Link
            to="/admin/products/create"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 active:scale-95 transition-all font-medium whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Thêm Sản Phẩm
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Package className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Tổng Sản Phẩm</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalItems}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Đang Bán</p>
            <h3 className="text-2xl font-bold text-gray-900">{activeCount}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Gần Hết Hàng</p>
            <h3 className="text-2xl font-bold text-gray-900">{lowStockCount}</h3>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-100">
              <tr>
                <th className="py-4 px-6 uppercase text-xs">Sản phẩm</th>
                <th className="py-4 px-6 uppercase text-xs">Phân loại</th>
                <th className="py-4 px-6 uppercase text-xs">Kho</th>
                <th className="py-4 px-6 uppercase text-xs">Giá bán</th>
                <th className="py-4 px-6 uppercase text-xs text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.images?.[0]?.url || "/no-image.png"}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm"
                        />
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                            {product.name}
                          </span>
                          <span className="text-gray-500 text-xs">SKU: {product.sku || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{product.brand}</span>
                        <span className="text-gray-500 text-xs">{product.category}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          product.countInStock < 10
                            ? "bg-red-50 text-red-600 border border-red-200"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                        }`}
                      >
                        {product.countInStock} cái
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-900">
                      ${product.price.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Sửa sản phẩm"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          title="Xóa sản phẩm"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <Box className="w-12 h-12 mb-3 opacity-50 stroke-1" />
                      <p className="text-base font-medium text-gray-600">Chưa có sản phẩm nào</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
};

export default ProductManagement;
