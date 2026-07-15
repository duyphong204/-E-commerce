import { Router } from "express";
import { UserController } from "./user.controller";
import { protect, admin } from "../../common/middlewares/auth.middleware";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import {
  adminCreateUserSchema,
  adminUpdateUserSchema,
  adminGetAllUsersQuerySchema,
  adminSearchUserQuerySchema,
} from "./user.schema";

const router = Router();
const userController = new UserController();

// All admin user routes are protected by protect and admin
router.use(protect as any, admin as any);

router.get("/users", validateRequest(adminGetAllUsersQuerySchema), userController.getAllUsers);
router.get("/users/search", validateRequest(adminSearchUserQuerySchema), userController.searchUser);
router.post("/users", validateRequest(adminCreateUserSchema), userController.createUser);
router.put("/users/:id", validateRequest(adminUpdateUserSchema), userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

export default router;
