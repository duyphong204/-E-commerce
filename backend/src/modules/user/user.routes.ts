import { Router } from "express";
import { UserController } from "./user.controller";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import { loginSchema, registerSchema } from "./user.schema";

const router = Router();
const userController = new UserController();

router.post("/login", validateRequest(loginSchema), userController.login);
router.post("/register", validateRequest(registerSchema), userController.register);
router.get("/profile", userController.getProfile); // Note: Should have auth middleware here
router.post("/refresh-token", userController.refreshToken);
router.post("/logout", userController.logout);

export default router;
