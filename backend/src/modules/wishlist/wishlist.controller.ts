import { Response } from "express";
import { WishlistService } from "./wishlist.service";
import { catchAsync } from "../../common/utils/catchAsync";
import { AuthenticatedRequest } from "../../common/middlewares/auth.middleware";

export class WishlistController {
  private wishlistService: WishlistService;

  constructor() {
    this.wishlistService = new WishlistService();
  }

  getWishlist = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id || req.user.id;
    const wishlist = await this.wishlistService.getWishlist(userId);
    return res.status(200).json({ wishlist });
  });

  addToWishlist = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id || req.user.id;
    const productId = req.params.productId as string;
    const wishlist = await this.wishlistService.addToWishlist(userId, productId);
    return res.status(200).json({
      message: "Add product to wishlist !",
      wishlist,
    });
  });

  removeFromWishlist = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id || req.user.id;
    const productId = req.params.productId as string;
    const wishlist = await this.wishlistService.removeFromWishlist(userId, productId);
    return res.status(200).json({
      message: "Removed from favorites list",
      wishlist,
    });
  });
}
