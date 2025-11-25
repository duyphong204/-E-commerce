const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = (fileBuffer, options = {}) => {
    return new Promise((resolve, reject) => {
        // tạo upload stream của Cloudinary
        const stream = cloudinary.uploader.upload_stream(
            options, // các tùy chọn (folder, public_id,...)
            (error, result) => {
                if (result) {
                    resolve(result);
                } else {
                    reject(error);
                }
            }
        );
        // Chuyển file buffer thành luồng dữ liệu và upload lên Cloudinary
        streamifier.createReadStream(fileBuffer).pipe(stream);
    });
};

module.exports = { uploadToCloudinary };