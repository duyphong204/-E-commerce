const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Không có token, truy cập bị từ chối" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User không tồn tại" });
    }

    // Gắn user vào request
    req.user = user;
    next();
  } catch (err) {
    console.error("Token error:", err);

    // Phân biệt lỗi token hết hạn vs invalid
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token đã hết hạn",
        expired: true
      });
    }
    res.status(401).json({ message: "Token không hợp lệ" });
  }
};

const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: "Không có thông tin user" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Chỉ admin mới có quyền truy cập" });
  }

  next();
};

module.exports = { protect, admin };