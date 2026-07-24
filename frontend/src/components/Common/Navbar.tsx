import React, { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useAppSelector } from "../../redux/store";

import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import WishlistBar from "./WishlistBar";

const Navbar: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState<boolean>(false);
  const [toggleWishlist, setToggleWishlist] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isCartBouncing, setIsCartBouncing] = useState<boolean>(false);

  const { cart } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const { items: wishlistItems } = useAppSelector((state) => state.wishList);

  const navigate = useNavigate();

  const cartItemCount = useMemo(
    () => cart?.products?.reduce((t, p) => t + p.quantity, 0) || 0,
    [cart]
  );
  const wishListItemCount = useMemo(() => wishlistItems?.length || 0, [wishlistItems]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (cartItemCount > 0) {
      setIsCartBouncing(true);
      const timer = setTimeout(() => setIsCartBouncing(false), 300);
      return () => clearTimeout(timer);
    }
  }, [cartItemCount]);

  const handleSearch = (term: string): void => {
    navigate(`/collections/all?search=${encodeURIComponent(term)}`);
  };

  return (
    <>
      {/* ================= Navbar ================= */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent ${
          isScrolled
            ? "bg-white/80 backdrop-blur-md shadow-sm py-2 border-gray-100/80"
            : "bg-white py-3.5 sm:py-5"
        }`}
      >
        <nav className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-black tracking-widest text-gray-900 flex-shrink-0"
          >
            RABBIT<span className="text-emerald-500">.</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6 flex-1 justify-center">
            {[
              { path: "/collections/all?gender=Men", label: "Nam" },
              { path: "/collections/all?gender=Women", label: "Nữ" },
              { path: "/collections/all?category=Top Wear", label: "Áo" },
              { path: "/collections/all?category=Bottom Wear", label: "Quần" },
              { path: "/about", label: "Về Rabbit" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.path}
                className="text-xs font-bold text-gray-500 hover:text-emerald-500 uppercase tracking-wider transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Icons + Search */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search - Mobile & Desktop */}
            <div className="w-[140px] sm:w-[180px] lg:w-[220px]">
              <SearchBar onSearch={handleSearch} />
            </div>

            {/* Admin Badge */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg hidden md:block transition-colors uppercase tracking-wider shadow-sm"
              >
                Admin
              </Link>
            )}

            {/* Desktop Icons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/profile"
                className="text-gray-700 hover:text-emerald-500 hover:scale-105 active:scale-95 transition-all"
                title="Trang cá nhân"
              >
                <User className="w-5 h-5" />
              </Link>

              {user && (
                <button
                  onClick={() => setToggleWishlist(!toggleWishlist)}
                  className="relative text-gray-700 hover:text-emerald-500 hover:scale-105 active:scale-95 transition-all"
                  title="Danh sách yêu thích"
                  aria-label="Danh sách yêu thích"
                >
                  <Heart className="w-5 h-5" />
                  {wishListItemCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {wishListItemCount > 9 ? "9+" : wishListItemCount}
                    </span>
                  )}
                </button>
              )}

              <button
                onClick={() => setDrawerOpen(!drawerOpen)}
                className={`relative text-gray-700 hover:text-emerald-500 hover:scale-105 active:scale-95 transition-all ${
                  isCartBouncing ? "scale-110 text-emerald-500" : ""
                }`}
                title="Giỏ hàng"
                aria-label="Giỏ hàng"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <span
                    className={`absolute -top-1.5 -right-1.5 bg-emerald-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center transition-transform ${
                      isCartBouncing ? "scale-110" : ""
                    }`}
                  >
                    {cartItemCount > 9 ? "9+" : cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setNavDrawerOpen(true)}
              className="md:hidden text-gray-700 active:scale-95 transition-transform p-1"
              aria-label="Mở menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      {/* Spacer to prevent content jump */}
      <div className="h-[76px] sm:h-[92px]" />

      {/* ================= Mobile Floating Bottom Bar ================= */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 py-2.5 z-40 md:hidden shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <div className="flex items-center justify-around">
          {/* Admin */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="flex flex-col items-center text-gray-500 hover:text-emerald-500"
            >
              <div className="w-5 h-5 text-white rounded-lg bg-emerald-500 flex items-center justify-center font-bold text-[9px]">
                AD
              </div>
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">Admin</span>
            </Link>
          )}

          {/* User */}
          <Link
            to="/profile"
            className="flex flex-col items-center text-gray-500 hover:text-emerald-500"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">Tài khoản</span>
          </Link>

          {/* Wishlist */}
          {user && (
            <button
              onClick={() => setToggleWishlist(!toggleWishlist)}
              className="flex flex-col items-center text-gray-500 hover:text-emerald-500 relative"
            >
              <Heart className="w-5 h-5" />
              {wishListItemCount > 0 && (
                <span className="absolute top-0 right-2 bg-emerald-500 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {wishListItemCount > 9 ? "9+" : wishListItemCount}
                </span>
              )}
              <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">Yêu thích</span>
            </button>
          )}

          {/* Cart */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="flex flex-col items-center text-gray-500 hover:text-emerald-500 relative"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-2 bg-emerald-500 text-white text-[8px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {cartItemCount > 9 ? "9+" : cartItemCount}
              </span>
            )}
            <span className="text-[10px] font-bold mt-1 uppercase tracking-tight">Giỏ hàng</span>
          </button>
        </div>
      </div>

      {/* Drawers */}
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={() => setDrawerOpen(false)} />
      <WishlistBar toggleWishlist={toggleWishlist} setToggleWishlist={setToggleWishlist} />

      {/* Mobile Nav Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 md:hidden ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-5 border-b border-gray-50">
          <Link
            to="/"
            onClick={() => setNavDrawerOpen(false)}
            className="text-lg font-black tracking-widest text-gray-900"
          >
            RABBIT<span className="text-emerald-500">.</span>
          </Link>
          <button
            onClick={() => setNavDrawerOpen(false)}
            className="p-1 rounded-lg hover:bg-gray-50"
            aria-label="Đóng menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <nav className="px-6 py-6 space-y-4">
          {[
            { path: "/collections/all?gender=Men", label: "Thời trang Nam" },
            { path: "/collections/all?gender=Women", label: "Thời trang Nữ" },
            { path: "/collections/all?category=Top Wear", label: "Các loại Áo" },
            { path: "/collections/all?category=Bottom Wear", label: "Các loại Quần" },
            { path: "/about", label: "Về Rabbit" },
          ].map((link) => (
            <Link
              key={link.label}
              to={link.path}
              onClick={() => setNavDrawerOpen(false)}
              className="block text-sm font-bold text-gray-700 hover:text-emerald-500 uppercase tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
