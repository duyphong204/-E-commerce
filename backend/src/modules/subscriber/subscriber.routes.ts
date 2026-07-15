import { Router } from "express";
import { SubscriberController } from "./subscriber.controller";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import { createSubscriberSchema } from "./subscriber.schema";

const router = Router();
const subscriberController = new SubscriberController();

router.post("/", validateRequest(createSubscriberSchema), subscriberController.subscribe);

export default router;
