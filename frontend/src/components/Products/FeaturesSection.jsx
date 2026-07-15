import { HiOutlineCreditCard, HiShoppingBag } from "react-icons/hi";
import { HiMiniArrowPathRoundedSquare } from "react-icons/hi2";

const FeaturesSection = () => {
  const features = [
    {
      icon: <HiShoppingBag className="w-8 h-8 text-emerald-400" />,
      title: "MIỄN PHÍ VẬN CHUYỂN",
      description: "Áp dụng cho mọi đơn hàng giá trị từ 100.000 ₫",
      badge: "Toàn Quốc"
    },
    {
      icon: <HiMiniArrowPathRoundedSquare className="w-8 h-8 text-emerald-400" />,
      title: "45 NGÀY TRẢ HÀNG",
      description: "Hỗ trợ đổi trả nhanh chóng, cam kết hoàn tiền 100%",
      badge: "Không Phí"
    },
    {
      icon: <HiOutlineCreditCard className="w-8 h-8 text-emerald-400" />,
      title: "THANH TOÁN AN TOÀN",
      description: "Bảo mật thông tin tối đa bằng chứng chỉ SSL mã hóa",
      badge: "100% An Toàn"
    }
  ];

  return (
    <section className="py-12 lg:py-16 px-4 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {features.map((feature, idx) => (
            <div 
              key={idx} 
              className="relative flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md hover:translate-y-[-4px] overflow-hidden group"
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 left-0 w-full h-[3px] bg-transparent group-hover:bg-emerald-400 transition-colors duration-300" />
              
              {/* Icon Container with animation */}
              <div className="p-4 bg-emerald-50 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              
              {/* Title */}
              <h4 className="text-sm font-bold text-gray-900 tracking-wider mb-2">
                {feature.title}
              </h4>
              
              {/* Description */}
              <p className="text-gray-500 text-xs sm:text-sm font-light leading-relaxed mb-4 max-w-[240px]">
                {feature.description}
              </p>
              
              {/* Tiny Badge */}
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 bg-emerald-50 rounded-full">
                {feature.badge}
              </span>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
