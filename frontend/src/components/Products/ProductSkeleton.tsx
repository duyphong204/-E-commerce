import React from "react";

interface ProductSkeletonProps {
  count?: number;
}

const ProductSkeleton: React.FC<ProductSkeletonProps> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white border border-gray-100/80 rounded-2xl p-3 sm:p-4 flex flex-col h-full shadow-sm relative overflow-hidden"
        >
          {/* Skeleton Image Box */}
          <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 animate-shimmer bg-gray-100">
            {/* Top Left Badge Skeleton */}
            <div className="absolute top-3 left-3 w-16 h-5 rounded-full bg-gray-200/70" />
          </div>

          {/* Skeleton Details */}
          <div className="flex flex-col flex-grow">
            {/* Category Pill Skeleton */}
            <div className="w-16 h-3 rounded-md animate-shimmer bg-gray-100 mb-2" />

            {/* Title Line 1 */}
            <div className="w-full h-4 rounded-md animate-shimmer bg-gray-100 mb-1.5" />

            {/* Title Line 2 */}
            <div className="w-3/4 h-4 rounded-md animate-shimmer bg-gray-100 mb-4" />

            {/* Price & Rating Footer Skeleton */}
            <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
              {/* Price Skeleton */}
              <div className="w-16 h-5 rounded-md animate-shimmer bg-gray-100" />

              {/* Star Rating Skeleton */}
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-3.5 h-3.5 rounded-full animate-shimmer bg-gray-100" />
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
