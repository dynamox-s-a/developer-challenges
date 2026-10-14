import { compare, hashSync } from "bcryptjs";
import type {
  AuthUser,
  LoginInput,
  LoginResponse,
} from "@full-stack-solution/shared";
import { UnauthorizedError } from "../../shared/errors/app-error";
import type { AuthRepository } from "./auth.repository";
import type { TokenService } from "./token.service";

const DUMMY_HASH = hashSync("not-a-real-password", 10);

export class AuthService {
  constructor(
    private readonly repository: AuthRepository,
    private readonly tokenService: TokenService,
  ) {}

  async login({ email, password }: LoginInput): Promise<LoginResponse> {
    const user = await this.repository.findCredentialsByEmail(email);
    const passwordMatches = await compare(
      password,
      user?.password ?? DUMMY_HASH,
    );

    if (!user || !passwordMatches) {
      throw new UnauthorizedError("Invalid email or password");
    }

    return {
      accessToken: this.tokenService.sign(user.id),
      user: { id: user.id, email: user.email },
    };
  }

  async getCurrentUser(userId: string): Promise<AuthUser> {
    const user = await this.repository.findById(userId);
    if (!user) {
      throw new UnauthorizedError("User no longer exits");
    }
    return user;
  }
}
