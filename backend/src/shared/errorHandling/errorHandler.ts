import { NextFunction, Request, Response } from "express";
import { AppError } from "./appError";

export const ErrorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("Error: ", error);
  error.statusCode = error.statusCode || 500;
  error.status = error.status || "error";

  if (
    error.name === "JsonWebTokenError" ||
    error.name === "NotAuthorizedException"
  )
    error = handleJWTError();
  if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
  if (error.name === "CastError") error = handleCastErrorDB(error);
  if (error.name === "ValidationError") error = handleValidationErrorDB();
  if (error.code === 11000) error = handleDuplicateFieldDB(error);

  sendDevError(error, res);
};

function sendDevError(error: any, res: Response) {
  return res.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
  });
}

function handleDuplicateFieldDB(error: any) {
  const value = Object.entries(error.keyValue);
  const message = `Duplicate field value: ${value}`;
  return new AppError(message, 400);
}

function handleValidationErrorDB() {
  const message = `Invalid input data`;
  return new AppError(message, 400);
}

function handleCastErrorDB(error: any) {
  const message = `Invalid ${error.path}: ${error.value}`;
  return new AppError(message, 400);
}

function handleJWTError() {
  return new AppError("Invalid Token. Please login again", 401);
}

function handleJWTExpiredError() {
  return new AppError("Expired Token! Please login again", 401);
}
