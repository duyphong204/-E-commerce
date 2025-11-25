const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  // Tính toán các trang cần hiển thị
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Số nút tối đa hiển thị

    if (totalPages <= maxVisible) {
      // Nếu tổng số trang <= 5, hiển thị tất cả
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Luôn hiển thị trang đầu
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      // Điều chỉnh nếu ở đầu hoặc cuối
      if (currentPage <= 3) {
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
      }

      // Thêm dấu ... nếu cần
      if (start > 2) {
        pages.push('...');
      }

      // Thêm các trang ở giữa
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Thêm dấu ... nếu cần
      if (end < totalPages - 1) {
        pages.push('...');
      }

      // Luôn hiển thị trang cuối
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        ← Trước
      </button>

      {/* Page Numbers */}
      <div className="flex gap-1">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-500"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[40px] px-3 py-2 rounded-lg font-medium transition-all ${currentPage === page
                ? "bg-black text-white shadow-md scale-105"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                }`}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
      >
        Sau →
      </button>
    </div>
  );
};

export default Pagination;