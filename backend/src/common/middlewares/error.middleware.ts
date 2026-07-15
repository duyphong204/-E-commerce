import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/HttpException";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error] ${error.stack || error.message}`);
  
  if (error instanceof HttpException) {
    return res.status(error.status).json({
      success: false,
      statusCode: error.status,
      error: error.name || "HttpException",
      message: error.message,
      errors: error.errors || null,
    });
  }

  // Handle Mongoose CastError (Invalid ObjectId format)
  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: "Bad Request",
      message: `Định dạng ID không hợp lệ: ${error.value}`,
      errors: null,
    });
  }

  // Handle MongoDB duplicate key error (code 11000)
  if (error.code === 11000) {
    const fields = Object.keys(error.keyValue || {}).join(", ");
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: "Bad Request",
      message: `Dữ liệu trùng lặp: Trường (${fields}) đã tồn tại trong hệ thống.`,
      errors: null,
    });
  }

  // Handle Mongoose ValidationError
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors || {}).map((err: any) => ({
      field: err.path,
      message: err.message,
    }));
    return res.status(400).json({
      success: false,
      statusCode: 400,
      error: "Bad Request",
      message: "Dữ liệu không khớp định dạng yêu cầu của hệ thống",
      errors,
    });
  }

  // Handle JWT errors
  if (error.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      statusCode: 401,
      error: "Unauthorized",
      message: "Mã xác thực không hợp lệ hoặc đã hết hạn",
      errors: null,
    });
  }

  // Generic 500 error for unhandled exceptions
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    success: false,
    statusCode,
    error: error.name || "InternalServerException",
    message: process.env.NODE_ENV === "production" 
      ? "Lỗi hệ thống nội bộ, vui lòng thử lại sau" 
      : error.message || "Internal Server Error",
  });
};
