import { Link } from "react-router-dom";
import fallback from '../../../assets/fallback.png';
import { AiFillStar } from "react-icons/ai";
import Loading from "../Common/Loading";

const optimizeCloudinaryUrl = (url, { width } = {}) => {
  if (!url || typeof url !== "string") return url;
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

const ProductGrid = ({ products, loading, error }) => {
  if (loading) return <Loading />;
  if (error) return <div className="p-6 text-center text-red-500 font-semibold">{error}</div>;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
      {products && products.map((product) => {
        const productRating = product.rating || 5;
        
        return (
          <Link
            key={product._id}
            to={`/product/${product._id}`}
            className="block group"
            aria-label={product.name}
          >
            <div className="relative flex flex-col h-full bg-white border border-gray-100 rounded-2xl p-3 sm:p-4 transition-all duration-300 hover:shadow-lg hover:border-gray-200/80 hover:translate-y-[-4px]">
              
              {/* Product Image Container */}
              <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-gray-50 mb-4">
                <img
                  src={optimizeCloudinaryUrl(product.images?.[0]?.url, { width: 600 }) || fallback}
                  alt={product.images?.[0]?.altText || product.name || "Product image"}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
                
                {/* Sale / Hot Badge */}
                {product.isBestSeller && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-bold text-white bg-red-500 rounded-full shadow-sm uppercase tracking-wide">
                    Best Seller
                  </span>
                )}
                
                {/* Floating "View Details" overlay on hover */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="px-4 py-2 bg-white/95 backdrop-blur-sm text-xs font-bold text-gray-900 rounded-xl shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    Xem Chi Tiết
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col flex-grow">
                {/* Brand / Category if any - fallback to 'New Trend' */}
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-1">
                  {product.category || "Rabbit Trend"}
                </span>

                {/* Product Name */}
                <h3 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-emerald-500 transition-colors duration-300">
                  {product.name}
                </h3>

                {/* Rating & Price */}
                <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
                  {/* Price */}
                  <span className="text-sm sm:text-base font-extrabold text-gray-900">
                    ${product.price.toLocaleString()}
                  </span>

                  {/* Star Rating */}
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <AiFillStar
                        key={i}
                        className={`w-3.5 h-3.5 ${i < productRating ? "text-amber-400" : "text-gray-200"}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
