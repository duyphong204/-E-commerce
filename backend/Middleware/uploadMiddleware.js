const multer = require('multer');

// Memory storage
const storage = multer.memoryStorage();

// File filter - chỉ cho phép ảnh
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, WebP)'), false);
    }
};

// Multer config với validation
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    }
});

module.exports = upload;