const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
    {
        imageUrl: {
            type: String,
            required: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        altText: {
            type: String,
            trim: true,
            default: "",
        },
        order: { // order field là một trường kiểu Number dùng để xác định thứ tự hiển thị của banner.
            type: Number,
            default: 0,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Index để sort nhanh theo order
bannerSchema.index({ order: 1, isActive: 1 });

module.exports = mongoose.model("Banner", bannerSchema);
