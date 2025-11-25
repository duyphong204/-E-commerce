const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

// Controller upload ảnh
const uploadImage = async (req, res) => {
    try {
        // 1. Kiểm tra có file upload không
        if (!req.file) return res.status(400).json({ success: false, message: "Không có file được upload" });

        // 2. Upload buffer lên Cloudinary (folder products, auto resize & optimize)
        const result = await uploadToCloudinary(req.file.buffer, {
            folder: 'products',
            transformation: [
                { width: 1000, crop: 'limit' },
                { quality: 'auto' },
                { fetch_format: 'auto' }
            ]
        });

        // 3. Trả về URL & public_id khi thành công
        return res.status(200).json({
            success: true,
            message: "Upload ảnh thành công",
            url: result.secure_url,
            publicId: result.public_id
        });

    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ success: false, message: "Lỗi khi upload ảnh", error: error.message });
    }
};

module.exports = { uploadImage };
