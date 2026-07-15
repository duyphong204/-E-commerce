import { uploadToCloudinary } from "../../common/utils/cloudinary";
import { BadRequestException } from "../../common/exceptions/HttpException";

export class UploadService {
  async uploadProductImage(fileBuffer: Buffer) {
    if (!fileBuffer) {
      throw new BadRequestException("Không có file được upload");
    }

    try {
      const result = await uploadToCloudinary(fileBuffer, {
        folder: "products",
        transformation: [
          { width: 1000, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
      };
    } catch (error: any) {
      console.error("Cloudinary upload error:", error);
      throw new BadRequestException(`Lỗi khi upload ảnh: ${error.message}`);
    }
  }
}
