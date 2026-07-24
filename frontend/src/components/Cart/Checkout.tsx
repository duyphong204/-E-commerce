import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import { createCheckout, markCheckoutAsPaid, finalizeCheckout } from "../../redux/slices/checkoutSlice";
import { validateCoupon, clearCoupon } from "../../redux/slices/couponUserSlice";
import { NotificationService } from "../../utils/notificationService";
import Loading from "../Common/Loading";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { ShippingAddress } from "../../types";

const Checkout: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { cart, loading: cartLoading, error: cartError } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const { checkout: checkoutData, loading: checkoutLoading, error: checkoutError } = useAppSelector(
    (state) => state.checkout
  );

  const { coupon, discountAmount, loading: couponLoading, error: couponError } = useAppSelector(
    (state) => state.couponUser || {}
  );

  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>("");

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  /* Redirect nếu giỏ trống */
  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  /* Xóa coupon khi rời trang */
  useEffect(() => {
    return () => {
      dispatch(clearCoupon());
    };
  }, [dispatch]);

  /* Áp dụng mã giảm giá */
  const handleApplyCoupon = async (): Promise<void> => {
    if (!couponCode.trim() || !user || !cart) return;
    await dispatch(
      validateCoupon({
        code: couponCode.trim().toUpperCase(),
        totalPrice: cart.totalPrice,
        userId: user._id,
      })
    );
    setCouponCode("");
  };

  /* Tạo đơn hàng */
  const handleCreateCheckout = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (isSubmitting || !cart?.products?.length) return;

    setIsSubmitting(true);
    try {
      const payload = {
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod: "PayPal",
        totalPrice: cart.totalPrice,
        ...(coupon && { couponId: coupon.id, couponCode: coupon.code }),
      };

      const result = await dispatch(createCheckout(payload)).unwrap();
      setCheckoutId(result._id);
      NotificationService.success("Tạo đơn hàng thành công!");
    } catch (err: unknown) {
      const errorObj = err as { errors?: string[]; message?: string };
      if (errorObj?.errors && Array.isArray(errorObj.errors)) {
        errorObj.errors.forEach((msg) => NotificationService.error(msg));
      } else {
        NotificationService.error(errorObj?.message || "Không thể tạo đơn hàng");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails: unknown): Promise<void> => {
    if (!checkoutId) return;

    try {
      await dispatch(markCheckoutAsPaid({ checkoutId, paymentDetails })).unwrap();
      NotificationService.success("Thanh toán thành công!");

      await dispatch(finalizeCheckout(checkoutId)).unwrap();

      NotificationService.success("Đơn hàng đã được xác nhận!");
      navigate("/order-confirmation");
    } catch (error: unknown) {
      const errObj = error as { message?: string };
      NotificationService.error(errObj?.message || "Thanh toán thất bại. Vui lòng thử lại.");
    }
  };

  const appliedDiscount = Math.max(Number(discountAmount) || 0, 0);

  const cartTotalPrice = cart?.totalPrice || 0;
  const finalTotal =
    checkoutData?.totalPrice ?? Math.max(cartTotalPrice - appliedDiscount, 0);

  const subtotal = checkoutData?.totalPrice ? checkoutData.totalPrice + appliedDiscount : cartTotalPrice;

  if (cartLoading) return <Loading />;
  if (cartError) return <p className="text-center py-12 text-red-600">Lỗi: {cartError}</p>;
  if (!cart?.products?.length) return <p className="text-center py-12">Giỏ hàng của bạn trống.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* === LEFT: Checkout Form === */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">Thanh toán</h2>

        {/* Hiển thị lỗi từ backend */}
        {checkoutError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            <p className="font-semibold mb-1">Không thể đặt hàng:</p>
            <p className="text-sm">{checkoutError}</p>
          </div>
        )}

        <form onSubmit={handleCreateCheckout} className="space-y-6">
          {/* === Contact Info === */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Chi tiết liên hệ</h3>
            <div>
              <label className="block text-gray-700 font-medium mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-50 cursor-not-allowed"
              />
            </div>
          </section>

          {/* === Shipping Address === */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Địa chỉ giao hàng</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Tên</label>
                <input
                  type="text"
                  value={shippingAddress.firstName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, firstName: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Họ</label>
                <input
                  type="text"
                  value={shippingAddress.lastName}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, lastName: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">Địa chỉ</label>
              <input
                type="text"
                value={shippingAddress.address}
                onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Thành phố</label>
                <input
                  type="text"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Mã bưu chính</label>
                <input
                  type="text"
                  value={shippingAddress.postalCode}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">Quốc gia</label>
              <input
                type="text"
                value={shippingAddress.country}
                onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">Số điện thoại</label>
              <input
                type="tel"
                value={shippingAddress.phone}
                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
                required
              />
            </div>
          </section>

          {/* === Submit Button / PayPal === */}
          <div className="mt-8">
            {!checkoutId ? (
              <button
                type="submit"
                disabled={isSubmitting || checkoutLoading}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all duration-200 
                  ${
                    isSubmitting || checkoutLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800 active:scale-95"
                  }`}
              >
                {isSubmitting || checkoutLoading ? "Đang xử lý..." : "Tiếp tục thanh toán"}
              </button>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Thanh toán qua PayPal</h3>
                <PayPalButton
                  amount={finalTotal}
                  onSuccess={handlePaymentSuccess}
                  onError={(err: unknown) => {
                    const errorObj = err as { message?: string };
                    NotificationService.error(errorObj?.message || "Thanh toán thất bại");
                  }}
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* === RIGHT: Order Summary === */}
      <div className="bg-gray-50 rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h3>

        <div className="space-y-5 border-t pt-4">
          {cart.products.map((item, index) => (
            <div key={index} className="flex justify-between items-start pb-4 border-b last:border-0">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-24 object-cover rounded-lg shadow-sm"
                />
                <div>
                  <h4 className="font-medium text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-600">Size: {item.size}</p>
                  <p className="text-sm text-gray-600">Màu: {item.color}</p>
                  <p className="text-sm text-gray-600">SL: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold text-lg">${item.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* Ô nhập mã giảm giá */}
        <div className="mt-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Mã giảm giá"
              className="w-[80%] p-3 border rounded-lg focus:ring-2 focus:ring-black focus:outline-none"
              disabled={!!checkoutId}
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              disabled={couponLoading || !!checkoutId}
              className={`px-2 py-3 rounded-lg font-medium whitespace-nowrap text-white transition-all ${
                couponLoading || !!checkoutId ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
              }`}
            >
              {couponLoading ? "..." : "Áp dụng"}
            </button>
          </div>

          {couponError && <p className="text-red-600 mt-2 text-sm">{couponError}</p>}
          {coupon && (
            <p className="text-green-600 mt-2 font-medium">
              Đã áp dụng: {coupon.code} (-${appliedDiscount.toLocaleString()})
            </p>
          )}
        </div>

        <div className="mt-6 space-y-3 text-lg">
          <div className="flex justify-between">
            <span>Tổng phụ</span>
            <span className="font-medium">${subtotal.toLocaleString()}</span>
          </div>

          {appliedDiscount > 0 && (
            <div className="flex justify-between text-green-600 font-medium">
              <span>Giảm giá</span>
              <span>-${appliedDiscount.toLocaleString()}</span>
            </div>
          )}

          <div className="flex justify-between">
            <span>Vận chuyển</span>
            <span className="text-green-600">Miễn phí</span>
          </div>

          <div className="flex justify-between pt-4 border-t font-bold text-xl">
            <span>Tổng cộng</span>
            <span className="text-black">${finalTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
