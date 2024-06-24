
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from '../user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UnauthorizedError } from 'src/errors/UnauthorizedError';
import { UserPayload } from './model/UserPayload';
import { UserToken } from './model/UserToken';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService,
        private readonly userService: UserService) { }


    async login(email: string, password: string): Promise<UserToken> {
        const user: User = await this.validateUser(email, password);

        const payload: UserPayload = {
            username: user.email,
            sub: user.id,
        };

        return {
            acessToken: this.jwtService.sign(payload),
            userData: {
                id: user.id,
                email: user.email,
                name: user.name,
            }
        };
    }
    private async validateUser(email: string, password: string) {
        const user = await this.userService.findByEmail(email);

        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                return {
                    ...user,
                    password: undefined,
                }
            }
        }

        throw new UnauthorizedError(
            'Email ou senha inválidos'
        )
    }
    
}
