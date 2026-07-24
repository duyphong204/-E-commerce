import React from "react";
import { Link } from "react-router-dom";
import { Instagram, Twitter, Facebook, PhoneCall, Mail, ArrowRight } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-100/80 pt-16 pb-8">
      {/* Main Content Grid */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-gray-100">
          {/* Brand Info Column */}
          <div className="space-y-5">
            <Link to="/" className="text-xl sm:text-2xl font-extrabold tracking-widest text-gray-900">
              RABBIT<span className="text-emerald-500">.</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              Thương hiệu thời trang tối giản hàng đầu, mang đến những thiết kế tinh tế và phong cách bền vững cho thế hệ mới.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-emerald-500 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4.5 h-4.5" />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-emerald-500 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4.5 h-4.5" />
              </a>
              <a
                href="#"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-600 hover:bg-emerald-500 hover:text-white hover:scale-110 active:scale-95 transition-all duration-300"
                aria-label="Twitter"
              >
                <Twitter className="w-4.5 h-4.5" />
              </a>
            </div>
          </div>

          {/* Shop Links Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Cửa hàng</h3>
            <ul className="space-y-2.5 text-gray-500 text-sm font-medium">
              <li>
                <Link to="/collections/all?gender=Men" className="hover:text-emerald-500 hover:underline underline-offset-4 transition-colors">
                  Thời Trang Nam
                </Link>
              </li>
              <li>
                <Link to="/collections/all?gender=Women" className="hover:text-emerald-500 hover:underline underline-offset-4 transition-colors">
                  Thời Trang Nữ
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-emerald-500 hover:underline underline-offset-4 transition-colors">
                  Bộ Sưu Tập Mới
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-emerald-500 hover:underline underline-offset-4 transition-colors">
                  Sản Phẩm Bán Chạy
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2.5 text-gray-500 text-sm font-medium">
              <li>
                <Link to="#" className="hover:text-emerald-500 hover:underline underline-offset-4 transition-colors">
                  Liên Hệ Với Chúng Tôi
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-500 hover:underline underline-offset-4 transition-colors">
                  Về Chúng Tôi
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-emerald-500 hover:underline underline-offset-4 transition-colors">
                  Câu Hỏi Thường Gặp (FAQs)
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-emerald-500 hover:underline underline-offset-4 transition-colors">
                  Chính Sách Đổi Trả
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Contact Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">Bản tin Rabbit</h3>
            <p className="text-gray-500 text-sm leading-relaxed font-medium">
              Đăng ký nhận thông tin để nhận ngay ưu đãi giảm giá 10% cho đơn hàng đầu tiên của bạn.
            </p>

            {/* Newsletter Form */}
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Email của bạn..."
                className="px-4 py-2.5 text-sm w-full bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300"
                required
              />
              <button
                type="submit"
                className="bg-gray-950 text-white p-2.5 rounded-xl hover:bg-emerald-500 active:scale-95 transition-all duration-300 shadow-sm"
                aria-label="Đăng ký bản tin"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            {/* Contact details */}
            <div className="pt-3 space-y-2 text-xs text-gray-500 font-medium">
              <p className="flex items-center gap-2">
                <PhoneCall className="w-4.5 h-4.5 text-emerald-500" />
                <span>+84 935 452 263</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4.5 h-4.5 text-emerald-500" />
                <span>support@rabbit.com</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8">
          <p className="text-gray-400 text-xs font-semibold tracking-tight text-center sm:text-left">
            © {new Date().getFullYear()} Rabbit Fashion. Bảo lưu mọi quyền.
          </p>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
            <a href="#" className="hover:text-gray-600 transition-colors">
              Điều khoản dịch vụ
            </a>
            <span>•</span>
            <a href="#" className="hover:text-gray-600 transition-colors">
              Chính sách bảo mật
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
