import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import apiClient from "@/shared/api/api-client";
import { useNavigate, useParams } from "react-router-dom";
import { useProductDetail, useProductMutations } from "@/features/products";
import { NotificationService } from "../../../utils/notificationService";
import {
  ArrowLeft,
  Upload,
  Package,
  AlignLeft,
  DollarSign,
  Tag,
  Archive,
  Layers,
  Hash,
  Image as ImageIcon,
  Save,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { ProductImage, UpdateProductPayload } from "../../../types";
import { getErrorMessage } from "@/shared/utils/error-utils";

export interface EditProductFormData {
  name: string;
  description: string;
  price: number | string;
  countInStock: number | string;
  sku: string;
  category: string;
  brand: string;
  sizes: string[];
  colors: string[];
  collections?: string;
  material: string;
  gender: string;
  images: ProductImage[];
}

export function EditProductPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: selectedProduct, isLoading: loading, error } = useProductDetail(id || "");
  const { updateProduct } = useProductMutations();

  const [productData, setProductData] = useState<EditProductFormData>({
    name: "",
    description: "",
    price: "",
    countInStock: "",
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price ?? "",
        countInStock: selectedProduct.countInStock ?? "",
        sku: selectedProduct.sku || "",
        category: selectedProduct.category || "",
        brand: selectedProduct.brand || "",
        sizes: selectedProduct.sizes || [],
        colors: selectedProduct.colors || [],
        collections: selectedProduct.collections || "",
        material: selectedProduct.material || "",
        gender: selectedProduct.gender || "",
        images: selectedProduct.images || [],
      });
    }
  }, [selectedProduct]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSizesColorsChange = (
    e: ChangeEvent<HTMLInputElement>,
    field: "sizes" | "colors"
  ): void => {
    setProductData((prev) => ({
      ...prev,
      [field]: e.target.value.split(",").map((x) => x.trim()),
    }));
  };

  const removeImage = (idx: number): void => {
    setProductData((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setUploading(true);
    try {
      const uploads = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("image", file);
          const { data } = await apiClient.post<{ url?: string; imageUrl?: string }>(
            "/api/upload",
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );
          const url = data?.url || data?.imageUrl || "";
          return { url, altText: file.name };
        })
      );

      setProductData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...uploads.filter((img) => !!img.url)],
      }));

      e.target.value = "";
    } catch (error) {
      console.error("Image upload failed:", error);
      NotificationService.error("Tải ảnh lên thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!id) return;
    try {
      const payload: UpdateProductPayload = {
        id,
        name: productData.name,
        description: productData.description,
        price: Number(productData.price),
        countInStock: Number(productData.countInStock),
        sku: productData.sku,
        category: productData.category,
        brand: productData.brand,
        sizes: productData.sizes,
        colors: productData.colors,
        material: productData.material,
        gender: productData.gender,
        images: productData.images,
      };
      const { id: _ignored, ...restPayload } = payload;
      await updateProduct({ id, ...restPayload });
      NotificationService.success("Đã cập nhật sản phẩm thành công");
      navigate("/admin/products");
    } catch (error: unknown) {
      NotificationService.error(getErrorMessage(error, "Cập nhật sản phẩm thất bại"));
    }
  };

  if (loading && !selectedProduct)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  if (error) return <div className="text-center text-red-500 p-8">Lỗi : {getErrorMessage(error)}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate("/admin/products")}
          className="p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Chỉnh Sửa Sản Phẩm</h2>
          <p className="text-gray-500 text-sm">Cập nhật thông tin chi tiết cho sản phẩm hiện tại</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cột trái: Thông tin chính */}
        <div className="lg:col-span-2 space-y-8">
          {/* Thông tin cơ bản */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" /> Thông tin cơ bản
            </h3>

            <div className="space-y-6">
              {/* Tên sản phẩm */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên sản phẩm *</label>
                <input
                  name="name"
                  value={productData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên sản phẩm..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  required
                />
              </div>

              {/* Mô tả */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                  <AlignLeft className="w-4 h-4 text-gray-400" /> Mô tả sản phẩm
                </label>
                <textarea
                  name="description"
                  value={productData.description}
                  onChange={handleChange}
                  placeholder="Viết mô tả chi tiết về sản phẩm..."
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-y min-h-[120px]"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Giá */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-gray-400" /> Giá bán (VND) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={productData.price}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>

                {/* Tồn kho */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                    <Archive className="w-4 h-4 text-gray-400" /> Số lượng kho *
                  </label>
                  <input
                    type="number"
                    name="countInStock"
                    value={productData.countInStock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Biến thể & Phân loại */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-500" /> Biến thể & Phân loại
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                    <Hash className="w-4 h-4 text-gray-400" /> Kích thước (Sizes)
                  </label>
                  <input
                    type="text"
                    name="sizes"
                    value={productData.sizes.join(", ")}
                    onChange={(e) => handleSizesColorsChange(e, "sizes")}
                    placeholder="S, M, L, XL..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Cách nhau bằng dấu phẩy</p>
                </div>

                {/* Colors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-gray-400" /> Màu sắc (Colors)
                  </label>
                  <input
                    type="text"
                    name="colors"
                    value={productData.colors.join(", ")}
                    onChange={(e) => handleSizesColorsChange(e, "colors")}
                    placeholder="Red, Blue, Black..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-1.5">Cách nhau bằng dấu phẩy</p>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Danh mục (Category) *</label>
                <div className="flex flex-wrap gap-3">
                  {["Top Wear", "Bottom Wear", "Footwear", "Accessories"].map((cat) => (
                    <label
                      key={cat}
                      className={`relative flex items-center justify-center px-4 py-2.5 border rounded-xl cursor-pointer transition-all ${
                        productData.category === cat
                          ? "bg-blue-50 border-blue-200 text-blue-700 font-medium"
                          : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={productData.category === cat}
                        onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                        className="sr-only"
                      />
                      <span>{cat}</span>
                      {productData.category === cat && <CheckCircle2 className="w-4 h-4 ml-2 text-blue-500" />}
                    </label>
                  ))}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Giới tính (Gender) *</label>
                <div className="flex gap-4">
                  {["Men", "Women", "Unisex"].map((g) => (
                    <label key={g} className="flex items-center gap-2 cursor-pointer group">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          productData.gender === g
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-300 bg-white group-hover:border-blue-400"
                        }`}
                      >
                        {productData.gender === g && <div className="w-2 h-2 rounded-full bg-white"></div>}
                      </div>
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        checked={productData.gender === g}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span
                        className={`text-sm ${
                          productData.gender === g ? "text-gray-900 font-medium" : "text-gray-600"
                        }`}
                      >
                        {g}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Hình ảnh & Phụ kiện */}
        <div className="space-y-8">
          {/* Hình ảnh */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-500" /> Hình ảnh sản phẩm
            </h3>

            <div>
              <div className="mb-4">
                <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 font-medium">Click để tải ảnh lên</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              </div>
              {uploading && (
                <div className="flex items-center gap-2 text-sm text-blue-600 font-medium animate-pulse mb-4">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Đang xử lý ảnh...
                </div>
              )}

              {productData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  {productData.images.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative group rounded-xl overflow-hidden border border-gray-200 aspect-square"
                    >
                      <img
                        src={img.url}
                        alt={img.altText || "Product"}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors transform hover:scale-110"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SKU, Brand & Material */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="space-y-6">
              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mã SKU *</label>
                <input
                  value={productData.sku}
                  onChange={handleChange}
                  name="sku"
                  placeholder="VD: SP-001"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all uppercase"
                  required
                />
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Thương hiệu *</label>
                <select
                  name="brand"
                  value={productData.brand}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                  required
                >
                  <option value="">-- Chọn thương hiệu --</option>
                  <option value="Urban Threads">Urban Threads</option>
                  <option value="Modern Fit">Modern Fit</option>
                  <option value="Street Style">Street Style</option>
                  <option value="Beach Breeze">Beach Breeze</option>
                </select>
              </div>

              {/* Material */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chất liệu</label>
                <select
                  name="material"
                  value={productData.material}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none"
                >
                  <option value="">-- Chọn chất liệu --</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Polyester">Polyester</option>
                  <option value="Wool">Wool</option>
                  <option value="Denim">Denim</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="sticky top-8">
            <button
              type="submit"
              disabled={uploading}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white font-semibold py-4 px-6 rounded-2xl hover:bg-gray-800 transition-all active:scale-95 shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Save className="w-5 h-5" /> Lưu Thay Đổi
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditProductPage;
