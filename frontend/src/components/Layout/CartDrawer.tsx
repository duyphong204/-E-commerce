import React from "react";
import { IoMdClose } from "react-icons/io";
import CartContent from "../Cart/CartContents";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/store";

interface CartDrawerProps {
  drawerOpen: boolean;
  toggleCartDrawer: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { user, guestId } = useAppSelector((state) => state.auth);
  const { cart } = useAppSelector((state) => state.cart);

  const userId = user ? user._id : null;

  const handleCheckout = (): void => {
    toggleCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <>
      {/* Overlay Back-drop */}
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ease-in-out"
          onClick={toggleCartDrawer}
        />
      )}
      <div
        className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[30rem] h-full
          bg-white shadow-2xl transform 
          transition-transform duration-300 ease-in-out flex flex-col z-50
          ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Close button */}
        <div className="flex justify-end p-4">
          <button onClick={() => toggleCartDrawer()} aria-label="Đóng giỏ hàng">
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        {/* Cart content with scrollable area */}
        <div className="flex-grow p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Giỏ hàng của bạn</h2>
          {cart && cart.products && cart.products.length > 0 ? (
            <CartContent cart={cart} userId={userId} guestId={guestId} />
          ) : (
            <p className="text-gray-500 text-sm">Giỏ hàng của bạn trống.</p>
          )}
        </div>

        {/* Checkout button fixed at the bottom */}
        <div className="p-4 bg-white sticky bottom-0">
          {cart && cart.products && cart.products.length > 0 && (
            <>
              <button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Thanh toán
              </button>
              <p className="text-sm tracking-tighter text-gray-500 mt-2 text-center">
                Phí vận chuyển, thuế và mã giảm giá được tính khi thanh toán!
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
