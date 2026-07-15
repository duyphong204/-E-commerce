import { BannerRepository } from "./banner.repository";
import { CreateBannerInput, UpdateBannerInput } from "./banner.schema";
import { NotFoundException } from "../../common/exceptions/HttpException";

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
    return this.bannerRepository.create({
      ...data,
      altText: data.altText || data.title,
    });
  }

  async updateBanner(id: string, updates: UpdateBannerInput) {
    const banner = await this.bannerRepository.update(id, updates);
    if (!banner) {
      throw new NotFoundException("Banner not found");
    }
    return banner;
  }

  async deleteBanner(id: string) {
    const banner = await this.bannerRepository.delete(id);
    if (!banner) {
      throw new NotFoundException("Banner not found");
    }
    return { message: "Banner deleted successfully" };
  }

  async toggleBannerStatus(id: string) {
    const banner = await this.bannerRepository.findById(id);
    if (!banner) {
      throw new NotFoundException("Banner not found");
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    return {
      message: `Banner ${banner.isActive ? "activated" : "deactivated"}`,
      banner,
    };
  }
}
