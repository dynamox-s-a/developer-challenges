import { Request, Response, NextFunction } from "express";
import AppError from "../errors/app-error.js";

type RequestEntityTooLargeError = Error & {
  status?: number;
  type?: string;
};

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const payloadError = error as RequestEntityTooLargeError;

  if (payloadError.type === "entity.too.large" || payloadError.status === 413) {
    return res.status(413).json({
      status: "error",
      message: "Payload too large",
    });
  }

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
