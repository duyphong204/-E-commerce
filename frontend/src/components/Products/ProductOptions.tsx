import React, { useState } from "react";
import { Heart, Loader2, Check, ChevronDown } from "lucide-react";
import { Product } from "../../types";

interface ProductOptionsProps {
  product: Product;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  handleQuantityChange: (action: "plus" | "minus") => void;
  handleAddToCart: () => Promise<void> | void;
  isInWishlist: boolean;
  handleToggleWishlist: () => Promise<void> | void;
}

const ProductOptions: React.FC<ProductOptionsProps> = ({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  handleQuantityChange,
  handleAddToCart,
  isInWishlist,
  handleToggleWishlist,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(false);

  const countInStock = product.countInStock || 0;
  const isOutOfStock = countInStock <= 0;

  const onAddToCartClick = async (): Promise<void> => {
    setIsAdding(true);
    await handleAddToCart();
    setIsAdding(false);
    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 1500);
  };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Product Name & Brand */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 mb-1 inline-block">
          {product.brand || "Rabbit Collection"}
        </span>
        <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 tracking-tight">{product.name}</h1>
      </div>

      {/* Price & Stock status */}
      <div className="flex items-center justify-between pb-6 border-b border-gray-100">
        <div>
          <p className="text-3xl font-black text-gray-900">{product.price} $</p>
        </div>
        <div className="text-sm">
          {isOutOfStock ? (
            <span className="px-3 py-1 bg-red-50 text-red-600 rounded-full font-bold text-xs border border-red-100">
              Hết hàng
            </span>
          ) : (
            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full font-bold text-xs border border-emerald-100">
              Còn {countInStock} sản phẩm
            </span>
          )}
        </div>
      </div>

      {/* Short Description */}
      <p className="text-gray-500 text-sm leading-relaxed font-medium">{product.description}</p>

      {/* Color Selection */}
      <div>
        <p className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Màu sắc:</p>
        <div className="flex gap-3">
          {product.colors?.map((color: string) => (
            <button
              key={color}
              onClick={() => !isOutOfStock && setSelectedColor(color)}
              disabled={isOutOfStock}
              className={`w-9 h-9 rounded-full border transition-all duration-300 relative flex items-center justify-center
                ${
                  selectedColor === color
                    ? "ring-2 ring-offset-2 ring-emerald-500 border-transparent scale-110"
                    : "border-gray-200 hover:scale-105"
                }
                ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}
              `}
              style={{ backgroundColor: color.toLowerCase() }}
              aria-label={`Chọn màu ${color}`}
            >
              {selectedColor === color && (
                <span className="w-2.5 h-2.5 rounded-full bg-white shadow-sm mix-blend-difference" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Size Selection */}
      <div>
        <p className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Kích thước:</p>
        <div className="flex gap-2.5">
          {product.sizes?.map((size: string) => (
            <button
              key={size}
              onClick={() => !isOutOfStock && setSelectedSize(size)}
              disabled={isOutOfStock}
              className={`w-12 h-12 rounded-xl border text-sm font-extrabold transition-all duration-300 flex items-center justify-center active:scale-95
                ${
                  selectedSize === size
                    ? "bg-gray-950 text-white border-transparent ring-2 ring-offset-2 ring-gray-950"
                    : "bg-white border-gray-200 text-gray-600 hover:border-gray-900"
                }
                ${isOutOfStock ? "opacity-50 cursor-not-allowed" : ""}
              `}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity & Actions */}
      <div className="space-y-5">
        {!isOutOfStock && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800 uppercase tracking-wider">Số lượng:</span>
            <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl p-1">
              <button
                onClick={() => handleQuantityChange("minus")}
                disabled={quantity <= 1}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-lg font-bold hover:bg-white text-gray-400 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                −
              </button>
              <span className="w-10 text-center font-bold text-sm text-gray-900">{quantity}</span>
              <button
                onClick={() => handleQuantityChange("plus")}
                disabled={quantity >= countInStock}
                className="w-9 h-9 flex items-center justify-center rounded-lg text-lg font-bold hover:bg-white text-gray-400 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Add to Cart & Wishlist Row */}
        <div className="flex gap-4 items-center">
          <button
            onClick={onAddToCartClick}
            disabled={isOutOfStock || !selectedSize || !selectedColor || isAdding || addedSuccess}
            className={`flex-1 py-4 rounded-2xl font-extrabold text-white transition-all duration-300 flex items-center justify-center gap-2 shadow-sm
              ${
                isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : !selectedSize || !selectedColor
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : addedSuccess
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-gray-950 hover:bg-emerald-600 hover:shadow-lg hover:shadow-emerald-500/10 active:scale-95"
              }
            `}
          >
            {isOutOfStock ? (
              "SẢN PHẨM HẾT HÀNG"
            ) : isAdding ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> ĐANG THÊM...
              </>
            ) : addedSuccess ? (
              <>
                <Check className="w-5 h-5" /> ĐÃ THÊM VÀO GIỎ
              </>
            ) : (
              "THÊM VÀO GIỎ HÀNG"
            )}
          </button>

          <button
            onClick={handleToggleWishlist}
            className={`w-14 h-14 flex items-center justify-center rounded-2xl border transition-all duration-300 active:scale-95
              ${
                isInWishlist
                  ? "bg-rose-50 border-rose-200 text-rose-500 shadow-sm"
                  : "bg-white border-gray-200 text-gray-500 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50/30"
              }
            `}
            aria-label="Yêu thích sản phẩm"
          >
            <Heart
              className={`w-6 h-6 transition-all duration-300 ${
                isInWishlist ? "fill-rose-500 stroke-rose-500 scale-105" : "fill-none stroke-current"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Accordion Detail Table */}
      <div className="border-t border-gray-100 pt-4">
        <button
          onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          className="w-full flex items-center justify-between py-2 font-bold text-gray-800 hover:text-black transition-colors"
        >
          <span className="text-sm font-bold uppercase tracking-wider">Thông số chi tiết</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
              isAccordionOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            isAccordionOpen ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <table className="w-full text-sm text-gray-600">
              <tbody>
                <tr className="border-b border-gray-50">
                  <td className="py-2.5 font-medium text-gray-400 w-1/3">Thương hiệu</td>
                  <td className="py-2.5 font-semibold text-gray-800">{product.brand || "Rabbit"}</td>
                </tr>
                {product.material && (
                  <tr className="border-b border-gray-50">
                    <td className="py-2.5 font-medium text-gray-400">Chất liệu</td>
                    <td className="py-2.5 font-semibold text-gray-800">{product.material}</td>
                  </tr>
                )}
                {product.gender && (
                  <tr>
                    <td className="py-2.5 font-medium text-gray-400">Phù hợp cho</td>
                    <td className="py-2.5 font-semibold text-gray-800">
                      {product.gender === "Men" ? "Nam giới" : "Nữ giới"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductOptions;
