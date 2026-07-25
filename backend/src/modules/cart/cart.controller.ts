import { Request, Response } from "express";
import { CartService } from "./cart.service";
import { catchAsync } from "../../common/utils/catchAsync";
import { AuthenticatedRequest } from "../../common/middlewares/auth.middleware";

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  createCart = catchAsync(async (req: Request, res: Response) => {
    const cart = await this.cartService.addToCart(req.body);
    return res.status(200).json(cart);
  });

  getCart = catchAsync(async (req: Request, res: Response) => {
    const userId = req.query.userId as string | undefined;
    const guestId = req.query.guestId as string | undefined;
    try {
      const cart = await this.cartService.getCart(userId, guestId);
      return res.status(200).json(cart);
    } catch {
      // Cart not found → return empty cart instead of 404 error
      return res.status(200).json({ products: [], totalPrice: 0 });
    }
  });

  updateCart = catchAsync(async (req: Request, res: Response) => {
    const cart = await this.cartService.updateCartItem(req.body);
    return res.status(200).json(cart);
  });

  deleteCart = catchAsync(async (req: Request, res: Response) => {
    const cart = await this.cartService.removeCartItem(req.body);
    return res.status(200).json(cart);
  });

  mergeGuestCart = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { guestId } = req.body;
    const userId = req.user?._id || req.user?.id;
    const cart = await this.cartService.mergeGuestCart(guestId, userId);
    return res.status(200).json(cart);
  });
}
