import { HiOutlineCreditCard, HiShoppingBag } from "react-icons/hi"
import { HiMiniArrowPathRoundedSquare } from "react-icons/hi2"

const FeaturesSection = () => {
    return (
        <section className="py-10 px-2 bg-white">
            <div className="container mx-auto grid grid-cols-3 gap-4 text-center justify-items-center">

                {/* feature 1 */}
                <div className="flex flex-col items-center px-1">
                    <div className="p-3 rounded-full mb-3">
                        <HiShoppingBag className="text-lg" />
                    </div>
                    <h4 className="text-sm font-medium tracking-tight">MIỄN PHÍ VẬN CHUYỂN</h4>
                    <p className="text-gray-600 text-xs tracking-tight">
                        Cho đơn hàng trên 100.000 ₫
                    </p>
                </div>

                {/* feature 2 */}
                <div className="flex flex-col items-center px-1">
                    <div className="p-3 rounded-full mb-3">
                        <HiMiniArrowPathRoundedSquare className="text-lg" />
                    </div>
                    <h4 className="text-sm font-medium tracking-tight">45 NGÀY TRẢ HÀNG</h4>
                    <p className="text-gray-600 text-xs tracking-tight">
                        Đảm bảo hoàn tiền
                    </p>
                </div>

                {/* feature 3 */}
                <div className="flex flex-col items-center px-1">
                    <div className="p-3 rounded-full mb-3">
                        <HiOutlineCreditCard className="text-lg" />
                    </div>
                    <h4 className="text-sm font-medium tracking-tight">THANH TOÁN AN TOÀN</h4>
                    <p className="text-gray-600 text-xs tracking-tight">
                        Quy trình an toàn 100%
                    </p>
                </div>

            </div>
        </section>
    )
}

export default FeaturesSection
