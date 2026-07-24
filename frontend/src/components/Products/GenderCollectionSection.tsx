import React from "react";
import { useNavigate } from "react-router-dom";
import mensCollectionImg from "../../../assets/mens-collection1.webp";
import womensCollectionImg from "../../../assets/womens-collection2.webp";
import { ArrowUpRight } from "lucide-react";

const GenderCollectionSection: React.FC = () => {
  const navigate = useNavigate();

  const handleWomenClick = (): void => {
    navigate("/collections/all?gender=Women");
  };

  const handleMenClick = (): void => {
    navigate("/collections/all?gender=Men");
  };

  return (
    <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50/50 overflow-hidden">
      <div className="container mx-auto">
        {/* Premium Asymmetric Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-16">
          <span className="inline-flex items-center px-3.5 py-1.5 bg-white text-[10px] sm:text-xs font-bold uppercase tracking-widest text-emerald-600 rounded-full border border-emerald-100 shadow-sm mb-3.5">
            Khám phá danh mục
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Định Hình Phong Cách Riêng
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm md:text-base font-medium max-w-md mx-auto leading-relaxed">
            Lựa chọn thời trang được tuyển chọn kỹ lưỡng, mang đến sự tự tin và khác biệt cho mỗi ngày của bạn.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-8 max-w-6xl mx-auto">
          {/* Women's Collection Card */}
          <div
            onClick={handleWomenClick}
            className="relative w-full md:w-1/2 group cursor-pointer rounded-2xl md:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 aspect-[4/5] sm:aspect-[16/10] md:aspect-[3/4] lg:aspect-[4/5] border border-gray-100"
          >
            {/* Zoom Image */}
            <img
              src={womensCollectionImg}
              alt="Women's Collection"
              className="w-full h-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
              loading="lazy"
            />

            {/* Elegant Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 flex flex-col items-start">
              <span className="px-2.5 py-0.5 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-bold tracking-widest text-emerald-400 border border-white/10 uppercase mb-2.5">
                ELEGANT & CHIC
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-2 tracking-tight">
                Bộ Sưu Tập Nữ
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed mb-4 sm:mb-6 max-w-xs">
                Khám phá các thiết kế váy đầm, áo kiểu tinh tế giúp tôn vinh vẻ đẹp kiêu sa của bạn.
              </p>

              {/* Premium Floating Button */}
              <div className="inline-flex items-center gap-1.5 px-4.5 py-2.5 sm:px-6 sm:py-3.5 bg-white text-gray-900 text-xs sm:text-sm font-extrabold rounded-full shadow-lg group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 ease-out hover:scale-105 active:scale-95">
                Khám phá ngay
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-45" />
              </div>
            </div>
          </div>

          {/* Men's Collection Card */}
          <div
            onClick={handleMenClick}
            className="relative w-full md:w-1/2 group cursor-pointer rounded-2xl md:rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 aspect-[4/5] sm:aspect-[16/10] md:aspect-[3/4] lg:aspect-[4/5] border border-gray-100"
          >
            {/* Zoom Image */}
            <img
              src={mensCollectionImg}
              alt="Men's Collection"
              className="w-full h-full object-cover transition-transform duration-[1.5s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-105"
              loading="lazy"
            />

            {/* Elegant Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/30 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-95" />

            {/* Content Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 lg:p-10 flex flex-col items-start">
              <span className="px-2.5 py-0.5 bg-white/10 backdrop-blur-md rounded-full text-[9px] font-bold tracking-widest text-emerald-400 border border-white/10 uppercase mb-2.5">
                URBAN & MINIMALIST
              </span>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white mb-2 tracking-tight">
                Bộ Sưu Tập Nam
              </h3>
              <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed mb-4 sm:mb-6 max-w-xs">
                Định hình sự lịch lãm tối giản với phom dáng áo polo, thun và sơ mi nam tính chuẩn mực.
              </p>

              {/* Premium Floating Button */}
              <div className="inline-flex items-center gap-1.5 px-4.5 py-2.5 sm:px-6 sm:py-3.5 bg-white text-gray-900 text-xs sm:text-sm font-extrabold rounded-full shadow-lg group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 ease-out hover:scale-105 active:scale-95">
                Khám phá ngay
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-45" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;
