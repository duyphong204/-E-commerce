import { Link } from "react-router-dom";

export function OrderConfirmationPage() {
  const calculateEstimatedDelivery = (): string => {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() + 4);
    return orderDate.toLocaleDateString("vi-VN");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white py-16 text-center">
      <h1 className="text-4xl font-bold text-emerald-700 mb-4">Cảm ơn bạn đã đặt hàng!</h1>
      <p className="text-gray-600 mb-6">Đơn hàng của bạn đã được ghi nhận thành công.</p>

      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 inline-block text-left mb-8 max-w-md w-full">
        <p className="text-emerald-800 font-medium">Giao hàng dự kiến: {calculateEstimatedDelivery()}</p>
        <p className="text-sm text-emerald-600 mt-1">Thông báo theo dõi đơn hàng sẽ được gửi qua email của bạn.</p>
      </div>

      <div>
        <Link
          to="/my-orders"
          className="inline-block bg-black text-white px-8 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all"
        >
          Xem lịch sử đơn hàng
        </Link>
      </div>
    </div>
  );
}

export default OrderConfirmationPage;
