import React, { useEffect, useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import PayPalButton from "./PayPalButton";
import { useCheckoutMutations } from "@/features/checkout";
import { useCart, useCartParams } from "@/features/cart";
import { useAuthStore } from "@/features/auth";
import { NotificationService } from "../../utils/notificationService";
import { Loading } from "@/shared/components/feedback/Loading";
import { ShippingAddress } from "../../types";
import { getErrorMessage } from "@/shared/utils/error-utils";
import { useValidateCoupon } from "@/features/coupons";

export function Checkout() {
  const navigate = useNavigate();

  const cartParams = useCartParams();
  const { data: cart, isLoading: cartLoading, error: cartError } = useCart(cartParams);
  const { user } = useAuthStore();
  const { createCheckout, payCheckout, finalizeCheckout, isCreating: checkoutLoading } = useCheckoutMutations();

  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ id: string; code: string; discountAmount: number } | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const { mutateAsync: validateCoupon, isPending: isValidatingCoupon } = useValidateCoupon();

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      NotificationService.error("Vui lòng nhập mã giảm giá");
      return;
    }
    if (!user?._id) {
      NotificationService.error("Vui lòng đăng nhập để áp dụng mã giảm giá");
      return;
    }

    try {
      const response = await validateCoupon({
        code: couponCode.trim(),
        userId: user._id,
        totalPrice: cart?.totalPrice || 0,
      });

      setAppliedCoupon({
        id: response.couponId,
        code: response.code,
        discountAmount: response.discountAmount,
      });
      setDiscountAmount(response.discountAmount);
      NotificationService.success(response.message || "Áp dụng mã giảm giá thành công!");
    } catch (err: unknown) {
      NotificationService.error(getErrorMessage(err, "Không thể áp dụng mã giảm giá"));
    }
  };

  const cartTotalPrice = cart?.totalPrice || 0;
  const finalTotal = Math.max(cartTotalPrice - discountAmount, 0);

  const handleCreateCheckout = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (isSubmitting || !cart?.products?.length) return;

    setIsSubmitting(true);
    try {
      const payload = {
        checkoutItems: cart.products,
        shippingAddress,
        paymentMethod: "PayPal",
        totalPrice: finalTotal,
        couponCode: appliedCoupon?.code,
        couponId: appliedCoupon?.id,
      };

      const result = await createCheckout(payload);
      setCheckoutId(result._id);
      NotificationService.success("Tạo đơn hàng thành công!");
    } catch (err: unknown) {
      NotificationService.error(getErrorMessage(err, "Không thể tạo đơn hàng"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (paymentDetails: unknown): Promise<void> => {
    if (!checkoutId) return;

    try {
      await payCheckout({ checkoutId, paymentDetails });
      NotificationService.success("Thanh toán thành công!");

      await finalizeCheckout(checkoutId);

      NotificationService.success("Đơn hàng đã được xác nhận!");
      navigate("/order-confirmation");
    } catch (error: unknown) {
      NotificationService.error(getErrorMessage(error, "Thanh toán thất bại. Vui lòng thử lại."));
    }
  };

  if (cartLoading && !cart) return <Loading />;
  if (cartError) return <p className="text-center py-12 text-red-600">Lỗi: {getErrorMessage(cartError)}</p>;
  if (!cart?.products?.length) return <p className="text-center py-12">Giỏ hàng của bạn trống.</p>;

  return (
    <div className="max-w-7xl mx-auto p-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* LEFT: Checkout Form */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">Thanh toán</h2>

        <form onSubmit={handleCreateCheckout} className="space-y-6">
          {/* Contact Info */}
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

          {/* Shipping Address */}
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

          {/* Submit Button / PayPal */}
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
                    NotificationService.error(getErrorMessage(err, "Thanh toán thất bại"));
                  }}
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* RIGHT: Order Summary */}
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
              disabled={!!checkoutId || !!appliedCoupon}
            />
            {appliedCoupon ? (
              <button
                type="button"
                onClick={() => {
                  setAppliedCoupon(null);
                  setDiscountAmount(0);
                  setCouponCode("");
                }}
                disabled={!!checkoutId}
                className="px-4 py-3 rounded-lg font-medium whitespace-nowrap text-white bg-red-600 hover:bg-red-700 transition-all"
              >
                Hủy
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApplyCoupon}
                disabled={!!checkoutId || isValidatingCoupon}
                className={`px-2 py-3 rounded-lg font-medium whitespace-nowrap text-white transition-all ${
                  !!checkoutId || isValidatingCoupon ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"
                }`}
              >
                {isValidatingCoupon ? "..." : "Áp dụng"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3 text-lg">
          <div className="flex justify-between">
            <span>Tổng phụ</span>
            <span className="font-medium">${cartTotalPrice.toLocaleString()}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Giảm giá ({appliedCoupon?.code})</span>
              <span className="font-medium">-${discountAmount.toLocaleString()}</span>
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
}

export default Checkout;
