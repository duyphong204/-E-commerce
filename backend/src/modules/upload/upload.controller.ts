import { Request, Response } from "express";
import { UploadService } from "./upload.service";
import { catchAsync } from "../../common/utils/catchAsync";
import { BadRequestException } from "../../common/exceptions/HttpException";

export class UploadController {
  private uploadService: UploadService;

  constructor() {
    this.uploadService = new UploadService();
  }

  uploadImage = catchAsync(async (req: Request, res: Response) => {
    const file = (req as any).file;
    if (!file) {
      throw new BadRequestException("Không có file được upload");
    }

    const result = await this.uploadService.uploadProductImage(file.buffer);

    return res.status(200).json({
      success: true,
      message: "Upload ảnh thành công",
      ...result,
    });
  });
}
