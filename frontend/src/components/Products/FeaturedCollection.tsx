import React from "react";
import { Link } from "react-router-dom";
import Featured from "../../../assets/featured1.webp";

const FeaturedCollection: React.FC = () => {
  return (
    <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="container mx-auto flex flex-col-reverse lg:flex-row items-stretch bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl">
        {/* Left Content */}
        <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center text-center lg:text-left">
          {/* Badge */}
          <div className="mb-4">
            <span className="inline-block px-3.5 py-1.5 text-xs font-semibold tracking-widest text-emerald-400 uppercase bg-emerald-950/50 border border-emerald-500/20 rounded-full">
              Rabbit Exclusive
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-light text-zinc-400 mb-2 uppercase tracking-wide">
            Tiện lợi - Phong cách - Chất lượng
          </h2>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
            Thiết Kế Nổi Bật <br />
            <span className="text-emerald-400">Xu Hướng Mới</span>
          </h2>

          <p className="text-zinc-300 text-sm sm:text-base lg:text-lg font-light leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
            Khám phá những bộ trang phục chất lượng cao, mang tính ứng dụng vượt trội, kết hợp hoàn hảo giữa thời trang đương đại và công năng hàng ngày.
            Được chế tác tỉ mỉ để bạn luôn tự tin lôi cuốn trong mọi hoàn cảnh.
          </p>

          <div>
            <Link
              to="/collections/all"
              className="inline-flex items-center justify-center px-8 py-3.5 text-sm sm:text-base font-semibold text-black bg-white rounded-xl shadow-lg hover:bg-emerald-400 hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95 group"
            >
              Mua Ngay
              <svg
                className="w-4 h-4 ml-2 transition-transform duration-300 transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-0">
          <img
            src={Featured}
            alt="Featured Collection"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
            loading="lazy"
          />
          {/* Subtle Dark Left Overlay for integration on desktop */}
          <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-zinc-950 via-zinc-950/20 to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;
