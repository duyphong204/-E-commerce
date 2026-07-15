import Order from "../../models/Order";
import { paginate, PaginatedResult } from "../../common/utils/pagination";

export class OrderRepository {
  async findById(id: string) {
    return Order.findById(id);
  }

  async findPopulatedById(id: string) {
    return Order.findById(id).populate("user", "name email");
  }

  async getMyOrders(userId: string) {
    return Order.find({ user: userId }).sort({ createdAt: -1 }).lean();
  }

  async findPaginated(query: any, page: number, limit: number, sort: any): Promise<PaginatedResult<any>> {
    return paginate(Order as any, query, { page, limit, sort });
  }

  async populateOrders(orders: any[], populatePath: string, selectFields: string) {
    return Order.populate(orders, { path: populatePath, select: selectFields });
  }

  async getAllOrders() {
    return Order.find().lean();
  }

  async countProcessing() {
    return Order.countDocuments({ status: "Processing" });
  }

  async delete(id: string) {
    return Order.findByIdAndDelete(id);
  }
}
