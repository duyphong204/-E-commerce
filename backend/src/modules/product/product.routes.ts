import { Router } from "express";
import { ProductController } from "./product.controller";
import { cacheMiddleware } from "../../common/middlewares/cache.middleware";

const router = Router();
const productController = new ProductController();

router.get("/filters", cacheMiddleware(300), productController.getProductsByFilters);
router.get("/best-seller", cacheMiddleware(3600), productController.getBestSeller);
router.get("/most-liked", cacheMiddleware(3600), productController.getMostLikedProducts);
router.get("/new-arrivals", cacheMiddleware(3600), productController.getNewArrivals);
router.get("/similar/:id", cacheMiddleware(3600), productController.getSimilarProducts);
router.get("/:id", cacheMiddleware(3600), productController.getProductById);

export default router;

