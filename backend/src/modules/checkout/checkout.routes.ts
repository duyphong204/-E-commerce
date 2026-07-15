import { Router } from "express";
import { CheckoutController } from "./checkout.controller";
import { protect } from "../../common/middlewares/auth.middleware";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import { createCheckoutSchema, markAsPaidSchema, finalizeCheckoutSchema } from "./checkout.schema";

const router = Router();
const checkoutController = new CheckoutController();

router.use(protect as any); // All checkout routes require authentication

router.post("/", validateRequest(createCheckoutSchema), checkoutController.createCheckoutSession);
router.put("/:id/pay", validateRequest(markAsPaidSchema), checkoutController.markAsPaid);
router.post("/:id/finalize", validateRequest(finalizeCheckoutSchema), checkoutController.finalizeCheckout);

export default router;
