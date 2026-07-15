import { useNavigate } from 'react-router-dom';
import mensCollectionImg from '../../../assets/mens-collection1.webp';
import womensCollectionImg from '../../../assets/womens-collection2.webp';

const GenderCollectionSection = () => {
  const navigate = useNavigate();

  const handleWomenClick = () => {
    navigate('/collections/all?gender=Women');
  };
  
  const handleMenClick = () => {
    navigate('/collections/all?gender=Men');
  };

  return (
    <section className="py-12 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="container mx-auto flex flex-col md:flex-row gap-6 lg:gap-8">
        
        {/* Women's Collection */}
        <div 
          onClick={handleWomenClick} 
          className="relative w-full md:w-1/2 group cursor-pointer rounded-2xl overflow-hidden shadow-lg aspect-[4/5] sm:aspect-[16/10] md:aspect-[3/4] lg:aspect-[4/5]"
        >
          {/* Zoom Image */}
          <img
            src={womensCollectionImg}
            alt="Women's Collection"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Subtle Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
          
          {/* Glassmorphic Content Card */}
          <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl transition-all duration-300 transform group-hover:translate-y-[-4px]">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              ELEGANT & CHIC
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mt-1 mb-2">
              Bộ Sưu Tập Nữ
            </h2>
            <p className="text-gray-200 text-sm font-light leading-relaxed mb-4">
              Khám phá các thiết kế váy đầm, áo kiểu và phụ kiện mang lại sự tự tin cho phái đẹp.
            </p>
            <span className="inline-flex items-center text-white text-sm font-semibold group-hover:underline">
              Khám phá ngay
              <svg className="w-4 h-4 ml-2 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>

        {/* Men's Collection */}
        <div 
          onClick={handleMenClick} 
          className="relative w-full md:w-1/2 group cursor-pointer rounded-2xl overflow-hidden shadow-lg aspect-[4/5] sm:aspect-[16/10] md:aspect-[3/4] lg:aspect-[4/5]"
        >
          {/* Zoom Image */}
          <img
            src={mensCollectionImg}
            alt="Men's Collection"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Subtle Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 group-hover:opacity-90" />
          
          {/* Glassmorphic Content Card */}
          <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl transition-all duration-300 transform group-hover:translate-y-[-4px]">
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-400">
              URBAN & MINIMALIST
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mt-1 mb-2">
              Bộ Sưu Tập Nam
            </h2>
            <p className="text-gray-200 text-sm font-light leading-relaxed mb-4">
              Phong cách tối giản, lịch lãm với áo polo, thun và sơ mi phom dáng chuẩn mực.
            </p>
            <span className="inline-flex items-center text-white text-sm font-semibold group-hover:underline">
              Khám phá ngay
              <svg className="w-4 h-4 ml-2 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};

export default GenderCollectionSection;