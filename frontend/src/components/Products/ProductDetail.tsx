import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { NotificationService } from "../../utils/notificationService";
import ProductGrid from "./ProductGrid";
import ProductOptions from "./ProductOptions";
import ProductReviews from "../reviews/ProductReviews";
import { Loading } from "@/shared/components/feedback/Loading";

import { useProductDetail, useSimilarProducts } from "@/features/products";
import { useCartMutations, useCartParams } from "@/features/cart";
import { useAuthStore } from "@/features/auth";
import { getErrorMessage } from "@/shared/utils/error-utils";

interface ProductDetailProps {
  productId?: string;
}

export function ProductDetail({ productId }: ProductDetailProps) {
  const { id } = useParams<{ id?: string }>();
  const productFetchId = productId || id || "";

  const { data: selectedProduct, isLoading: loading, error } = useProductDetail(productFetchId);
  const { data: similarProducts = [] } = useSimilarProducts(productFetchId);

  const { user } = useAuthStore();
  const cartParams = useCartParams();
  const { addToCart } = useCartMutations();

  const [mainImage, setMainImage] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  useEffect(() => {
    if (!productFetchId) return;

    setMainImage("");
    setSelectedSize("");
    setSelectedColor("");
    setQuantity(1);
  }, [productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.[0]?.url) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action: "plus" | "minus"): void => {
    setQuantity((prev) => (action === "plus" ? prev + 1 : prev > 1 ? prev - 1 : prev));
  };

  const handleAddToCart = async (): Promise<void> => {
    try {
      await addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        ...cartParams,
      });
      NotificationService.success("Đã thêm vào giỏ hàng!");
    } catch (err: unknown) {
      NotificationService.error(getErrorMessage(err, "Thêm giỏ hàng thất bại!"));
    }
  };

  const handleToggleWishlist = async (): Promise<void> => {
    if (!user) {
      NotificationService.warning("Vui lòng đăng nhập để yêu thích.");
      return;
    }
    NotificationService.success("Cập nhật yêu thích thành công!");
  };

  if (loading && !selectedProduct) return <Loading />;
  if (error) return <div className="p-6 text-red-500 text-center font-semibold">{getErrorMessage(error)}</div>;
  if (!selectedProduct) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 py-6 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Modern Breadcrumbs */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-400 font-bold mb-6 sm:mb-8">
          <Link to="/" className="hover:text-emerald-600 transition-colors">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <Link to="/collections/all" className="hover:text-emerald-600 transition-colors">
            Bộ sưu tập
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          <span className="text-gray-900 truncate max-w-[150px] sm:max-w-[250px]">
            {selectedProduct.name}
          </span>
        </div>

        {/* Main Details Section */}
        <div className="bg-white rounded-2xl md:rounded-[2.5rem] border border-gray-100 shadow-sm p-4 sm:p-8 lg:p-12 mb-10 transition-all duration-300 hover:shadow-md">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
            {/* Image Columns */}
            <div className="flex flex-col md:flex-row lg:w-1/2 gap-4 sm:gap-6">
              {/* Desktop Thumbnails Left */}
              <div className="hidden md:flex flex-col gap-3.5">
                {selectedProduct.images?.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setMainImage(image.url)}
                    className={`w-16 h-16 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl overflow-hidden cursor-pointer border-2 transition-all duration-300 p-0.5 bg-white ${
                      mainImage === image.url
                        ? "border-emerald-500 scale-105 shadow-sm"
                        : "border-gray-100 hover:border-gray-300"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || `Thumbnail ${index}`}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-lg lg:rounded-xl"
                    />
                  </div>
                ))}
              </div>

              {/* Main Image Center */}
              <div className="flex-1 rounded-xl sm:rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-100 aspect-[4/5] relative group max-h-[480px] lg:max-h-[520px] mx-auto w-full">
                {mainImage && (
                  <img
                    src={mainImage}
                    alt="Main product representation"
                    className="w-full h-full object-cover transition-transform duration-[1s] group-hover:scale-105"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Mobile Thumbnails Scrollable */}
              <div className="md:hidden flex overflow-x-auto gap-3 py-1 scrollbar-none">
                {selectedProduct.images?.map((image, index) => (
                  <div
                    key={index}
                    onClick={() => setMainImage(image.url)}
                    className={`w-14 h-14 rounded-lg overflow-hidden cursor-pointer border-2 flex-shrink-0 transition-all p-0.5 ${
                      mainImage === image.url ? "border-emerald-500 scale-105 shadow-sm" : "border-gray-100"
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`Thumbnail ${index}`}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Options & Configuration Panel */}
            <div className="lg:w-1/2 flex flex-col justify-between">
              <ProductOptions
                product={selectedProduct}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
                quantity={quantity}
                handleQuantityChange={handleQuantityChange}
                handleAddToCart={handleAddToCart}
                isInWishlist={false}
                handleToggleWishlist={handleToggleWishlist}
              />
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <ProductReviews productId={productFetchId} user={user} />
        </div>

        {/* Similar Products Carousel */}
        <div>
          <h2 className="text-1xl sm:text-2xl lg:text-3xl font-black text-gray-900 mb-6 sm:mb-8 tracking-tight text-center sm:text-left">
            Có thể bạn cũng thích
          </h2>
          <ProductGrid products={similarProducts} loading={false} error={null} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
