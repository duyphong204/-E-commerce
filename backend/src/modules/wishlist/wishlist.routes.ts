import { Router } from "express";
import { WishlistController } from "./wishlist.controller";
import { protect } from "../../common/middlewares/auth.middleware";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import { wishlistParamSchema } from "./wishlist.schema";

const router = Router();
const wishlistController = new WishlistController();

router.use(protect as any); // All wishlist routes require authentication

router.get("/", wishlistController.getWishlist);
router.post("/:productId", validateRequest(wishlistParamSchema), wishlistController.addToWishlist);
router.delete("/:productId", validateRequest(wishlistParamSchema), wishlistController.removeFromWishlist);

export default router;
