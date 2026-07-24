import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";
import fallback from "../../../assets/fallback.png";
import "swiper/css";
import { fetchNewArrivalsProducts } from "../../redux/slices/productsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";

const NewArrivals: React.FC = () => {
  const dispatch = useAppDispatch();
  const { newArrivalsProducts: products, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchNewArrivalsProducts());
  }, [dispatch]);

  const hasEnoughSlides = products.length >= 3;

  return (
    <section className="py-10 lg:py-14 bg-gray-50/40">
      <div className="container mx-auto px-4">
        {/* Tiêu đề */}
        <div className="text-center mb-8">
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
            New Arrivals
          </span>
          <h2 className="text-2xl lg:text-3xl font-extrabold text-gray-900 mt-2">SẢN PHẨM MỚI</h2>
          <p className="text-sm lg:text-base text-gray-500 mt-2 max-w-xl mx-auto font-light">
            <span className="font-semibold text-rose-500">Hot trend 2025</span> – Cập nhật ngay hôm nay, dẫn đầu phong cách ngày mai.
          </p>
        </div>

        {/* Loading Skeleton state for Swiper */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="aspect-[4/5] rounded-2xl animate-shimmer bg-gray-100 p-4 flex flex-col justify-end">
                <div className="w-20 h-4 bg-gray-200/80 rounded mb-2" />
                <div className="w-12 h-4 bg-gray-200/80 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <Swiper
            modules={[Navigation, Autoplay, FreeMode]}
            navigation={{ prevEl: "#prev", nextEl: "#next" }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop={hasEnoughSlides}
            freeMode={{ enabled: true, momentum: true }}
            grabCursor={true}
            spaceBetween={16}
            slidesPerView="auto"
            className="!overflow-hidden !py-2"
          >
            {products.map((p) => (
              <SwiperSlide key={p._id} className="!w-[80%] sm:!w-[50%] lg:!w-[28%] !h-auto">
                <Link to={`/product/${p._id}`} className="block group">
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100 transition-transform duration-500 group-hover:-translate-y-1 group-hover:shadow-lg">
                    <img
                      src={p.images?.[0]?.url || fallback}
                      alt={p.images?.[0]?.altText || p.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md z-10">
                      New
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-gray-950/80 via-gray-900/40 to-transparent">
                      <h3 className="text-white font-bold text-sm line-clamp-2 leading-snug group-hover:text-emerald-300 transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-white font-black text-sm mt-1.5">
                        ${p.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
