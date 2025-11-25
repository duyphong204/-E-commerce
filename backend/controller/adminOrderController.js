const Order = require("../models/Order");
const { paginate } = require("../utils/pagination");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const adminOrderController = {
  getAllOrders: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const data = await paginate(Order, {}, { page, limit, sort: { createdAt: -1 } });
      const results = await Order.populate(data.results, { path: "user", select: "name email" });

      const allOrders = await Order.find();
      const totalSales = allOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const processingCount = await Order.countDocuments({ status: "Processing" });

      res.json({ ...data, results, totalSales, processingCount });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateStatusOrder: async (req, res) => {
    try {
      console.log("Update order request:", { id: req.params.id, body: req.body });

      const order = await Order.findById(req.params.id).populate("user", "name email");
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      const { status } = req.body;
      if (status) {
        order.status = status;
        if (status === "Delivered") {
          order.isDelivered = true;
          order.deliveredAt = Date.now();
        }
      }

      // Xác thực các trường bắt buộc tồn tại trước khi lưu
      if (!order.subtotal || order.subtotal === undefined) {
        order.subtotal = order.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }

      const updatedOrder = await order.save({ validateBeforeSave: true });
      res.json(updatedOrder);
    } catch (err) {
      console.error("Update order error:", err.message);
      console.error("Stack trace:", err.stack);
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  deleteOrder: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ message: "Order not found" });
      await order.deleteOne();
      res.json({ message: "Order removed" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },

  searchOrders: async (req, res) => {
    try {
      const { term, page = 1, limit = 10 } = req.query;
      if (!term?.trim()) {
        return res.json({ results: [], page: 1, totalPages: 1, totalItems: 0 });
      }

      const trimmed = term.trim();
      let query = {};

      if (/^[a-f\d]{24}$/i.test(trimmed)) {
        query = { _id: trimmed };
      } else {
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

      const data = await paginate(Order, query, { page, limit, sort: { createdAt: -1 } });
      const results = await Order.populate(data.results, { path: "user", select: "name email" });

      const allOrders = await Order.find();
      const totalSales = allOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
      const processingCount = await Order.countDocuments({ status: "Processing" });

      res.json({ ...data, results, totalSales, processingCount });
    } catch (error) {
      console.error("searchOrders error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  getOrderById: async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate("user", "name email");
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = adminOrderController;