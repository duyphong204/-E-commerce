import { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSlideBar from "../components/Products/FilterSlideBar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import Pagination from "../components/Common/Pagination";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productsSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error, page, totalPages } = useSelector(
    (state) => state.products
  );

  const queryParams = Object.fromEntries([...searchParams]);
  const slidebarRef = useRef(null);
  const [isSlidebarOpen, setIsSlidebarOpen] = useState(false);

  // Fetch sản phẩm theo bộ lọc và collection
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(
        fetchProductsByFilters({
          collection,
          page: 1,
          limit: 12,
          ...queryParams,
        })
      );
    }, 300);
    return () => clearTimeout(timer);
  }, [dispatch, collection, searchParams]);


  const toggleSlidebar = () => setIsSlidebarOpen(!isSlidebarOpen);

  const handleClickOutside = (e) => {
    if (slidebarRef.current && !slidebarRef.current.contains(e.target)) {
      setIsSlidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý chuyển trang
  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage);
    setSearchParams(newParams);
  };

  // Xử lý thay đổi sắp xếp
  const handleSortChange = (sort) => {
    const newParams = new URLSearchParams(searchParams);
    if (sort) newParams.set("sort", sort);
    else newParams.delete("sort");
    newParams.set("page", 1);
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Nút mở bộ lọc (mobile) */}
        <button
          onClick={toggleSlidebar}
          className="lg:hidden border p-2 flex justify-center items-center rounded-xl bg-white border-gray-200 text-gray-700 font-bold active:scale-95 transition-transform"
        >
          <FaFilter className="mr-2" />
          Lọc
        </button>

        {/* Sidebar bộ lọc */}
        <div
          ref={slidebarRef}
          className={`${
            isSlidebarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed inset-y-0 z-50 left-0 w-64 bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0 border-r border-gray-100 lg:border-r-0`}
        >
          <FilterSlideBar />
        </div>

        {/* Khu vực hiển thị sản phẩm */}
        <div className="flex-grow p-0">
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-6 sm:mb-8 tracking-tight uppercase">
            {collection ? `${collection}` : "TẤT CẢ SẢN PHẨM"}
          </h2>

          {/* Tuỳ chọn sắp xếp */}
          <SortOptions onSortChange={handleSortChange} />
          
          {/* Lưới sản phẩm */}
          <div className="mt-4">
            <ProductGrid products={products} loading={loading} error={error} />
          </div>

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionPage;
