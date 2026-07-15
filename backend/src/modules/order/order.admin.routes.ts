import { Router } from "express";
import { OrderController } from "./order.controller";
import { protect, admin } from "../../common/middlewares/auth.middleware";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import {
  getOrderByIdSchema,
  updateOrderStatusSchema,
  deleteOrderSchema,
  getAllOrdersQuerySchema,
  searchOrdersQuerySchema,
} from "./order.schema";

const router = Router();
const orderController = new OrderController();

router.use(protect as any, admin as any);

router.get("/orders/search", validateRequest(searchOrdersQuerySchema), orderController.searchOrders);
router.get("/orders/:id", validateRequest(getOrderByIdSchema), orderController.getOrderById);
router.get("/orders", validateRequest(getAllOrdersQuerySchema), orderController.getAllOrders);
router.put("/orders/:id", validateRequest(updateOrderStatusSchema), orderController.updateStatusOrder);
router.delete("/orders/:id", validateRequest(deleteOrderSchema), orderController.deleteOrder);

export default router;
