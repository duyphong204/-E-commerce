import { Request, Response } from "express";
import { OrderService } from "./order.service";
import { catchAsync } from "../../common/utils/catchAsync";
import { AuthenticatedRequest } from "../../common/middlewares/auth.middleware";

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  getMyOrders = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id || req.user.id;
    const orders = await this.orderService.getMyOrders(userId);
    return res.status(200).json(orders);
  });

  getOrderById = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const order = await this.orderService.getOrderById(id);
    return res.status(200).json(order);
  });

  // Admin Controller handlers
  getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const data = await this.orderService.getAllOrders(page, limit);
    return res.status(200).json(data);
  });

  updateStatusOrder = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const { status } = req.body;
    const order = await this.orderService.updateOrderStatus(id, status);
    return res.status(200).json(order);
  });

  deleteOrder = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.orderService.deleteOrder(id);
    return res.status(200).json(result);
  });

  searchOrders = catchAsync(async (req: Request, res: Response) => {
    const term = (req.query.term as string) || "";
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await this.orderService.searchOrders(term, page, limit);
    return res.status(200).json(result);
  });
}
