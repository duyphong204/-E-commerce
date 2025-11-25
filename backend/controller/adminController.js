const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { paginate } = require("../utils/pagination");

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const adminController = {
  getAllUsers: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const data = await paginate(User, {}, { page, limit, sort: { createdAt: -1 } });

      data.results = data.results.map(u => {
        const { password, ...rest } = u.toObject();
        return rest;
      });

      const adminCount = await User.countDocuments({ role: "admin" });
      const customerCount = await User.countDocuments({ role: "customer" });

      res.json({ ...data, statistics: { adminCount, customerCount } });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  searchUser: async (req, res) => {
    try {
      const { term, page = 1, limit = 10 } = req.query;
      if (!term?.trim()) {
        return res.json({ results: [], page: 1, totalPages: 1, totalItems: 0 });
      }

      const regex = new RegExp(escapeRegex(term.trim()), "i");
      const query = { $or: [{ name: regex }, { email: regex }] };

      const data = await paginate(User, query, { page, limit, sort: { createdAt: -1 } });

      data.results = data.results.map(u => {
        const { password, ...rest } = u.toObject();
        return rest;
      });

      const adminCount = await User.countDocuments({ role: "admin" });
      const customerCount = await User.countDocuments({ role: "customer" });

      res.json({ ...data, statistics: { adminCount, customerCount } });
    } catch (error) {
      console.error("searchUser error:", error);
      res.status(500).json({ message: "Server error" });
    }
  },

  createUser: async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
      const newUser = new User({ name, email, password, role: role || "customer" });
      await newUser.save();

      const { password: _, ...userWithoutPassword } = newUser.toObject();
      res.status(201).json({ message: "User created", newUser: userWithoutPassword });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  updateUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const { name, email, role, password } = req.body;
      //  KIỂM TRA: Không cho admin thay đổi role của chính mình
      if (req.user._id.toString() === user._id.toString() && role && role !== user.role) {
        return res.status(403).json({
          message: "Không thể thay đổi quyền của chính mình"
        });
      }

      // KIỂM TRA: Không cho hạ cấp admin cuối cùng
      if (user.role === "admin" && role === "customer") {
        const adminCount = await User.countDocuments({ role: "admin" });
        if (adminCount <= 1) {
          return res.status(403).json({
            message: "Không thể hạ cấp admin cuối cùng trong hệ thống"
          });
        }
      }
      if (name) user.name = name;
      if (email) user.email = email;
      if (role) user.role = role;
      if (password) user.password = password;

      const updatedUser = await user.save();
      const { password: _, ...rest } = updatedUser.toObject();
      res.json(rest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });
      // Kiểm tra: Không cho xóa chính mình
      if (req.user._id.toString() === user._id.toString()) {
        return res.status(403).json({
          message: "Không thể xóa tài khoản của chính mình"
        });
      }

      // KIỂM TRA: Không cho xóa admin cuối cùng
      if (user.role === "admin") {
        const adminCount = await User.countDocuments({ role: "admin" });
        if (adminCount <= 1) {
          return res.status(403).json({
            message: "Không thể xóa admin cuối cùng trong hệ thống"
          });
        }
      }
      await user.deleteOne();
      res.json({ message: "User deleted" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = adminController;