import React, { useEffect, useRef, useState } from "react";
import { FaFilter } from "react-icons/fa";
import { X } from "lucide-react";
import FilterSlideBar from "../components/Products/FilterSlideBar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import Pagination from "../components/Common/Pagination";
import { useParams, useSearchParams } from "react-router-dom";
import { useProducts } from "@/features/products";
import { getErrorMessage } from "@/shared/utils/error-utils";

export function CollectionPage() {
  const { collection } = useParams<{ collection?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const queryParams = Object.fromEntries([...searchParams]);

  const { data, isLoading: loading, error } = useProducts({
    collection,
    page: currentPage,
    limit: 12,
    ...queryParams,
  });

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  const slidebarRef = useRef<HTMLDivElement | null>(null);
  const [isSlidebarOpen, setIsSlidebarOpen] = useState<boolean>(false);

  const toggleSlidebar = (): void => setIsSlidebarOpen(!isSlidebarOpen);

  const handleClickOutside = (e: MouseEvent): void => {
    if (slidebarRef.current && !slidebarRef.current.contains(e.target as Node)) {
      setIsSlidebarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePageChange = (newPage: number): void => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", newPage.toString());
    setSearchParams(newParams);
  };

  const handleSortChange = (sort?: string): void => {
    const newParams = new URLSearchParams(searchParams);
    if (sort) newParams.set("sort", sort);
    else newParams.delete("sort");
    newParams.set("page", "1");
    setSearchParams(newParams);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Mobile filter button */}
      <div className="flex items-center justify-between mb-4 lg:hidden">
        <button
          onClick={toggleSlidebar}
          className="border px-4 py-2 flex items-center gap-2 rounded-xl bg-white border-gray-200 text-gray-700 font-bold text-sm active:scale-95 transition-transform shadow-sm"
        >
          <FaFilter className="w-3.5 h-3.5" />
          Bộ lọc
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* ── Mobile Slide Overlay ── */}
        {isSlidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsSlidebarOpen(false)}
          />
        )}

        {/* ── Sidebar bộ lọc ── */}
        <div
          ref={slidebarRef}
          className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-white overflow-y-auto transition-transform duration-300 shadow-xl
            lg:static lg:z-auto lg:w-64 lg:shadow-none lg:translate-x-0
            ${isSlidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Mobile header with close button */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2 lg:hidden border-b border-gray-100">
            <h3 className="text-base font-bold text-gray-900">Bộ lọc</h3>
            <button
              onClick={() => setIsSlidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
              aria-label="Đóng bộ lọc"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {/* Filter content */}
          <div className="p-4">
            <FilterSlideBar />
          </div>
        </div>

        {/* ── Khu vực sản phẩm ── */}
        <div className="flex-grow min-w-0">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight uppercase">
              {collection ? `${collection}` : "TẤT CẢ SẢN PHẨM"}
            </h2>
            <SortOptions onSortChange={handleSortChange} />
          </div>

          {/* Lưới sản phẩm */}
          <ProductGrid
            products={products}
            loading={loading}
            error={error ? getErrorMessage(error) : null}
          />

          {/* Phân trang */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CollectionPage;
