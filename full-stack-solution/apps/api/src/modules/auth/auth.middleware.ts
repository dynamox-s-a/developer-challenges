import type { Request, RequestHandler } from "express";
import { UnauthorizedError } from "../../shared/errors/app-error";
import type { TokenService } from "./token.service";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export function createAuthMiddleware(
  tokenService: TokenService,
): RequestHandler {
  return (req, _res, next) => {
    const [scheme, token] = (req.headers.authorization ?? "").split(" ");
    if (scheme?.toLowerCase() !== "bearer" || !token) {
      throw new UnauthorizedError();
    }
    req.userId = tokenService.verify(token);
    next();
  };
}

export function getUserId(req: Request): string {
  if (!req.userId) {
    throw new UnauthorizedError();
  }
  return req.userId;
}
