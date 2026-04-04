import { Request, Response, NextFunction } from "express";
import AppError from "../errors/app-error.js";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  }

  console.error("Internal Error:", error);

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
};
