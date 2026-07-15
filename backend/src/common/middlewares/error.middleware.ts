import { Request, Response, NextFunction } from "express";
import { HttpException } from "../exceptions/HttpException";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(`[Error] ${error.message}`);
  
  if (error instanceof HttpException) {
    return res.status(error.status).json({
      success: false,
      message: error.message,
      errors: error.errors || null,
    });
  }

  // Handle Mongoose ValidationError if needed here or generic error
  return res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
};
