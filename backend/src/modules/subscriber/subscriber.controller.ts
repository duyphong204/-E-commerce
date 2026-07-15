import { Request, Response } from "express";
import { SubscriberService } from "./subscriber.service";
import { catchAsync } from "../../common/utils/catchAsync";

export class SubscriberController {
  private subscriberService: SubscriberService;

  constructor() {
    this.subscriberService = new SubscriberService();
  }

  subscribe = catchAsync(async (req: Request, res: Response) => {
    const result = await this.subscriberService.subscribe(req.body);
    return res.status(201).json({ message: "Subscription successful", newSubscriber: result });
  });
}
