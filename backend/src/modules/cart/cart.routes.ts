import { Router } from "express";
import { CartController } from "./cart.controller";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import { protect } from "../../common/middlewares/auth.middleware";
import {
  addCartItemSchema,
  updateCartItemSchema,
  removeCartItemSchema,
  mergeCartSchema,
  getCartSchema,
} from "./cart.schema";

const router = Router();
const cartController = new CartController();

router.post("/", validateRequest(addCartItemSchema), cartController.createCart);
router.put("/", validateRequest(updateCartItemSchema), cartController.updateCart);
router.delete("/", validateRequest(removeCartItemSchema), cartController.deleteCart);
router.get("/", validateRequest(getCartSchema), cartController.getCart);
router.post("/merge", protect as any, validateRequest(mergeCartSchema), cartController.mergeGuestCart);

export default router;
