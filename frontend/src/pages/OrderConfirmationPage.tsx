import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../redux/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { CheckoutItem } from "../types";

const OrderConfirmationPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { checkout } = useAppSelector((state) => state.checkout);

  // clear cart when the order is confirmed
  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  const calculateEstimatedDelivery = (createdAt?: string): string => {
    const orderDate = createdAt ? new Date(createdAt) : new Date();
    orderDate.setDate(orderDate.getDate() + 4); // add 4 days to the order date
    return orderDate.toLocaleDateString("vi-VN");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">Cảm ơn bạn đã đặt hàng!</h1>
      {checkout && (
        <div className="p-6 rounded-lg border border-gray-100 shadow-sm">
          <div className="mb-10">
            {/* Order Id and Date */}
            <div>
              <h2 className="text-sm lg:text-xl font-semibold">Mã đơn hàng : {checkout._id}</h2>
              <p className="text-gray-500">
                Ngày đặt hàng : {checkout.createdAt ? new Date(checkout.createdAt).toLocaleDateString("vi-VN") : "N/A"}
              </p>
            </div>
            {/* Estimated Delivery */}
            <div>
              <p className="text-emerald-700 text-sm mt-1">
                Giao hàng dự kiến: {calculateEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>

          {/* Ordered items */}
          <div className="mb-20">
            {checkout.checkoutItems?.map((item: CheckoutItem) => (
              <div key={item.productId} className="flex items-center mb-4 border-b pb-4 last:border-0">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md mr-4" />
                <div>
                  <h4 className="text-md font-semibold">{item.name}</h4>
                  <p className="text-sm text-gray-500">
                    {item.color} | {item.size}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md whitespace-nowrap">Giá : ${item.price}</p>
                  <p className="text-sm text-gray-500 whitespace-nowrap">Số Lượng : {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Payment and Delivery info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {/* Payment info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Thanh Toán</h4>
              <p className="text-gray-600">{checkout.paymentMethod || "Paypal"}</p>
            </div>
            {/* Delivery info */}
            <div>
              <h4 className="text-lg font-semibold mb-2">Vận chuyển</h4>
              <p className="text-gray-600">{checkout.shippingAddress?.address}</p>
              <p className="text-gray-600">
                {checkout.shippingAddress?.city}, {checkout.shippingAddress?.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
