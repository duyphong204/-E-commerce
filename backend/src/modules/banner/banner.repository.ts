import Banner from "../../models/Banner";

export class BannerRepository {
  async getActiveBanners() {
    return Banner.find({ isActive: true }).sort({ order: 1 });
  }

  async getAllBanners() {
    return Banner.find().sort({ order: 1 });
  }

  async findById(id: string) {
    return Banner.findById(id);
  }

  async create(bannerData: any) {
    return Banner.create(bannerData);
  }

  async update(id: string, updates: any) {
    return Banner.findByIdAndUpdate(id, updates, { new: true });
  }

  async delete(id: string) {
    return Banner.findByIdAndDelete(id);
  }
}
