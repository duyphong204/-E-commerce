import { Router } from "express";
import { BannerController } from "./banner.controller";
import { protect, admin } from "../../common/middlewares/auth.middleware";
import { validateRequest } from "../../common/middlewares/validation.middleware";
import { createBannerSchema, updateBannerSchema } from "./banner.schema";
import { cacheMiddleware } from "../../common/middlewares/cache.middleware";

const router = Router();
const bannerController = new BannerController();

// Public route - User
router.get("/", cacheMiddleware(3600), bannerController.getActiveBanners);

// Admin routes (Protected)
router.get("/admin", protect as any, admin as any, bannerController.getAllBannersAdmin);
router.post("/", protect as any, admin as any, validateRequest(createBannerSchema), bannerController.createBanner);
router.put("/:id", protect as any, admin as any, validateRequest(updateBannerSchema), bannerController.updateBanner);
router.delete("/:id", protect as any, admin as any, bannerController.deleteBanner);
router.patch("/:id/toggle", protect as any, admin as any, bannerController.toggleBannerStatus);

export default router;
