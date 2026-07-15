import { BannerRepository } from "./banner.repository";
import { CreateBannerInput, UpdateBannerInput } from "./banner.schema";
import { NotFoundException } from "../../common/exceptions/HttpException";
import { clearCachePattern } from "../../common/middlewares/cache.middleware";

export class BannerService {
  private bannerRepository: BannerRepository;

  constructor() {
    this.bannerRepository = new BannerRepository();
  }

  async getActiveBanners() {
    return this.bannerRepository.getActiveBanners();
  }

  async getAllBannersAdmin() {
    return this.bannerRepository.getAllBanners();
  }

  async createBanner(data: CreateBannerInput) {
    const banner = await this.bannerRepository.create({
      ...data,
      altText: data.altText || data.title,
    });
    await clearCachePattern("cache:/api/banners*");
    return banner;
  }

  async updateBanner(id: string, updates: UpdateBannerInput) {
    const banner = await this.bannerRepository.update(id, updates);
    if (!banner) {
      throw new NotFoundException("Banner not found");
    }
    await clearCachePattern("cache:/api/banners*");
    return banner;
  }

  async deleteBanner(id: string) {
    const banner = await this.bannerRepository.delete(id);
    if (!banner) {
      throw new NotFoundException("Banner not found");
    }
    await clearCachePattern("cache:/api/banners*");
    return { message: "Banner deleted successfully" };
  }

  async toggleBannerStatus(id: string) {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new NotFoundException("Banner not found");
    }

    banner.isActive = !banner.isActive;
    await banner.save();
    
    await clearCachePattern("cache:/api/banners*");

    return {
      message: `Banner ${banner.isActive ? "activated" : "deactivated"}`,
      banner,
    };
  }
}
