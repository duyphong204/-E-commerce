import { Router } from "express";

// User modules
import userRoutes from "../modules/user/user.routes";
import productRoutes from "../modules/product/product.routes";
import cartRoutes from "../modules/cart/cart.routes";
import checkoutRoutes from "../modules/checkout/checkout.routes";
import orderRoutes from "../modules/order/order.routes";
import wishlistRoutes from "../modules/wishlist/wishlist.routes";
import reviewRoutes from "../modules/review/review.routes";
import couponRoutes from "../modules/coupon/coupon.routes";
import bannerRoutes from "../modules/banner/banner.routes";
import subscriberRoutes from "../modules/subscriber/subscriber.routes";
import aiRoutes from "../modules/ai/ai.routes";
import uploadRoutes from "../modules/upload/upload.routes";

// Admin modules
import userAdminRoutes from "../modules/user/user.admin.routes";
import productAdminRoutes from "../modules/product/product.admin.routes";
import couponAdminRoutes from "../modules/coupon/coupon.admin.routes";
import orderAdminRoutes from "../modules/order/order.admin.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";

const router = Router();

// User-facing endpoints
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/checkout", checkoutRoutes);
router.use("/orders", orderRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/reviews", reviewRoutes);
router.use("/coupons", couponRoutes);
router.use("/banners", bannerRoutes);
router.use("/subscriber", subscriberRoutes);
router.use("/ai", aiRoutes);
router.use("/upload", uploadRoutes);

// Admin-facing endpoints (under /admin prefix)
router.use("/admin", userAdminRoutes);       // maps /admin/users, /admin/users/search, etc.
router.use("/admin", productAdminRoutes);    // maps /admin/products, /admin/products/search, etc.
router.use("/admin", couponAdminRoutes);     // maps /admin/coupons, etc.
router.use("/admin", orderAdminRoutes);      // maps /admin/orders, etc.
router.use("/admin", dashboardRoutes);        // maps /admin/stats (dashboard stats)

export default router;
