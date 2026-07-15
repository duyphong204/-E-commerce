import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBestSellerProducts, fetchMostLikedProducts } from "../redux/slices/productsSlice";
import Hero from "../components/Layout/Hero";
import GenderCollectionSection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeaturesSection from "../components/Products/FeaturesSection";
import ZaloChatIcon from "../components/Common/ZaloChatIcon";
import AIChat from "../components/AIChat";

const Home = () => {
  const dispatch = useDispatch();
  const { mostLikedProducts, bestSellerProducts, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchBestSellerProducts());
    dispatch(fetchMostLikedProducts());
  }, [dispatch]);

  return (
    <div className="bg-white">
      {/* Hero Slider */}
      <Hero />
      
      {/* Gender Categories (Men/Women) */}
      <GenderCollectionSection />
      
      {/* Swiper of New Arrivals */}
      <NewArrivals />

      {/* Best Seller Section */}
      <div className="container mx-auto py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full">
            Best Sellers
          </span>
          <h2 className="text-2xl lg:text-4xl font-extrabold text-gray-900 mt-3 mb-3">
            Sản Phẩm Bán Chạy
          </h2>
          <p className="text-sm lg:text-base text-gray-500 max-w-md mx-auto font-light leading-relaxed">
            Những thiết kế thịnh hành nhất, được khách hàng của Rabbit tin tưởng lựa chọn nhiều nhất.
          </p>
        </div>
        <ProductGrid products={bestSellerProducts} loading={loading} error={error} />
      </div>

      {/* Featured Collection Lifestyle Banner */}
      <FeaturedCollection />

      {/* Top Product Liked */}
      <div className="container mx-auto py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full">
            Most Loved
          </span>
          <h2 className="text-2xl lg:text-4xl font-extrabold text-gray-900 mt-3 mb-3">
            Được Yêu Thích Nhất
          </h2>
          <p className="text-sm lg:text-base text-gray-500 max-w-md mx-auto font-light leading-relaxed">
            Nhận được đánh giá 5 sao tuyệt đối cùng lượt yêu thích cao kỷ lục từ cộng đồng yêu thời trang.
          </p>
        </div>
        <ProductGrid products={mostLikedProducts} loading={loading} error={error} />
      </div>

      {/* Features Row */}
      <FeaturesSection />
      
      {/* Chatbots */}
      <AIChat />
      <ZaloChatIcon />
    </div>
  );
};

export default Home;
