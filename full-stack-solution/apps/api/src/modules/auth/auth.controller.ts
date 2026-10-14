import type { Request, Response } from "express";
import { loginSchema } from "@full-stack-solution/shared";
import type { AuthService } from "./auth.service";
import { getUserId } from "./auth.middleware";

export class AuthController {
  constructor(private readonly service: AuthService) {}

  login = async (req: Request, res: Response): Promise<void> => {
    const input = loginSchema.parse(req.body);
    res.json(await this.service.login(input));
  };

  me = async (req: Request, res: Response): Promise<void> => {
    res.json(await this.service.getCurrentUser(getUserId(req)));
  };

  logout = (_req: Request, res: Response): void => {
    res.status(204).end();
  };
}
