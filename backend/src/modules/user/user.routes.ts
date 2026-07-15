import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import { loginSchema, registerSchema } from "./user.schema";

import { authLimiter } from "../../common/middlewares/rateLimit.middleware";

const router = Router();
const userController = new UserController();

router.post("/login", authLimiter, validateRequest(loginSchema), userController.login);
router.post("/register", authLimiter, validateRequest(registerSchema), userController.register);
router.get("/profile", userController.getProfile);
router.post("/refresh-token", authLimiter, userController.refreshToken);
router.post("/logout", userController.logout);

export default router;
