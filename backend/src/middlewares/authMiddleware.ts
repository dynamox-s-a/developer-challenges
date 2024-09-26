import { AppError } from "../shared/errorHandling/appError";
import userService from "../modules/user/userService";
import { JwtPayload } from "jsonwebtoken";
import { decodeJwt } from "../shared/utils/jwtHandler";
import { Handler, NextFunction, Response, Request } from "express";
import { catchAsync } from "../shared/errorHandling/catchAsync";

class AuthMiddleware {
  tokenHandler: Handler = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
      const authorization = req.headers.authorization;
      let token;
      if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.split(" ")[1];
      }
      if (!token) {
        throw new AppError("You are not logged in", 401);
      }
      const decoded: JwtPayload | string = decodeJwt(token);
      const currentUser: any = await userService.getUser(decoded._id);
      if (!currentUser) {
        throw new AppError("User no longer exists", 401);
      }

      req.user = currentUser;
      next();
    },
  );
  restrictTo = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user!.profile)) {
        throw new AppError(
          "Você não tem permissão para realisar esta ação!",
          403,
        );
      }
      next();
    };
  };
}

export default new AuthMiddleware();
