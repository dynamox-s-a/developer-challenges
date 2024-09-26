import { NextFunction, Request, Response } from "express";

// handling try/catch situations
export const catchAsync = (fn: any) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};
