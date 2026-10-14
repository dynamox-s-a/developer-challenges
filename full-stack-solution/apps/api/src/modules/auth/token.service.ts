import { sign, verify, type SignOptions } from "jsonwebtoken";
import { UnauthorizedError } from "../../shared/errors/app-error";

const ALGORITHM = "HS256" as const;

export class TokenService {
  constructor(
    private readonly secret: string,
    private readonly expiresIn: string | number,
  ) {}

  sign(userId: string): string {
    return sign({}, this.secret, {
      subject: userId,
      algorithm: ALGORITHM,
      expiresIn: this.expiresIn as SignOptions["expiresIn"],
    });
  }

  verify(token: string): string {
    try {
      const payload = verify(token, this.secret, { algorithms: [ALGORITHM] });
      if (typeof payload === "string" || !payload.sub) {
        throw new Error("Token has no subject");
      }
      return payload.sub;
    } catch {
      throw new UnauthorizedError("Invalid or expired token");
    }
  }
}
