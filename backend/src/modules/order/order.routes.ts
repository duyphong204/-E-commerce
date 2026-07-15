import { Router } from "express";
import { OrderController } from "./order.controller";
import { protect } from "../../common/middlewares/auth.middleware";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import { getOrderByIdSchema } from "./order.schema";

const router = Router();
const orderController = new OrderController();

// ----------------------
// User routes (Protected)
// ----------------------
router.get("/my-orders", protect as any, orderController.getMyOrders);
router.get("/:id", protect as any, validateRequest(getOrderByIdSchema), orderController.getOrderById);

export default router;

