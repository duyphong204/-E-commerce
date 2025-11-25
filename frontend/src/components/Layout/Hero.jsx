import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveBanners } from "../../redux/slices/bannerSlice";
import "swiper/css";
import hero1 from "../../../assets/rabbit-hero4.webp";
import hero2 from "../../../assets/rabbit-hero3.webp";
import hero3 from "../../../assets/rabbit-hero5.webp";
import Loading from "../Common/Loading";

// Fallback images nếu chưa có banner trong DB
const FALLBACK_IMAGES = [
  { src: hero1, alt: "Thời trang nam cao cấp - Bộ sưu tập mới nhất 2025" },
  { src: hero2, alt: "Phong cách hiện đại - Áo thun, polo, sơ mi nam" },
  { src: hero3, alt: "Ưu đãi đặc biệt - Giảm tới 50% cho khách hàng mới" },
];

const Hero = () => {
  const dispatch = useDispatch();
  const { banners, loading } = useSelector((state) => state.banners);

  useEffect(() => {
    dispatch(fetchActiveBanners());
  }, [dispatch]);

  const images = banners.length ?
    banners.map(({ imageUrl, altText, title }) => ({ src: imageUrl, alt: altText || title }))
    : FALLBACK_IMAGES;

  if (loading) return <Loading />;

  return (
    <section aria-label="Hero banner" className="overflow-hidden h-[32vh] sm:h-[40vh] md:h-[70vh] lg:h-[85vh]">
      <Swiper
        modules={[Autoplay]}
        loop
        autoplay={{ delay: 3500, disableOnInteraction: false }}
        speed={800}
        grabCursor
        slidesPerView={1}
        className="w-full h-full"
      >
        {images.map((image, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-full">
              <img
                src={image.src}
                alt={image.alt}
                className="absolute inset-0 w-full h-full object-cover will-change-transform"
                loading={idx === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={idx === 0 ? "high" : "low"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Hero;
