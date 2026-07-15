import Product from "../../models/Product";
import User from "../../models/User";
import { paginate, PaginatedResult } from "../../common/utils/pagination";

export class ProductRepository {
  async findById(id: string) {
    return Product.findById(id);
  }

  async findBySku(sku: string) {
    return Product.findOne({ sku });
  }

  async create(productData: any) {
    return Product.create(productData);
  }

  async update(id: string, updateData: any) {
    return Product.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string) {
    return Product.findByIdAndDelete(id);
  }

  async count(query: any = {}) {
    return Product.countDocuments(query);
  }

  async findPaginated(query: any, page: number, limit: number, sort: any, select?: any): Promise<PaginatedResult<any>> {
    return paginate(Product as any, query, { page, limit, sort, select });
  }

  async find(query: any = {}, sort: any = {}, limit: number = 0, select?: any) {
    let q: any = Product.find(query).sort(sort);
    if (select) {
      q = q.select(select);
    }
    if (limit > 0) {
      q = q.limit(limit);
    }
    return q;
  }

  async findSimilar(id: string, gender: string, category: string, limit: number = 4, select?: any) {
    let q: any = Product.find({
      _id: { $ne: id },
      gender,
      category,
    });
    if (select) {
      q = q.select(select);
    }
    return q.limit(limit);
  }

  async getMostLiked(limit: number = 8) {
    return User.aggregate([
      { $unwind: "$wishlist" },
      {
        $group: {
          _id: "$wishlist",
          likeCount: { $sum: 1 }
        }
      },
      { $sort: { likeCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails"
        }
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: "$productDetails._id",
          name: "$productDetails.name",
          price: "$productDetails.price",
          discountPrice: "$productDetails.discountPrice",
          images: "$productDetails.images",
          rating: "$productDetails.rating",
          likeCount: 1
        }
      }
    ]);
  }
}
