import React, { useEffect, useState, FormEvent } from "react";
import { fetchReviews, createReview, deleteReview } from "../../redux/slices/reviewSlice";
import { NotificationService } from "../../utils/notificationService";
import { Star, Trash2, Send, MessageSquare } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { User } from "../../types";

interface ProductReviewsProps {
  productId: string;
  user?: User | null;
}

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const dispatch = useAppDispatch();
  const { reviews, loading, error, avgRating } = useAppSelector((state) => state.reviews);

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const token = localStorage.getItem("userToken");
  const userInfo: { _id?: string; name?: string } = JSON.parse(localStorage.getItem("userInfo") || "{}");

  useEffect(() => {
    if (productId) dispatch(fetchReviews({ productId }));
  }, [productId, dispatch]);

  const myReview = reviews.find((r) => r.user?._id === userInfo?._id);
  const canSubmit = !myReview;

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!token) return NotificationService.error("Bạn cần đăng nhập để đánh giá!");
    if (!canSubmit) return NotificationService.error("Bạn chỉ được đánh giá 1 lần");
    if (!comment.trim()) return NotificationService.error("Vui lòng viết nhận xét.");

    dispatch(createReview({ productId, reviewData: { rating, comment } }))
      .unwrap()
      .then(() => {
        NotificationService.success("Đánh giá gửi thành công");
        setRating(5);
        setComment("");
      })
      .catch((err: { message?: string }) => {
        NotificationService.error(err?.message || "Gửi đánh giá thất bại");
      });
  };

  const handleDelete = (id: string): void => {
    if (!token) return NotificationService.error("Bạn cần đăng nhập để xóa!");
    if (window.confirm("Bạn có chắc muốn xóa đánh giá này?")) {
      dispatch(deleteReview({ reviewId: id }))
        .unwrap()
        .then(() => NotificationService.success("Đã xóa đánh giá"))
        .catch((err: { message?: string }) => NotificationService.error(err?.message || "Xóa đánh giá thất bại"));
    }
  };

  // Tính toán phân bổ số sao
  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
    return { star, count, percentage };
  });

  // Tạo avatar từ tên
  const getAvatarColor = (name?: string): string => {
    const colors = [
      "bg-emerald-100 text-emerald-700",
      "bg-blue-100 text-blue-700",
      "bg-indigo-100 text-indigo-700",
      "bg-amber-100 text-amber-700",
      "bg-rose-100 text-rose-700",
    ];
    const charCode = name ? name.charCodeAt(0) : 0;
    return colors[charCode % colors.length];
  };

  return (
    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-6 sm:p-10 lg:p-12 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
        {/* Rating Overview & Progress Bars */}
        <div className="lg:w-2/5 space-y-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">Đánh Giá Khách Hàng</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-gray-900">
                {avgRating ? avgRating.toFixed(1) : "0"}
              </span>
              <span className="text-gray-400 text-sm font-bold">trên 5</span>
            </div>

            {/* Stars summary */}
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isHalf = avgRating && star - 0.5 <= avgRating && star > avgRating;
                const isFull = avgRating && star <= avgRating;
                return (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      isFull
                        ? "fill-yellow-400 stroke-yellow-400"
                        : isHalf
                        ? "fill-yellow-200 stroke-yellow-400"
                        : "fill-none text-gray-200"
                    }`}
                  />
                );
              })}
              <span className="text-xs text-gray-500 font-bold ml-2">({reviews.length} đánh giá)</span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="space-y-2.5 pt-4 border-t border-gray-50">
            {distribution.map(({ star, count, percentage }) => (
              <div key={star} className="flex items-center text-sm font-semibold text-gray-600">
                <span className="w-10 flex items-center gap-1 text-xs font-bold text-gray-400">
                  {star} <Star className="w-3.5 h-3.5 fill-yellow-400 stroke-yellow-400" />
                </span>
                <div className="flex-1 h-2 bg-gray-50 rounded-full mx-3 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs text-gray-400 font-bold">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews List & Write Review */}
        <div className="lg:w-3/5 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-50 pb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" />
              <span>Ý kiến phản hồi</span>
            </h3>
          </div>

          {/* List content */}
          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
            {loading && <p className="text-sm text-gray-500">Đang tải...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {reviews.length === 0 && !loading && (
              <p className="text-sm text-gray-400 font-medium italic">
                Sản phẩm chưa có đánh giá nào. Hãy là người đầu tiên chia sẻ cảm nhận!
              </p>
            )}

            {reviews.map((r) => {
              const userName = r.user?.name || "Người dùng ẩn danh";
              const initials = userName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();
              return (
                <div key={r._id} className="group border-b border-gray-50 pb-5 last:border-0 last:pb-0 transition-all duration-300">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      {/* Avatar initials */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm ${getAvatarColor(
                          userName
                        )}`}
                      >
                        {initials}
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-gray-800 leading-tight">{userName}</h4>
                        <span className="text-[10px] text-gray-400 font-bold">
                          {new Date(r.createdAt || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Ratings */}
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= r.rating ? "fill-yellow-400 stroke-yellow-400" : "fill-none text-gray-200"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Delete button (owner only) */}
                      {userInfo && r.user?._id === userInfo._id && (
                        <button
                          onClick={() => handleDelete(r._id)}
                          className="p-1.5 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all ml-2"
                          title="Xóa đánh giá"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed mt-3 pl-13">{r.comment}</p>
                </div>
              );
            })}
          </div>

          {/* Form write review */}
          {token && canSubmit && (
            <form onSubmit={handleSubmit} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Viết nhận xét của bạn</h4>

              {/* Interactive Stars Selector */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500">Đánh giá của bạn:</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                      onClick={() => setRating(star)}
                      className="transition-all active:scale-90"
                    >
                      <Star
                        className={`w-6 h-6 transition-all duration-200 ${
                          (hoveredStar !== null ? star <= hoveredStar : star <= rating)
                            ? "fill-yellow-400 stroke-yellow-400 scale-105"
                            : "fill-none text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Textarea comment */}
              <div className="relative">
                <textarea
                  className="w-full bg-white border border-gray-200 rounded-xl p-3 pr-10 text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                  rows={3}
                  placeholder="Chia sẻ trải nghiệm của bạn về chất liệu, kích thước, thiết kế..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="absolute bottom-3 right-3 p-2 bg-gray-950 text-white rounded-lg hover:bg-emerald-500 transition-colors shadow-sm active:scale-95 flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Message if reviewed already */}
          {!canSubmit && token && (
            <div className="bg-gray-50 p-4 rounded-xl text-center">
              <p className="text-gray-500 text-xs font-bold">Bạn đã gửi đánh giá cho sản phẩm này.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductReviews;
