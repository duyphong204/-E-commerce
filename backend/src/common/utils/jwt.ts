import jwt from "jsonwebtoken";

export const generateAccessToken = (id: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not defined");
  }
  return jwt.sign({ id }, secret, {
    expiresIn: "24h",
  });
};

export const generateRefreshToken = (userId: string): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET environment variable is not defined");
  }
  return jwt.sign({ id: userId }, secret, {
    expiresIn: "7d",
  });
};
