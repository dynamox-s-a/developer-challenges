import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const sendValidationError = (res: Response, error: z.ZodError) => {
  return res.status(400).json({
    message: "Validation failed",
    errors: error.issues.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    })),
  });
};

export const validateBody = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return sendValidationError(res, result.error);
    }

    req.body = result.data;
    next();
  };
};

export const validateParams = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return sendValidationError(res, result.error);
    }

    req.params = result.data as Request["params"];
    next();
  };
};
