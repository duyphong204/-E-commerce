const Banner = require("../models/Banner");

// Lấy banners active cho user
const getActiveBanners = async (req, res) => {
    try {
        const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
        return res.status(200).json(banners);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Lấy tất cả banners cho admin
const getAllBannersAdmin = async (req, res) => {
    try {
        const banners = await Banner.find().sort({ order: 1 });
        return res.status(200).json(banners);
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Tạo banner
const createBanner = async (req, res) => {
    try {
        const { imageUrl, title, altText, order } = req.body;
        if (!imageUrl || !title) {
            return res.status(400).json({ message: "Image URL and title are required" });
        }

        const newBanner = await Banner.create({
            imageUrl,
            title,
            altText: altText || title,
            order: order || 0,
        });

        return res.status(201).json({ message: "Banner created successfully", banner: newBanner });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Cập nhật banner
const updateBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const banner = await Banner.findByIdAndUpdate(id, updates, { new: true });
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        return res.status(200).json({ message: "Banner updated successfully", banner });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Xóa banner
const deleteBanner = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findByIdAndDelete(id);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }
        return res.status(200).json({ message: "Banner deleted successfully" });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Toggle active/inactive
const toggleBannerStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await Banner.findById(id);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }

        banner.isActive = !banner.isActive;
        await banner.save();

        return res.status(200).json({
            message: `Banner ${banner.isActive ? 'activated' : 'deactivated'}`,
            banner
        });
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message });
    }
};

module.exports = {
    getActiveBanners,
    getAllBannersAdmin,
    createBanner,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
};
