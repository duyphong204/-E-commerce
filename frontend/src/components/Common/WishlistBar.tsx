import React, { useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

interface WishlistBarProps {
  toggleWishlist: boolean;
  setToggleWishlist: (open: boolean) => void;
}

export function WishlistBar({ toggleWishlist, setToggleWishlist }: WishlistBarProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setToggleWishlist(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setToggleWishlist]);

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
        <p className="text-gray-500">Chưa có sản phẩm yêu thích</p>
      </div>
    </div>
  );
}

export default WishlistBar;
