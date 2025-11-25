import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaImage, FaPlus, FaTrash, FaToggleOn, FaToggleOff, FaEdit } from "react-icons/fa";
import { fetchAllBanners, createBanner, updateBanner, deleteBanner, toggleBannerStatus } from "../../../redux/slices/bannerSlice";
import axios from "../../../utils/axiosConfig";
import Loading from "../../Common/Loading";

const BannerManagement = () => {
    const dispatch = useDispatch();
    const { banners, loading } = useSelector((state) => state.banners);

    // State modal & form
    const [showModal, setShowModal] = useState(false);
    const [editingBanner, setEditingBanner] = useState(null);
    const [uploading, setUploading] = useState(false); // Trạng thái upload ảnh
    const [formData, setFormData] = useState({ imageUrl: "", title: "", altText: "", order: 0 }); // Dữ liệu form

    // Fetch banner khi mount component
    useEffect(() => {
        dispatch(fetchAllBanners());
    }, [dispatch]);

    // Upload ảnh
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return toast.error("Vui lòng chọn file ảnh");
        if (!file.type.startsWith("image/")) return toast.error("Vui lòng chọn file ảnh");
        if (file.size > 5 * 1024 * 1024) return toast.error("Kích thước ảnh không vượt quá 5MB");

        const fd = new FormData();
        fd.append("image", file);

        try {
            setUploading(true); // Bật trạng thái upload
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            setFormData({ ...formData, imageUrl: res.data.url }); // Lưu URL ảnh vào form
            toast.success("Upload ảnh thành công");
        } catch {
            toast.error("Upload ảnh thất bại");
        } finally {
            setUploading(false); // Tắt trạng thái upload
        }
    };

    // Tạo hoặc cập nhật banner
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.imageUrl || !formData.title) return toast.error("Vui lòng điền đầy đủ thông tin");

        try {
            if (editingBanner) {
                await dispatch(updateBanner({ id: editingBanner._id, data: formData })).unwrap();
                toast.success("Cập nhật banner thành công");
            } else {
                await dispatch(createBanner(formData)).unwrap();
                toast.success("Tạo banner thành công");
            }
            closeModal(); // Đóng modal sau khi lưu
        } catch {
            toast.error("Lưu banner thất bại");
        }
    };

    // Toggle trạng thái (active/inactive)
    const handleToggle = async (id) => {
        try {
            await dispatch(toggleBannerStatus(id)).unwrap();
            toast.success("Cập nhật trạng thái thành công");
        } catch {
            toast.error("Cập nhật trạng thái thất bại");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa banner này?")) return;
        try {
            await dispatch(deleteBanner(id)).unwrap();
            toast.success("Xóa banner thành công");
        } catch {
            toast.error("Xóa banner thất bại");
        }
    };

    // Mở modal tạo hoặc chỉnh sửa
    const openModal = (banner = null) => {
        if (banner) {
            setEditingBanner(banner);
            setFormData({
                imageUrl: banner.imageUrl,
                title: banner.title,
                altText: banner.altText || "",
                order: banner.order,
            });
        } else {
            // Tạo mới banner
            setEditingBanner(null);
            setFormData({ imageUrl: "", title: "", altText: "", order: banners.length });
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBanner(null);
        setFormData({ imageUrl: "", title: "", altText: "", order: 0 });
    };

    if (loading) return <Loading />;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Quản lý Banner</h1>
                <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap text-white px-3 py-2 rounded-lg flex items-center gap-2">
                    <FaPlus /> Tạo Banner
                </button>
            </div>

            {/* Banner List */}
            {banners.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-12 text-center">
                    <FaImage className="text-gray-300 text-6xl mx-auto mb-4" />
                    <h3 className="text-xl text-gray-600 mb-2">Chưa có banner nào</h3>
                    <p className="text-gray-400 mb-4">Tạo banner đầu tiên để hiển thị trên trang chủ</p>
                    <button onClick={() => openModal()} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg">
                        Tạo Banner
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {banners.map((b) => (
                        <div key={b._id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                            {/* Ảnh banner */}
                            <div className="relative h-48 bg-gray-200">
                                <img src={b.imageUrl} alt={b.altText || b.title} className="w-full h-full object-cover" />
                                {!b.isActive && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="text-white font-bold text-lg">KhÔNG HOẠT ĐỘNG</span>
                                    </div>
                                )}
                            </div>

                            {/* Thông tin banner & thao tác */}
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-2 truncate">{b.title}</h3>
                                <p className="text-sm text-gray-500 mb-3">Thứ tự: {b.order}</p>
                                <div className="flex gap-2">
                                    {/* Toggle active */}
                                    <button onClick={() => handleToggle(b._id)} className={`flex-1 px-3 py-2 rounded flex items-center justify-center gap-2 ${b.isActive ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
                                        {b.isActive ? <FaToggleOn /> : <FaToggleOff />}
                                    </button>
                                    {/* Chỉnh sửa */}
                                    <button onClick={() => openModal(b)} className="flex-1 bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-2 rounded flex items-center justify-center gap-2">
                                        <FaEdit />
                                    </button>
                                    {/* Xóa */}
                                    <button onClick={() => handleDelete(b._id)} className="flex-1 bg-red-100 text-red-700 hover:bg-red-200 px-3 py-2 rounded flex items-center justify-center gap-2">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal tạo/cập nhật banner */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-4">{editingBanner ? "Chỉnh sửa Banner" : "Tạo Banner Mới"}</h2>
                            <form onSubmit={handleSubmit}>
                                {/* Upload ảnh */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Ảnh Banner *</label>
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full border rounded px-3 py-2" disabled={uploading} />
                                    {uploading && <p className="text-sm text-blue-600 mt-2">Đang upload...</p>}
                                    {formData.imageUrl && <img src={formData.imageUrl} alt="Preview" className="mt-3 w-full h-48 object-cover rounded border" />}
                                </div>

                                {/* Title */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Tiêu đề *</label>
                                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="VD: Bộ sưu tập mùa hè 2025" required />
                                </div>

                                {/* Alt Text */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">Mô tả SEO (Alt Text)</label>
                                    <input type="text" value={formData.altText} onChange={(e) => setFormData({ ...formData, altText: e.target.value })} className="w-full border rounded px-3 py-2" placeholder="Mô tả cho SEO" />
                                </div>

                                {/* Order */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium mb-2">
                                        Thứ tự hiển thị <span className="text-gray-500 font-normal ml-2">(0 = hiển thị đầu tiên)</span>
                                    </label>
                                    <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })} className="w-full border rounded px-3 py-2" min={0} />
                                    <p className="text-xs text-gray-500 mt-1">💡 Số càng nhỏ càng hiển thị trước trong băng chuyền</p>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3">
                                    <button type="submit" disabled={uploading || !formData.imageUrl} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400">
                                        {editingBanner ? "Cập nhật" : "Tạo mới"}
                                    </button>
                                    <button type="button" onClick={closeModal} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded">
                                        Hủy
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BannerManagement;
