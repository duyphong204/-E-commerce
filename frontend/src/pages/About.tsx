import React from "react";
import { Compass, ShieldCheck, Heart, Users, Sparkles, Award } from "lucide-react";

export function About() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden font-sans">
      {/* 1. Hero Section */}
      <section className="relative py-20 sm:py-28 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30 border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-700 text-xs font-bold tracking-widest uppercase rounded-full border border-emerald-500/20 mb-6 inline-block">
            Về chúng tôi
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-gray-950 max-w-4xl mx-auto leading-[1.1] mb-6 sm:mb-8">
            Kiến tạo phong cách tối giản & <span className="text-emerald-500">thời thượng</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            Chúng tôi tự hào là thương hiệu thời trang tiên phong mang đến các giải pháp tủ đồ tối giản hiện đại cho thế hệ trẻ năng động, tự tin khẳng định cá tính.
          </p>
        </div>
      </section>

      {/* 2. Stats Section */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              { label: "Năm thành lập", val: "2020" },
              { label: "Khách hàng hài lòng", val: "50K+" },
              { label: "Sản phẩm thiết kế", val: "1.2K+" },
              { label: "Cửa hàng đại diện", val: "05" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all duration-300"
              >
                <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-950 mb-1">
                  {stat.val}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Core Values Section */}
      <section className="py-16 sm:py-24 bg-gray-50/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 tracking-tight mb-4">
              Giá trị cốt lõi làm nên thương hiệu
            </h2>
            <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xl mx-auto">
              Những tiêu chí tối quan trọng giúp Rabbit luôn nhận được sự tin yêu bền vững từ quý khách hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
                title: "Chất lượng thượng hạng",
                desc: "100% sợi tự nhiên được tuyển chọn kỹ lưỡng, quy trình dệt may kiểm soát gắt gao nhằm mang lại sự thoải mái nhất.",
              },
              {
                icon: <Compass className="w-6 h-6 text-emerald-600" />,
                title: "Định hướng phong cách",
                desc: "Mẫu mã thời trang độc bản, bắt kịp mọi xu hướng tối giản hóa tủ đồ thường nhật (capsule wardrobe).",
              },
              {
                icon: <Heart className="w-6 h-6 text-emerald-600" />,
                title: "Cam kết bền vững",
                desc: "Thân thiện với môi trường, hạn chế tối đa lượng hóa chất nhuộm và ưu tiên các nguyên vật liệu tái chế xanh.",
              },
            ].map((value, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-xl hover:shadow-gray-100/50 hover:border-gray-200 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive Founder Story & Map */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 sm:gap-16 items-center">
            {/* Story */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-8">
              <div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold tracking-widest uppercase rounded-full mb-3.5 inline-block">
                  Câu chuyện sáng lập
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-950 tracking-tight leading-tight">
                  Khởi nguồn từ niềm đam mê chất liệu vải
                </h2>
              </div>
              <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
                Xin chào, tôi là <strong>Phong</strong> – Người đồng sáng lập RABBIT. Tôi bắt đầu hành trình từ năm 2020 khi nhận thấy thị trường thiếu vắng những sản phẩm thời trang vừa có độ bền vượt trội, vừa có thiết kế tối giản dễ ứng dụng hằng ngày.
              </p>
              <p className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
                Mỗi thiết kế từ Rabbit không đơn thuần là món đồ thời trang, mà là lời cam kết về phong cách sống tự do, nhẹ nhàng, giải phóng bản thân khỏi những bộ trang phục rườm rà không cần thiết.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-800">100% Độc Bản</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-gray-800">Dịch Vụ Tận Tâm</span>
                </div>
              </div>
            </div>

            {/* Interactive Map Embed */}
            <div className="lg:col-span-6">
              <div className="bg-gray-50 rounded-3xl overflow-hidden border border-gray-100 shadow-lg relative aspect-video sm:aspect-square w-full lg:max-h-[460px]">
                <iframe
                  title="Rabbit Store Map Location"
                  src="https://maps.google.com/maps?q=508+%C4%90%C6%B0%E1%BB%9Dng+3%2F2%2C+Ph%C6%B0%E1%BB%9Dng+14%2C+Qu%E1%BA%ADn+10%2C+TP+H%E1%BB%93+Ch%C3%AD+Minh&output=embed&z=16"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-[15%] hover:grayscale-0 transition-all duration-500"
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 gap-3.5 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">📍 Trụ sở chính tại TP. Hồ Chí Minh</h4>
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">508 Đường 3/2, Quận 10, Thành phố Hồ Chí Minh</p>
                </div>
                <a
                  href="https://maps.app.goo.gl/o1H52q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gray-950 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-colors shadow-sm"
                >
                  Chỉ đường
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Contact Banner */}
      <section className="bg-gray-950 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-950/40 via-gray-900 to-gray-950 pointer-events-none" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mb-4">
            Đồng hành cùng phong cách của bạn
          </h2>
          <p className="text-gray-400 font-medium text-sm sm:text-base max-w-lg mx-auto mb-8 sm:mb-10 leading-relaxed">
            Chúng tôi luôn lắng nghe để cải tiến từng ngày. Liên hệ trực tiếp nếu bạn có bất kỳ thắc mắc hoặc đề xuất hợp tác nào.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm font-bold">
            <span className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl w-full sm:w-auto">
              📞 Hotline: 093.545.2263
            </span>
            <span className="px-5 py-3 bg-white/5 border border-white/10 rounded-2xl w-full sm:w-auto">
              ✉️ Email: contact@rabbit.com
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
