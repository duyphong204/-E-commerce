import { Router } from "express";
import { ProductController } from "./product.controller";

const router = Router();
const productController = new ProductController();

// ----------------------
// User routes (Public)
// ----------------------
router.get("/filters", productController.getProductsByFilters);
router.get("/best-seller", productController.getBestSeller);
router.get("/most-liked", productController.getMostLikedProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/similar/:id", productController.getSimilarProducts);
router.get("/:id", productController.getProductById);

export default router;

