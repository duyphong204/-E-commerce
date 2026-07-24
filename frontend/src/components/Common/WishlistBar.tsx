import React, { useEffect, useRef } from "react";
import { fetchWishlist, removeFromWishlist } from "../../redux/slices/wishlistSlice";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { IoMdClose } from "react-icons/io";
import fallback from "../../../assets/fallback.png";

interface WishlistBarProps {
  toggleWishlist: boolean;
  setToggleWishlist: (open: boolean) => void;
}

const WishlistBar: React.FC<WishlistBarProps> = ({ toggleWishlist, setToggleWishlist }) => {
  const dispatch = useAppDispatch();
  const { items: wishlist, loading } = useAppSelector((state) => state.wishList);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch wishlist when drawer is open
  useEffect(() => {
    if (toggleWishlist) {
      dispatch(fetchWishlist());
    }
  }, [toggleWishlist, dispatch]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToggleWishlist(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setToggleWishlist]);

  const handleRemove = (productId: string) => {
    dispatch(removeFromWishlist({ productId }));
  };

  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[28rem] h-full
      bg-white shadow-lg transform transition-transform duration-300 z-50 flex flex-col
      ${toggleWishlist ? "translate-x-0" : "translate-x-full"}`}
      ref={dropdownRef}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">Danh sách yêu thích</h2>
        <button onClick={() => setToggleWishlist(false)} aria-label="Đóng wishlist">
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-grow p-4 overflow-y-auto">
        {loading ? (
          <p className="text-gray-500">Đang tải...</p>
        ) : wishlist.length === 0 ? (
          <p className="text-gray-500">Chưa có sản phẩm yêu thích</p>
        ) : (
          <div className="flex flex-col gap-3">
            {wishlist.map((item, index) => {
              const imageUrl = item.images?.[0]?.url || item.images?.[0] || fallback;
              return (
                <div
                  key={item._id || index}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={typeof imageUrl === 'string' ? imageUrl : fallback}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded"
                      loading="lazy"
                      decoding="async"
                    />
                    <div>
                      <p className="font-medium text-sm text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                        {item.price?.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                    aria-label="Xóa khỏi yêu thích"
                  >
                    <IoMdClose className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistBar;
