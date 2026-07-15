import { Request, Response } from "express";
import { BannerService } from "./banner.service";
import { catchAsync } from "../../common/utils/catchAsync";

export class BannerController {
  private bannerService: BannerService;

  constructor() {
    this.bannerService = new BannerService();
  }

  getActiveBanners = catchAsync(async (req: Request, res: Response) => {
    const banners = await this.bannerService.getActiveBanners();
    return res.status(200).json(banners);
  });

  getAllBannersAdmin = catchAsync(async (req: Request, res: Response) => {
    const banners = await this.bannerService.getAllBannersAdmin();
    return res.status(200).json(banners);
  });

  createBanner = catchAsync(async (req: Request, res: Response) => {
    const result = await this.bannerService.createBanner(req.body);
    return res.status(201).json({ message: "Banner created successfully", banner: result });
  });

  updateBanner = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.bannerService.updateBanner(id, req.body);
    return res.status(200).json({ message: "Banner updated successfully", banner: result });
  });

  deleteBanner = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.bannerService.deleteBanner(id);
    return res.status(200).json(result);
  });

  toggleBannerStatus = catchAsync(async (req: Request, res: Response) => {
    const id = req.params.id as string;
    const result = await this.bannerService.toggleBannerStatus(id);
    return res.status(200).json(result);
  });
}
