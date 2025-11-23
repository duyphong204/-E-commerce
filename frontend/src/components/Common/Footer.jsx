import { IoLogoInstagram } from "react-icons/io"
import { RiTwitterXLine } from "react-icons/ri"
import { TbBrandMeta } from "react-icons/tb"
import { Link } from "react-router-dom"
import { FiPhoneCall } from "react-icons/fi"

const Footer = () => {
    return (
        <footer className="border-t py-10 border-gray-100">
            {/* Grid container */}
            <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 px-4 lg:px-0">

                {/* Newsletter */}
                <div>
                    <h3 className="text-base sm:text-lg text-gray-800 mb-3">Bản Tin</h3>
                    <p className="text-sm sm:text-sm text-gray-500 leading-relaxed mb-2">
                        Hãy là người đầu tiên biết về sản phẩm và ưu đãi mới
                    </p>
                    <p className="font-medium text-sm sm:text-sm text-gray-600 mb-4 leading-relaxed">
                        đăng ký và được giảm giá 10% cho đơn hàng đầu tiên của bạn.
                    </p>

                    {/* Newsletter form */}
                    <form className="flex">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="p-2 sm:p-3 text-sm w-full border border-gray-300 rounded-l-md 
              focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-black text-white px-4 py-2 sm:py-3 text-sm rounded-r-md 
              hover:bg-gray-800 transition-all"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>

                {/* Shop */}
                <div>
                    <h3 className="text-base sm:text-lg text-gray-800 mb-3">Shop</h3>
                    <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-sm">
                        <li><Link to="#" className="hover:text-gray-500">Men's top wear</Link></li>
                        <li><Link to="#" className="hover:text-gray-500">Woman's top wear</Link></li>
                        <li><Link to="#" className="hover:text-gray-500">Men's bottom wear</Link></li>
                        <li><Link to="#" className="hover:text-gray-500">Woman's bottom wear</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-base sm:text-lg text-gray-800 mb-3">Support</h3>
                    <ul className="space-y-1 sm:space-y-2 text-gray-600 text-sm sm:text-sm">
                        <li><Link to="#" className="hover:text-gray-500">Contact Us</Link></li>
                        <li><Link to="/about" className="hover:text-gray-500">About Us</Link></li>
                        <li><Link to="#" className="hover:text-gray-500">FAQs</Link></li>
                        <li><Link to="#" className="hover:text-gray-500">Features</Link></li>
                    </ul>
                </div>

                {/* Follow Us */}
                <div>
                    <h3 className="text-base sm:text-lg text-gray-800 mb-3">Follow Us</h3>

                    <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                        <TbBrandMeta className="w-5 h-5 hover:text-gray-500" />
                        <IoLogoInstagram className="w-5 h-5 hover:text-gray-500" />
                        <RiTwitterXLine className="w-4 h-4 hover:text-gray-500" />
                    </div>

                    <p className="text-gray-500 text-sm mb-1">Call Us</p>
                    <p className="text-sm">
                        <FiPhoneCall className="inline-block mr-1" /> +84 935452263
                    </p>
                </div>
            </div>

            {/* Footer bottom */}
            <div className="container mx-auto mt-10 px-4 lg:px-0 border-t border-gray-200 pt-5">
                <p className="text-gray-500 text-sm tracking-tight text-center">
                    2025 - CompileTab. All Rights Reserved.
                </p>
            </div>
        </footer>
    )
}

export default Footer
