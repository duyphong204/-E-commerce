const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt");

const UserController = {
  // Đăng nhập
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(401)
          .json({ message: "Email hoặc mật khẩu không đúng." });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Email hoặc mật khẩu không đúng." });
      }
      const accessToken = generateAccessToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        message: "Đăng nhập thành công",
        user: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        accessToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Đăng ký
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ message: "Email đã được đăng ký" });
      }

      const newUser = await User.create({ name, email, password });

      // Tạo tokens
      const accessToken = generateAccessToken(newUser._id);
      const refreshToken = generateRefreshToken(newUser._id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        message: "Đăng ký thành công",
        user: {
          _id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
        accessToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  // Lấy thông tin user
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Không tìm thấy người dùng" });
      }
      return res.json({ user });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  },

  refreshToken: async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const accessToken = generateAccessToken(decoded.id);

      const newRefreshToken = generateRefreshToken(decoded.id);

      // Cập nhật refresh token trong cookie
      res.cookie("refreshToken", newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ accessToken });
    } catch (err) {
      // Clear cookie nếu token invalid
      res.clearCookie("refreshToken");
      res.status(401).json({ message: "Invalid refresh token" });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie("refreshToken");
      res.json({ message: "Đăng xuất thành công" });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  },
};

module.exports = UserController;
