import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/user.repository';

export function createAuthService(userRepository: UserRepository) {
  return {
    validateCredentials: async (email: string, password: string) => {
      const user = await userRepository.findByEmail(email);

      if (!user) {
        return null;
      }

      const isValid = await bcrypt.compare(password, user.password);
      return isValid ? user : null;
    },
  };
}

export type AuthService = ReturnType<typeof createAuthService>;
