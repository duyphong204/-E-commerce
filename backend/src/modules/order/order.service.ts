import { OrderRepository } from "./order.repository";
import { NotFoundException, BadRequestException } from "../../common/exceptions/HttpException";

export class OrderService {
  private orderRepository: OrderRepository;

  constructor() {
    this.orderRepository = new OrderRepository();
  }

  async getMyOrders(userId: string) {
    return this.orderRepository.getMyOrders(userId);
  }

  async getOrderById(id: string) {
    const order = await this.orderRepository.findPopulatedById(id);
    if (!order) {
      throw new NotFoundException("Không tìm thấy đơn hàng");
    }
    return order;
  }

  // Admin methods
  async getAllOrders(page: number, limit: number) {
    const data = await this.orderRepository.findPaginated({}, page, limit, { createdAt: -1 });
    const results = await this.orderRepository.populateOrders(data.results, "user", "name email");

    const allOrders = await this.orderRepository.getAllOrders();
    const totalSales = allOrders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);
    const processingCount = await this.orderRepository.countProcessing();

    return {
      ...data,
      results,
      totalSales,
      processingCount,
    };
  }

  async updateOrderStatus(id: string, status: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException("Không tìm thấy đơn hàng");
    }

    order.status = status as any;
    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    if (!order.subtotal) {
      order.subtotal = order.orderItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
    }

    await order.save({ validateBeforeSave: true });
    return this.orderRepository.findPopulatedById(id);
  }

  async deleteOrder(id: string) {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new NotFoundException("Không tìm thấy đơn hàng");
    }
    await order.deleteOne();
    return { message: "Xóa đơn hàng thành công" };
  }

  async searchOrders(term: string, page: number, limit: number) {
    const trimmed = term.trim();
    if (!trimmed) {
      return { results: [], page: 1, totalPages: 1, totalItems: 0 };
    }

    let query: any = {};
    if (/^[a-f\d]{24}$/i.test(trimmed)) {
      query = { _id: trimmed };
    } else {
      const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escapeRegex(trimmed), "i");
      query = {
        $or: [
          { "shippingAddress.address": regex },
          { "shippingAddress.city": regex },
          { "shippingAddress.country": regex },
          { "shippingAddress.postalCode": regex },
        ],
      };
    }

    const data = await this.orderRepository.findPaginated(query, page, limit, { createdAt: -1 });
    const results = await this.orderRepository.populateOrders(data.results, "user", "name email");

    const allOrders = await this.orderRepository.getAllOrders();
    const totalSales = allOrders.reduce((sum: number, o: any) => sum + (o.totalPrice || 0), 0);
    const processingCount = await this.orderRepository.countProcessing();

    return {
      ...data,
      results,
      totalSales,
      processingCount,
    };
  }
}
