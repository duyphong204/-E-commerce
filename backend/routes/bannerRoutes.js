const express = require("express");
const router = express.Router();
const { getActiveBanners, getAllBannersAdmin, createBanner, updateBanner, deleteBanner, toggleBannerStatus, } = require("../controller/bannerController");
const { protect, admin } = require("../Middleware/authMiddleware");

// Public route - User
router.get("/", getActiveBanners);

// Admin routes
router.get("/admin", protect, admin, getAllBannersAdmin);
router.post("/", protect, admin, createBanner);
router.put("/:id", protect, admin, updateBanner);
router.delete("/:id", protect, admin, deleteBanner);
router.patch("/:id/toggle", protect, admin, toggleBannerStatus);

module.exports = router;