import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAdminBanners, useBannerMutations } from '../api/useBanners';
import { NotificationService } from '@/shared/utils/notification';
import { getErrorMessage } from '@/shared/utils/error-utils';
import apiClient from '@/shared/api/api-client';
import { Image as ImageIcon, Plus, Trash2, Edit, ToggleLeft, ToggleRight, CheckCircle2, XCircle } from 'lucide-react';
import { Loading } from '@/shared/components/feedback/Loading';
import { Banner } from '@/types';

export interface BannerFormData {
  imageUrl: string;
  title: string;
  altText: string;
  order: number;
}

export function BannerManagementContainer() {
  const { data: banners = [], isLoading, isFetching, error } = useAdminBanners();
  const { createBanner, updateBanner, deleteBanner, toggleBannerStatus } = useBannerMutations();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [formData, setFormData] = useState<BannerFormData>({ imageUrl: '', title: '', altText: '', order: 0 });

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file) {
      NotificationService.error('Vui lòng chọn file ảnh');
      return;
    }
    if (!file.type.startsWith('image/')) {
      NotificationService.error('Vui lòng chọn file ảnh');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      NotificationService.error('Kích thước ảnh không vượt quá 5MB');
      return;
    }

    const fd = new FormData();
    fd.append('image', file);

    try {
      setUploading(true);
      const res = await apiClient.post<{ url: string }>('/api/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, imageUrl: res.data.url }));
      NotificationService.success('Upload ảnh thành công');
    } catch {
      NotificationService.error('Upload ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!formData.imageUrl || !formData.title) {
      NotificationService.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      if (editingBanner) {
        await updateBanner({ id: editingBanner._id, data: formData });
        NotificationService.success('Cập nhật banner thành công');
      } else {
        await createBanner(formData);
        NotificationService.success('Tạo banner thành công');
      }
      closeModal();
    } catch (err: unknown) {
      NotificationService.error(getErrorMessage(err, 'Lưu banner thất bại'));
    }
  };

  const handleToggle = async (id: string): Promise<void> => {
    try {
      await toggleBannerStatus(id);
      NotificationService.success('Cập nhật trạng thái thành công');
    } catch (err: unknown) {
      NotificationService.error(getErrorMessage(err, 'Cập nhật trạng thái thất bại'));
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (!window.confirm('Bạn có chắc muốn xóa banner này?')) return;
    try {
      await deleteBanner(id);
      NotificationService.success('Xóa banner thành công');
    } catch (err: unknown) {
      NotificationService.error(getErrorMessage(err, 'Xóa banner thất bại'));
    }
  };

  const openModal = (banner: Banner | null = null): void => {
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        imageUrl: banner.imageUrl,
        title: banner.title,
        altText: banner.altText || '',
        order: banner.order ?? 0,
      });
    } else {
      setEditingBanner(null);
      setFormData({ imageUrl: '', title: '', altText: '', order: banners.length });
    }
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
    setEditingBanner(null);
    setFormData({ imageUrl: '', title: '', altText: '', order: 0 });
  };

  if (isLoading && !banners.length) return <Loading />;
  if (error) return <div className="p-6 text-red-500 font-medium">{getErrorMessage(error)}</div>;

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
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Quản Lý Banner</h2>
          <p className="text-gray-500 text-sm">Quản lý hình ảnh và chiến dịch nổi bật</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl hover:bg-gray-800 active:scale-95 transition-all font-medium whitespace-nowrap shadow-sm"
        >
          <Plus className="w-5 h-5" /> Tạo Banner
        </button>
      </div>

      {/* Banner List */}
      {banners.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <ImageIcon className="text-gray-300 w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có banner nào</h3>
          <p className="text-gray-500 mb-6">Tạo banner đầu tiên để làm nổi bật trang chủ của bạn</p>
          <button
            onClick={() => openModal()}
            className="bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-2.5 rounded-xl transition-all shadow-sm"
          >
            Tạo Banner Ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {banners.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                <img
                  src={b.imageUrl}
                  alt={b.altText || b.title}
                  className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                    !b.isActive && 'grayscale'
                  }`}
                />
                {!b.isActive && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
                      <XCircle className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 font-semibold text-sm">Đã Ẩn</span>
                    </div>
                  </div>
                )}
                {b.isActive && (
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="text-xs font-bold">Hiển thị</span>
                  </div>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 mb-1 truncate" title={b.title}>
                  {b.title}
                </h3>
                <p className="text-sm text-gray-500 font-medium mb-4 flex items-center gap-2">
                  <span className="bg-gray-100 px-2.5 py-0.5 rounded-md text-gray-600 border border-gray-200">
                    Thứ tự: {b.order}
                  </span>
                </p>
                <div className="flex gap-2 pt-2 border-t border-gray-50">
                  <button
                    onClick={() => handleToggle(b._id)}
                    className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm ${
                      b.isActive
                        ? 'bg-amber-50 text-amber-600 hover:bg-amber-100'
                        : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                    }`}
                  >
                    {b.isActive ? (
                      <>
                        <ToggleLeft className="w-5 h-5" /> Ẩn
                      </>
                    ) : (
                      <>
                        <ToggleRight className="w-5 h-5" /> Hiện
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => openModal(b)}
                    className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm"
                  >
                    <Edit className="w-4 h-4" /> Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(b._id)}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4" /> Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto scale-in-center">
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingBanner ? 'Chỉnh sửa Banner' : 'Tạo Banner Mới'}
                </h2>
                <button
                  onClick={closeModal}
                  className="p-2 bg-gray-50 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Ảnh Banner *</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-colors border border-gray-200 rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={uploading}
                    />
                  </div>
                  {uploading && (
                    <p className="text-sm text-blue-600 mt-2 font-medium animate-pulse">
                      Đang upload ảnh lên hệ thống...
                    </p>
                  )}
                  {formData.imageUrl && (
                    <div className="mt-4 relative rounded-xl overflow-hidden border border-gray-200">
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-48 object-cover" />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Tiêu đề *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="VD: Bộ sưu tập mùa hè 2025"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Mô tả SEO (Alt Text)
                  </label>
                  <input
                    type="text"
                    value={formData.altText}
                    onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Mô tả ảnh cho SEO"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Thứ tự hiển thị <span className="text-gray-400 font-normal ml-1">(0 = đầu tiên)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    min={0}
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
                  <button
                    type="submit"
                    disabled={uploading || !formData.imageUrl}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 rounded-xl disabled:bg-gray-300 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    {editingBanner ? 'Lưu Thay Đổi' : 'Tạo Banner'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 rounded-xl transition-all"
                  >
                    Hủy Bỏ
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BannerManagementContainer;
