import { useEffect, useState, FormEvent } from "react";
import loginImg from "../../assets/login.webp";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { loginApi, useAuthStore } from "@/features/auth";
import { NotificationService } from "../utils/notificationService";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { getErrorMessage } from "@/shared/utils/error-utils";

export function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { user, setAuth } = useAuthStore();

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/", { replace: true });
      }
    }
  }, [user, navigate, isCheckoutRedirect]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await loginApi({ email, password });
      setAuth(response.user, response.token || response.accessToken);
      const userName = response.user.name || "bạn";
      NotificationService.success(`Chào mừng ${userName} trở lại!`);

      if (response.user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate(isCheckoutRedirect ? "/checkout" : "/", { replace: true });
      }
    } catch (error: unknown) {
      NotificationService.error(getErrorMessage(error, "Đăng nhập thất bại. Vui lòng kiểm tra lại."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] bg-gray-50/50">
      {/* Form Column */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-4 sm:p-8 lg:p-12">
        <div className="w-full max-w-md bg-white p-6 sm:p-10 rounded-2xl sm:rounded-[2rem] border border-gray-100 shadow-sm transition-all hover:shadow-md">
          {/* Logo & Header */}
          <div className="text-center mb-6 sm:mb-8">
            <Link to="/" className="text-2xl sm:text-3xl font-black tracking-widest text-gray-900">
              RABBIT<span className="text-emerald-500">.</span>
            </Link>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-4 sm:mt-6 mb-1.5">Chào mừng trở lại!</h2>
            <p className="text-gray-400 text-xs sm:text-sm font-semibold">
              Đăng nhập để tiếp tục trải nghiệm cùng Rabbit.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Email Input */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">
                Địa chỉ Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4.5 h-4.5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300"
                  placeholder="your-email@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-gray-700 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4.5 h-4.5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-2.5 sm:py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-950 text-white py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base hover:bg-emerald-600 transition-all duration-300 shadow-md hover:shadow-emerald-500/10 active:scale-[0.98] disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? "Đang xử lý..." : "Đăng Nhập"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            {/* Footer Link */}
            <p className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-400 font-bold">
              Chưa có tài khoản?{" "}
              <Link
                to={`/register?redirect=${encodeURIComponent(redirect)}`}
                className="text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Cover Column */}
      <div className="hidden md:block w-1/2 relative bg-gray-900 overflow-hidden">
        <img
          src={loginImg}
          alt="Login to account"
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/20 to-transparent" />

        {/* Brand Overlay Text */}
        <div className="absolute bottom-12 left-12 right-12 text-white max-w-sm">
          <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-widest border border-white/10 uppercase mb-3.5 inline-block">
            Rabbit Minimalist
          </span>
          <h3 className="text-3xl font-extrabold tracking-tight mb-3 leading-tight">
            Nâng tầm tủ đồ thời trang của bạn
          </h3>
          <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed">
            Khám phá những thiết kế mới nhất với phong cách tối giản thanh lịch, tôn vinh cá tính độc bản của bạn.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
