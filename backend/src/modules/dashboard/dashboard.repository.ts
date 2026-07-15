import Order from "../../models/Order";
import Product from "../../models/Product";
import User from "../../models/User";

export class DashboardRepository {
  async getTotalRevenueAndOrders() {
    return Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: "$totalPrice" }, count: { $sum: 1 } } },
    ]);
  }

  async getSalesDataOverTime(startDate: Date, dateGroupFormat: string) {
    return Order.aggregate([
      {
        $match: {
          isPaid: true,
          createdAt: { $gte: startDate },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: dateGroupFormat, date: "$createdAt" } },
          sales: { $sum: "$totalPrice" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async getTopSellingProducts() {
    return Order.aggregate([
      { $match: { isPaid: true } },
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.productId",
          name: { $first: "$orderItems.name" },
          image: { $first: "$orderItems.image" },
          totalSold: { $sum: "$orderItems.quantity" },
          revenue: { $sum: { $multiply: ["$orderItems.price", "$orderItems.quantity"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },
    ]);
  }

  async getLowStockProducts() {
    return Product.find({ countInStock: { $lt: 10 } })
      .select("name countInStock images")
      .limit(5)
      .lean();
  }

  async getTotalUsers() {
    return User.countDocuments();
  }

  async getTopWishlistProducts() {
    return User.aggregate([
      { $unwind: "$wishlist" },
      {
        $group: {
          _id: "$wishlist",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 1,
          name: "$product.name",
          image: { $arrayElemAt: ["$product.images.url", 0] },
          count: 1,
        },
      },
    ]);
  }
}
