import React, { useState } from 'react';
import { useAccounts, useAccountMutations } from '../api/useAccounts';
import { CreateAccountInput } from '../schemas/account.schema';
import { NotificationService } from '@/shared/utils/notification';
import { Users, UserCog, User as UserIcon, Trash2, Plus } from 'lucide-react';
import { SearchBar } from '@/shared/components/ui/SearchBar';
import { Pagination } from '@/shared/components/ui/Pagination';
import { Loading } from '@/shared/components/feedback/Loading';
import { getErrorMessage } from '@/shared/utils/error-utils';

export function UserManagementContainer() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<CreateAccountInput>({
    name: '',
    email: '',
    password: '',
    role: 'customer',
  });

  const { data, isLoading, isFetching, error } = useAccounts({ page, term: searchTerm, limit: 10 });
  const { createAccount, updateAccount, deleteAccount, isCreating } = useAccountMutations();

  const handleSearch = (term: string) => {
    setSearchTerm(term.trim());
    setPage(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAccount(formData);
      NotificationService.success('Thêm tài khoản thành công');
      setFormData({ name: '', email: '', password: '', role: 'customer' });
    } catch (err: unknown) {
      NotificationService.error(getErrorMessage(err, 'Thêm tài khoản thất bại'));
    }
  };

  const handleRoleChange = async (userId: string, name: string, email: string, newRole: 'customer' | 'admin') => {
    try {
      await updateAccount({ id: userId, name, email, role: newRole });
      NotificationService.success('Cập nhật quyền thành công');
    } catch (err: unknown) {
      NotificationService.error(getErrorMessage(err, 'Cập nhật quyền thất bại'));
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản này không?')) return;
    try {
      await deleteAccount(userId);
      NotificationService.success('Xóa tài khoản thành công');
    } catch (err: unknown) {
      NotificationService.error(getErrorMessage(err, 'Xóa tài khoản thất bại'));
    }
  };

  if (isLoading && !data) return <Loading />;
  if (error) return <div className="p-6 text-red-500 font-medium">{getErrorMessage(error)}</div>;

  const users = data?.results || [];
  const totalPages = data?.totalPages || 1;
  const totalItems = data?.totalItems || 0;
  const { adminCount = 0, customerCount = 0 } = data?.statistics || {};

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative">
      {isFetching && (
        <div className="absolute top-2 right-4 text-xs font-semibold text-blue-600 animate-pulse bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Đang cập nhật dữ liệu...
        </div>
      )}

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
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Nhập tên..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Nhập email..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mật khẩu</label>
                <input
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="Nhập mật khẩu..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phân quyền (Role)</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData((prev) => ({ ...prev, role: e.target.value as 'customer' | 'admin' }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                >
                  <option value="customer">Khách hàng (Customer)</option>
                  <option value="admin">Quản trị viên (Admin)</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-gray-900 text-white font-semibold py-3.5 px-4 rounded-xl hover:bg-gray-800 active:scale-95 transition-all mt-2 disabled:opacity-50"
              >
                {isCreating ? 'Đang tạo...' : 'Tạo Tài Khoản'}
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
                              Tham gia: {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <select
                            value={userItem.role}
                            onChange={(e) =>
                              handleRoleChange(
                                userItem._id,
                                userItem.name,
                                userItem.email,
                                e.target.value as 'customer' | 'admin'
                              )
                            }
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border outline-none cursor-pointer transition-colors ${
                              userItem.role === 'admin'
                                ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <option value="customer">Customer</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => handleDelete(userItem._id)}
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
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={(p) => setPage(p)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagementContainer;
