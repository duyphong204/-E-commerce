import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useCartMutations, useCartParams } from "@/features/cart";
import { Cart } from "../../types";

interface CartContentsProps {
  cart: Cart;
  userId?: string | null;
  guestId?: string;
}

export function CartContents({ cart }: CartContentsProps) {
  const cartParams = useCartParams();
  const { updateCartItem, removeFromCart } = useCartMutations();

  const handleUpdateQuantity = (
    productId: string,
    delta: number,
    quantity: number,
    size: string,
    color: string
  ): void => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      updateCartItem({ productId, quantity: newQuantity, size, color, ...cartParams });
    }
  };

  const handleRemoveFromCart = (productId: string, size: string, color: string): void => {
    removeFromCart({ productId, size, color, ...cartParams });
  };

  if (!cart?.products?.length) return <p className="text-center py-8">Giỏ hàng trống</p>;

  return (
    <div>
      {cart.products.map((product) => (
        <div
          key={`${product.productId}-${product.size}-${product.color}`}
          className="flex items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 object-cover mr-4 rounded"
              loading="lazy"
            />
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">
                Size: {product.size} | Màu: {product.color}
              </p>
              <div className="flex items-center mt-2">
                <button
                  onClick={() =>
                    handleUpdateQuantity(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="border rounded px-2 py-1 text-xl font-medium hover:bg-gray-50"
                  aria-label="Giảm số lượng"
                >
                  -
                </button>
                <span className="mx-4 font-semibold">{product.quantity}</span>
                <button
                  onClick={() =>
                    handleUpdateQuantity(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="border rounded px-2 py-1 text-xl font-medium hover:bg-gray-50"
                  aria-label="Tăng số lượng"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-semibold">${product.price?.toLocaleString()}</p>
            <button
              onClick={() =>
                handleRemoveFromCart(product.productId, product.size, product.color)
              }
              className="mt-2 text-red-600 hover:text-red-800"
              aria-label="Xóa sản phẩm"
            >
              <RiDeleteBin3Line className="h-5 w-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CartContents;
