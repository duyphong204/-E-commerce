import { LayoutDashboard, Users, Box, Image as ImageIcon, TicketPercent, ClipboardList, LogOut } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import { logoutUser } from "../../redux/slices/authSlice";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(clearCart());
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-slate-800 text-white py-3 px-4 rounded-xl flex items-center space-x-3 transition-colors shadow-sm"
      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 py-3 px-4 rounded-xl flex items-center space-x-3 transition-colors";

  return (
    <div className="p-6 flex flex-col min-h-screen">
      {/* Brand */}
      <div className="mb-10 text-center">
        <Link to="/admin" className="text-3xl font-black tracking-widest text-white">
          RABBIT<span className="text-blue-500">.</span>
        </Link>
        <p className="text-xs text-slate-500 uppercase tracking-widest mt-1 font-semibold">Admin Panel</p>
      </div>

      {/* Nav Links */}
      <nav className="flex flex-col space-y-2 flex-grow">
        <NavLink to="/admin" end className={linkClass}>
          <LayoutDashboard className="w-5 h-5" />
          <span className="font-medium">Tổng quan</span>
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          <Users className="w-5 h-5" />
          <span className="font-medium">Người dùng</span>
        </NavLink>

        <NavLink to="/admin/products" className={linkClass}>
          <Box className="w-5 h-5" />
          <span className="font-medium">Sản phẩm</span>
        </NavLink>

        <NavLink to="/admin/banners" className={linkClass}>
          <ImageIcon className="w-5 h-5" />
          <span className="font-medium">Banner</span>
        </NavLink>

        <NavLink to="/admin/coupon" className={linkClass}>
          <TicketPercent className="w-5 h-5" />
          <span className="font-medium">Khuyến mãi</span>
        </NavLink>

        <NavLink to="/admin/orders" className={linkClass}>
          <ClipboardList className="w-5 h-5" />
          <span className="font-medium">Đơn hàng</span>
        </NavLink>
      </nav>

      {/* Logout */}
      <div className="mt-auto pt-6 pb-20 md:pb-6 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 py-3 px-4 rounded-xl flex items-center justify-center space-x-2 transition-colors font-medium active:scale-95"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
