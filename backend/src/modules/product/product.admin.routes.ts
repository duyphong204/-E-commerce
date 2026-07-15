import { Router } from "express";
import { ProductController } from "./product.controller";
import { protect, admin } from "../../common/middlewares/auth.middleware";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import { createProductSchema, updateProductSchema } from "./product.schema";

const router = Router();
const productController = new ProductController();

router.use(protect as any, admin as any);

router.get("/products", productController.getAllProductsAdmin);
router.get("/products/search", productController.searchProductsAdmin);
router.post("/products", validateRequest(createProductSchema), productController.createProduct);
router.put("/products/:id", validateRequest(updateProductSchema), productController.updateProduct);
router.delete("/products/:id", productController.deleteProduct);

export default router;
