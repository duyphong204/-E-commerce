import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { fetchOrderDetails } from "../redux/slices/orderSlice"
import Loading from "../components/Common/Loading"
import { ChevronLeft, MapPin, CreditCard, Box } from "lucide-react"

const OrderDetailsPage = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const { orderDetails, loading, error } = useSelector((state) => state.orders)

    useEffect(() => {
        dispatch(fetchOrderDetails(id))
    }, [dispatch, id])

    if (loading) return <Loading />
    if (error) return <p className="text-center text-red-500 font-medium my-10">Lỗi : {error}</p>

    return (
        <div className="bg-gray-50/50 min-h-screen pb-12 pt-6">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                
                {/* Header & Back button */}
                <div className="mb-6 flex items-center justify-between">
                    <Link to="/profile" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black transition-colors group">
                        <ChevronLeft className="w-5 h-5 mr-1 group-hover:-translate-x-1 transition-transform" />
                        Quay lại Đơn hàng
                    </Link>
                </div>

                {!orderDetails ? (
                    <div className="bg-white p-10 text-center rounded-3xl shadow-sm border border-gray-100">
                        <p className="text-gray-500">Không tìm thấy chi tiết đơn hàng</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        
                        {/* Summary Card */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                            <div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Mã đơn: #{orderDetails._id.substring(0, 8)}...</h2>
                                <p className="text-sm text-gray-500">Đặt ngày: {new Date(orderDetails.createdAt).toLocaleDateString("vi-VN")} lúc {new Date(orderDetails.createdAt).toLocaleTimeString("vi-VN")}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold
                                    ${orderDetails.isPaid
                                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                                    : "bg-amber-50 text-amber-600 border border-amber-200"}`}>
                                    {orderDetails.isPaid ? "Đã thanh toán" : "Chờ thanh toán"}
                                </span>
                                <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold
                                    ${orderDetails.isDelivered
                                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                                    : "bg-purple-50 text-purple-600 border border-purple-200"}`}>
                                    {orderDetails.isDelivered ? "Đã giao hàng" : "Đang chuẩn bị"}
                                </span>
                            </div>
                        </div>

                        {/* Customer, Payment, Shipping Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Payment */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900">Thanh toán</h4>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600 ml-13">
                                    <p><span className="font-medium text-gray-900">Phương thức:</span> {orderDetails.paymentMethod}</p>
                                    <p><span className="font-medium text-gray-900">Trạng thái:</span> {orderDetails.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</p>
                                </div>
                            </div>
                            
                            {/* Shipping */}
                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                        <MapPin className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900">Giao hàng</h4>
                                </div>
                                <div className="space-y-2 text-sm text-gray-600 ml-13">
                                    <p><span className="font-medium text-gray-900">Phương thức:</span> {orderDetails.shippingMethod}</p>
                                    <p><span className="font-medium text-gray-900">Địa chỉ:</span> {`${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}</p>
                                </div>
                            </div>
                        </div>

                        {/* Product List */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center">
                                    <Box className="w-5 h-5" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">Sản phẩm đã đặt</h4>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-left">
                                    <thead className="bg-gray-50/80 text-gray-500 font-semibold border-b border-gray-100">
                                        <tr>
                                            <th className="py-4 px-6 uppercase text-xs">Sản phẩm</th>
                                            <th className="py-4 px-6 uppercase text-xs">Đơn giá</th>
                                            <th className="py-4 px-6 uppercase text-xs">SL</th>
                                            <th className="py-4 px-6 uppercase text-xs text-right">Tổng cộng</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 text-gray-700">
                                        {orderDetails.orderItems.map((item) => (
                                            <tr key={item.productId} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-6 flex items-center gap-4">
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm"
                                                    />
                                                    <Link to={`/product/${item.productId}`} className="font-medium text-gray-900 hover:text-emerald-600 transition-colors">
                                                        {item.name}
                                                    </Link>
                                                </td>
                                                <td className="py-4 px-6">${item.price.toLocaleString()}</td>
                                                <td className="py-4 px-6 font-medium">{item.quantity}</td>
                                                <td className="py-4 px-6 text-right font-bold text-gray-900">${(item.price * item.quantity).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50/50">
                                        <tr>
                                            <td colSpan="3" className="py-4 px-6 text-right font-semibold text-gray-600">Tổng tiền thanh toán:</td>
                                            <td className="py-4 px-6 text-right font-bold text-xl text-gray-900">${orderDetails.totalPrice.toLocaleString()}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default OrderDetailsPage