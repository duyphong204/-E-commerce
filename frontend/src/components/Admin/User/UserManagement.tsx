import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { addUser, deleteUser, fetchUsers, updateUser, searchUser } from "../../../redux/slices/adminSlice";
import { NotificationService } from "../../../utils/notificationService";
import { Users, UserCog, User as UserIcon, Trash2, Plus } from "lucide-react";
import SearchBar from "../../Common/SearchBar";
import Pagination from "../../Common/Pagination";
import Loading from "../../Common/Loading";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { UserRole } from "../../../types";

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
}

const UserManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const { users, loading, error, page, totalPages, totalItems, statistics } = useAppSelector(
    (state) => state.admin
  );

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchUsers({ page: 1 }));
    }
  }, [user, navigate, dispatch]);

  useEffect(() => {
    return () => {
      if (searchTimer) clearTimeout(searchTimer);
    };
  }, [searchTimer]);

  const { adminCount = 0, customerCount = 0 } = statistics || {};

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    try {
      await dispatch(addUser(formData)).unwrap();
      NotificationService.success("Thêm user thành công");
      setFormData({ name: "", email: "", password: "", role: "customer" });
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      NotificationService.error(errObj?.message || "Thêm user thất bại");
    }
  };

  const handleRoleChange = async (userId: string, targetUser: { name: string; email: string }, newRole: UserRole): Promise<void> => {
    try {
      await dispatch(
        updateUser({ id: userId, name: targetUser.name, email: targetUser.email, role: newRole })
      ).unwrap();
      NotificationService.success("Cập nhật role thành công");
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      NotificationService.error(errObj?.message || "Cập nhật role thất bại");
    }
  };

  const handleDeleteUser = async (userId: string): Promise<void> => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) return;
    try {
      await dispatch(deleteUser(userId)).unwrap();
      NotificationService.success("Xóa user thành công");
    } catch (err: unknown) {
      const errObj = err as { message?: string };
      NotificationService.error(errObj?.message || "Xóa user thất bại");
    }
  };

  const handleSearch = (term: string): void => {
    if (searchTimer) clearTimeout(searchTimer);
    const timer = setTimeout(() => {
      setSearchTerm(term);
      if (term.trim()) {
        dispatch(searchUser({ term: term.trim(), page: 1 }));
      } else {
        dispatch(fetchUsers({ page: 1 }));
      }
    }, 500);
    setSearchTimer(timer);
  };

  const handlePageChange = (newPage: number): void => {
    if (searchTerm) {
      dispatch(searchUser({ term: searchTerm, page: newPage }));
    } else {
      dispatch(fetchUsers({ page: newPage }));
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="p-6 text-red-500 font-medium">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Quản Lý Người Dùng</h2>
          <p className="text-gray-500 text-sm">Quản lý tài khoản và phân quyền hệ thống</p>
        </div>
        <div className="w-full md:w-72">
          <SearchBar onSearch={handleSearch} placeholder="Tìm tên, email..." />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Tổng Tài Khoản</p>
            <h3 className="text-2xl font-bold text-gray-900">{totalItems}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <UserIcon className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Khách Hàng</p>
            <h3 className="text-2xl font-bold text-gray-900">{customerCount}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1">
          <div className="w-14 h-14 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center">
            <UserCog className="w-7 h-7" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Quản Trị Viên</p>
            <h3 className="text-2xl font-bold text-gray-900">{adminCount}</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Create */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 sticky top-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Thêm Tài Khoản</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên hiển thị</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Nhập tên..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Nhập email..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Nhập mật khẩu..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phân quyền (Role)</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                >
                  <option value="customer">Khách hàng (Customer)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-gray-900 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-gray-800 active:scale-95 transition-all mt-2"
              >
                Tạo Tài Khoản
              </button>
            </form>
          </div>
        </div>

        {/* Table List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-100">
                  <tr>
                    <th className="py-4 px-6">STT</th>
                    <th className="py-4 px-6">Người dùng</th>
                    <th className="py-4 px-6">Vai trò</th>
                    <th className="py-4 px-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {users.length > 0 ? (
                    users.map((userItem, index) => (
                      <tr key={userItem._id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-500">
                          {(page - 1) * 10 + (index + 1)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{userItem.name}</span>
                            <span className="text-gray-500 text-xs">{userItem.email}</span>
                            <span className="text-gray-400 text-xs mt-0.5">
                              Tham gia: {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={userItem.role}
                            onChange={(e) =>
                              handleRoleChange(
                                userItem._id,
                                { name: userItem.name, email: userItem.email },
                                e.target.value as UserRole
                              )
                            }
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border outline-none cursor-pointer transition-colors ${
                              userItem.role === "admin"
                                ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                                : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                            }`}
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDeleteUser(userItem._id)}
                            className="inline-flex items-center justify-center p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Xóa tài khoản"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-400">
                          <UserCog className="w-12 h-12 mb-3 opacity-50" />
                          <p className="text-base font-medium text-gray-600">Không tìm thấy người dùng</p>
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
      </div>
    </div>
  );
};

export default UserManagement;
