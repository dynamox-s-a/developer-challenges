export default class AppError extends Error {
  statusCode: number;
  stack?: string | undefined;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
