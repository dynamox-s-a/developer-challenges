import { NextFunction, Request, Response } from 'express';
import { HttpStatusCode } from '../Controllers/Interfaces';

export default class ErrorHandler {
  public static handle(
    error: Error,
    _req: Request,
    res: Response,
    next: NextFunction
  ) {
    res.status(HttpStatusCode.SERVER_ERROR).json({ message: error.message });
    console.error(error.message);
    next();
  }
}
