import { UploadApiResponse, UploadApiOptions } from "cloudinary";
import cloudinary from "../../config/cloudinary";
const streamifier = require("streamifier");

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  options: UploadApiOptions = {}
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};
