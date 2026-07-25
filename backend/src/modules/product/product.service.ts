import { ProductRepository } from "./product.repository";
import { CreateProductInput, UpdateProductInput } from "./product.schema";
import { BadRequestException, NotFoundException } from "../../common/exceptions/HttpException";
import { clearCachePattern } from "../../common/middlewares/cache.middleware";

export class ProductService {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository();
  }

  async getProductsByFilters(filters: any) {
    const {
      collection,
      size,
      color,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit = 12,
      page = 1,
      gender,
    } = filters;

    let query: any = {};

    if (collection && collection.toLowerCase() !== "all") {
      query.collections = collection;
    }
    if (category && category.toLowerCase() !== "all") {
      query.category = category;
    }
    if (material) {
      query.material = { $in: material.split(",") };
    }
    if (brand) {
      query.brand = { $in: brand.split(",") };
    }
    if (size) {
      query.sizes = { $in: size.split(",") };
    }
    if (color) {
      const colors = color.split(",").map((c: string) => c.trim());
      query.colors = { $in: colors };
    }
    if (gender) {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sort: any = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc": sort = { price: 1 }; break;
        case "priceDesc": sort = { price: -1 }; break;
        case "popularity": sort = { rating: -1 }; break;
        default: break;
      }
    }

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;

    const listSelect = "name price discountPrice images rating colors sizes countInStock brand category gender collections status isPublished soldCount createdAt";
    const data = await this.productRepository.findPaginated(query, pageNum, limitNum, sort, listSelect);
    return {
      products: data.results,
      page: data.page,
      totalPages: data.totalPages,
      totalItems: data.totalItems
    };
  }

  async getProductById(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Không tìm thấy sản phẩm");
    }
    return product;
  }

  async getSimilarProducts(id: string) {
    const product = await this.getProductById(id);
    const listSelect = "name price discountPrice images rating colors sizes countInStock brand category gender collections status isPublished soldCount createdAt";
    return this.productRepository.findSimilar(id, product.gender as string, product.category as string, 4, listSelect);
  }

  async getMostLikedProducts() {
    return this.productRepository.getMostLiked(8);
  }

  async getBestSellers() {
    const listSelect = "name price discountPrice images rating colors sizes countInStock brand category gender collections status isPublished soldCount createdAt";
    return this.productRepository.find(
      { isPublished: true, soldCount: { $gt: 0 } },
      { soldCount: -1, createdAt: -1 },
      8,
      listSelect
    );
  }

  async getNewArrivals() {
    const listSelect = "name price discountPrice images rating colors sizes countInStock brand category gender collections status isPublished soldCount createdAt";
    return this.productRepository.find({}, { createdAt: -1 }, 6, listSelect);
  }

  // Admin Methods
  async getAllProductsAdmin(page: number, limit: number) {
    const data = await this.productRepository.findPaginated({}, page, limit, { createdAt: -1 });
    const activeCount = await this.productRepository.count({ status: "active" });
    const lowStockCount = await this.productRepository.count({ countInStock: { $lt: 10 } });

    return {
      products: data.results,
      page: data.page,
      totalPages: data.totalPages,
      totalItems: data.totalItems,
      statistics: { activeCount, lowStockCount }
    };
  }

  async searchProductsAdmin(term: string, page: number, limit: number) {
    if (!term.trim()) {
      return { products: [], page: 1, totalPages: 1, totalItems: 0, statistics: { activeCount: 0, lowStockCount: 0 } };
    }

    const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapeRegex(term.trim()), "i");
    const query = {
      $or: [
        { name: regex },
        { sku: regex },
        { brand: regex },
        { category: regex }
      ]
    };

    const data = await this.productRepository.findPaginated(query, page, limit, { createdAt: -1 });
    const activeCount = await this.productRepository.count({ status: "active" });
    const lowStockCount = await this.productRepository.count({ countInStock: { $lt: 10 } });

    return {
      products: data.results,
      page: data.page,
      totalPages: data.totalPages,
      totalItems: data.totalItems,
      statistics: { activeCount, lowStockCount }
    };
  }

  async createProduct(data: CreateProductInput, userId: string) {
    const existing = await this.productRepository.findBySku(data.sku);
    if (existing) {
      throw new BadRequestException("Sản phẩm với mã SKU này đã tồn tại");
    }
    const product = await this.productRepository.create({ ...data, user: userId });
    await clearCachePattern("cache:/api/products*");
    return product;
  }

  async updateProduct(id: string, data: UpdateProductInput) {
    const product = await this.productRepository.update(id, data);
    if (!product) {
      throw new NotFoundException("Không tìm thấy sản phẩm");
    }
    await clearCachePattern("cache:/api/products*");
    return product;
  }

  async deleteProduct(id: string) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException("Không tìm thấy sản phẩm");
    }
    await this.productRepository.delete(id);
    await clearCachePattern("cache:/api/products*");
    return { message: "Xóa sản phẩm thành công" };
  }
}
