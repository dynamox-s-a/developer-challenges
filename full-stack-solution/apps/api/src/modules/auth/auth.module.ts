import { AuthController } from "./auth.controller";
import { createAuthMiddleware } from "./auth.middleware";
import { AuthRepository } from "./auth.repository";
import { createAuthRouter } from "./auth.routes";
import { AuthService } from "./auth.service";
import { TokenService } from "./token.service";

export function createAuthModule(
  repository: AuthRepository,
  tokenService: TokenService,
) {
  const authenticate = createAuthMiddleware(tokenService);
  const service = new AuthService(repository, tokenService);
  const controller = new AuthController(service);

  return { authenticate, router: createAuthRouter(controller, authenticate) };
}
