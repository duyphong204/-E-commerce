import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { fetchActiveBanners } from "../../redux/slices/bannerSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import hero1 from "../../../assets/rabbit-hero4.webp";
import hero2 from "../../../assets/rabbit-hero3.webp";
import hero3 from "../../../assets/rabbit-hero5.webp";

interface HeroSlideItem {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
}

const FALLBACK_IMAGES: HeroSlideItem[] = [
  {
    src: hero1,
    alt: "Thời trang nam cao cấp - Bộ sưu tập mới nhất 2025",
    title: "BỘ SƯU TẬP MỚI 2025",
    subtitle: "Dẫn đầu phong cách thời thượng với những thiết kế may đo cao cấp và chất lượng vượt trội.",
    cta: "Mua Ngay",
    link: "/collections/all",
  },
  {
    src: hero2,
    alt: "Phong cách hiện đại - Áo thun, polo, sơ mi nam",
    title: "PHONG CÁCH TỐI GIẢN",
    subtitle: "Sự tinh tế đến từ những chi tiết nhỏ nhất. Đơn giản, lịch lãm nhưng đầy cuốn hút.",
    cta: "Khám Phá",
    link: "/collections/all",
  },
  {
    src: hero3,
    alt: "Ưu đãi đặc biệt - Giảm tới 50% cho khách hàng mới",
    title: "ƯU ĐÃI ĐẶC BIỆT",
    subtitle: "Chào đón thành viên mới – Nhập mã WELCOME giảm ngay 50% cho đơn hàng đầu tiên.",
    cta: "Nhận Ưu Đãi",
    link: "/collections/all",
  },
];

const optimizeCloudinaryUrl = (url: string, { width }: { width?: number } = {}): string => {
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

const Hero: React.FC = () => {
  const dispatch = useAppDispatch();
  const { banners } = useAppSelector((state) => state.banners);

  useEffect(() => {
    dispatch(fetchActiveBanners());
  }, [dispatch]);

  const images: HeroSlideItem[] = banners.length
    ? banners.map(({ imageUrl, altText, title, link }) => ({
        src: optimizeCloudinaryUrl(imageUrl, { width: 1600 }),
        alt: altText || title || "Banner",
        title: title || "PHONG CÁCH THỜI THƯỢNG",
        subtitle: altText || "Khám phá các thiết kế mới nhất của Rabbit Shop.",
        cta: "Xem Ngay",
        link: link || "/collections/all",
      }))
    : FALLBACK_IMAGES;

  return (
    <section aria-label="Hero banner" className="relative w-full h-[50vh] sm:h-[60vh] md:h-[80vh] lg:h-[90vh] overflow-hidden bg-black">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        speed={1000}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet !bg-white/40 !w-3 !h-3 !mx-1 transition-all duration-300",
          bulletActiveClass: "swiper-pagination-bullet-active !bg-emerald-400 !w-8 !rounded-full",
        }}
        grabCursor
        className="w-full h-full"
      >
        {images.map((image, idx) => (
          <SwiperSlide key={idx} className="overflow-hidden">
            <div className="relative w-full h-full">
              {/* Image */}
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover scale-100 animate-[zoomSlow_15s_infinite_alternate] brightness-75 md:brightness-[0.70]"
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={idx === 0 ? "high" : "low"}
              />

              {/* Modern Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />

              {/* Text & Button content */}
              <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-20 lg:px-32 text-left z-20">
                <div className="max-w-2xl space-y-4 sm:space-y-6">
                  {/* Glassmorphic Badge */}
                  <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-widest text-emerald-400 uppercase bg-emerald-950/30 border border-emerald-500/20 rounded-full backdrop-blur-md">
                    RABBIT PREMIUM COLLECTION
                  </span>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] drop-shadow-md">
                    {image.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-lg md:text-xl text-gray-200 font-light leading-relaxed max-w-lg drop-shadow-sm">
                    {image.subtitle}
                  </p>

                  {/* Premium Button */}
                  <div className="pt-2 sm:pt-4">
                    <a
                      href={image.link || "/collections/all"}
                      className="inline-flex items-center justify-center px-8 py-3.5 text-sm sm:text-base font-semibold text-black bg-white rounded-xl shadow-xl hover:bg-emerald-400 hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95 group"
                    >
                      {image.cta}
                      <svg
                        className="w-4 h-4 ml-2 transition-transform duration-300 transform group-hover:translate-x-1"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
