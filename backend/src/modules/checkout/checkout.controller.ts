import { Response } from "express";
import { CheckoutService } from "./checkout.service";
import { catchAsync } from "../../common/utils/catchAsync";
import { AuthenticatedRequest } from "../../common/middlewares/auth.middleware";

export class CheckoutController {
  private checkoutService: CheckoutService;

  constructor() {
    this.checkoutService = new CheckoutService();
  }

  createCheckoutSession = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user._id || req.user.id;
    const checkoutData = await this.checkoutService.createCheckoutSession(userId, req.body);
    return res.status(202).json(checkoutData);
  });

  markAsPaid = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    const checkout = await this.checkoutService.markAsPaid(id, req.body);
    return res.status(200).json(checkout);
  });

  finalizeCheckout = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id as string;
    const order = await this.checkoutService.finalizeCheckout(id);
    return res.status(201).json(order);
  });
}
