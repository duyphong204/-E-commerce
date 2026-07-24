import React, { useState } from "react";
import { Link } from "react-router-dom";
import fallback from "../../../assets/fallback.png";
import { AiFillStar } from "react-icons/ai";
import ProductSkeleton from "./ProductSkeleton";
import { Product } from "../../types";

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  error?: string | null;
}

const optimizeCloudinaryUrl = (url?: string, { width }: { width?: number } = {}): string => {
  if (!url || typeof url !== "string") return url || "";
  if (!url.includes("res.cloudinary.com")) return url;
  if (url.includes("/upload/f_auto") || url.includes("/upload/q_auto")) return url;

  const marker = "/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1) return url;

  const prefix = url.slice(0, idx + marker.length);
  const suffix = url.slice(idx + marker.length);

  const transforms = ["f_auto", "q_auto"];
  if (width) transforms.push(`w_${width}`);

  return `${prefix}${transforms.join(",")}/${suffix}`;
};

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const productRating = product.rating || 5;

  return (
    <Link
      to={`/product/${product._id}`}
      className="block group"
      aria-label={product.name}
    >
      <div className="relative flex flex-col h-full bg-white border border-gray-100/90 rounded-2xl p-3 sm:p-4 transition-all duration-500 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-200 hover:-translate-y-1.5">
        {/* Product Image Container */}
        <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-gray-100 mb-4 group/image">
          {/* Image Loading Shimmer Placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-shimmer bg-gray-100 z-0" />
          )}

          {/* Main Image */}
          <img
            src={optimizeCloudinaryUrl(product.images?.[0]?.url, { width: 600 }) || fallback}
            alt={product.images?.[0]?.altText || product.name || "Product image"}
            onLoad={() => setImageLoaded(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out group-hover/image:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            } ${product.images?.[1] ? "group-hover/image:opacity-0" : ""}`}
            loading="lazy"
            decoding="async"
          />

          {/* Secondary Hover Image */}
          {product.images?.[1] && (
            <img
              src={optimizeCloudinaryUrl(product.images[1].url, { width: 600 })}
              alt="Hover View"
              className="absolute inset-0 w-full h-full object-cover opacity-0 transition-all duration-700 ease-out group-hover/image:opacity-100 group-hover/image:scale-105"
              loading="lazy"
              decoding="async"
            />
          )}

          {/* Best Seller / Hot Badge */}
          {product.isBestSeller && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 rounded-full shadow-md uppercase tracking-wider z-10">
              Best Seller
            </span>
          )}

          {/* Floating Action Button (Slide up) */}
          <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover/image:opacity-100 transition-all duration-300 pointer-events-none flex justify-center z-10">
            <span className="w-full text-center py-2.5 bg-white/95 backdrop-blur-md text-xs sm:text-sm font-extrabold text-gray-900 rounded-xl shadow-lg transform translate-y-3 group-hover/image:translate-y-0 transition-all duration-300 ease-out pointer-events-auto hover:bg-gray-950 hover:text-white">
              Xem Chi Tiết
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col flex-grow">
          {/* Category */}
          <span className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest mb-1">
            {product.category || "Rabbit Trend"}
          </span>

          {/* Name */}
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-emerald-600 transition-colors duration-300">
            {product.name}
          </h3>

          {/* Rating & Price Footer */}
          <div className="mt-auto pt-3 border-t border-gray-100/70 flex items-center justify-between">
            {/* Price */}
            <span className="text-sm sm:text-base font-black text-gray-900">
              ${product.price?.toLocaleString()}
            </span>

            {/* Rating Stars */}
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <AiFillStar
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < productRating ? "text-amber-400" : "text-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

const ProductGrid: React.FC<ProductGridProps> = ({ products, loading, error }) => {
  if (loading) return <ProductSkeleton count={8} />;

  if (error)
    return (
      <div className="p-8 text-center bg-red-50/50 border border-red-100 rounded-2xl my-4 text-red-600 font-bold text-sm">
        {error}
      </div>
    );

  if (!products || products.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400 font-medium">
        Không tìm thấy sản phẩm nào phù hợp.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
