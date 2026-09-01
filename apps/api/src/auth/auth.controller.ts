import { BadRequestException, Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';

import {
  ErrorResponse,
  LoginResponse,
  SessionUserResponse,
} from '../common/api-schemas';

import { AuthService, type PublicUser } from './auth.service';
import type { JwtPayload } from './jwt-auth.guard';
import { Public } from './public.decorator';

interface LoginDto {
  email: string;
  password: string;
}

const EMAIL_PATTERN = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;
const LOGIN_KEYS = ['email', 'password'] as const;

function parseLoginDto(body: unknown): LoginDto {
  const dto = (body ?? {}) as Partial<LoginDto>;

  // Mesma política dos demais corpos da API (e do que o contrato publica): propriedade
  // desconhecida é 400, não silêncio.
  const unknown = Object.keys(dto).filter(
    (key) => !(LOGIN_KEYS as readonly string[]).includes(key),
  );
  if (unknown.length > 0) {
    throw new BadRequestException({
      code: 'INVALID_CREDENTIALS_PAYLOAD',
      message: `Propriedade(s) não suportada(s): ${unknown.join(', ')}. Aceitos: ${LOGIN_KEYS.join(', ')}.`,
    });
  }

  if (
    typeof dto.email !== 'string' ||
    typeof dto.password !== 'string' ||
    dto.password === '' ||
    dto.password.length > 256 ||
    !EMAIL_PATTERN.test(dto.email.trim())
  ) {
    throw new BadRequestException({
      code: 'INVALID_CREDENTIALS_PAYLOAD',
      message: 'Informe um e-mail válido e uma senha não vazia.',
    });
  }
  return { email: dto.email.trim(), password: dto.password };
}

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Autentica com e-mail e senha fixos e devolve o JWT da sessão' })
  @ApiBody({
    description: 'Credenciais fixas do desafio. Há dois perfis; veja os exemplos.',
    schema: {
      type: 'object',
      required: ['email', 'password'],
      additionalProperties: false,
      properties: {
        email: { type: 'string', format: 'email', example: 'analista@dynamox.local' },
        password: { type: 'string', minLength: 1, maxLength: 256, example: 'Dynamox@2026' },
      },
    },
    examples: {
      admin: {
        summary: 'ADMIN — consulta e altera',
        value: { email: 'analista@dynamox.local', password: 'Dynamox@2026' },
      },
      viewer: {
        summary: 'VIEWER — somente consulta (mutações respondem 403)',
        value: { email: 'consulta@dynamox.local', password: 'Consulta@2026' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Sessão criada. Use o token no header Authorization: Bearer <token>.',
    type: LoginResponse,
  })
  @ApiResponse({ status: 400, description: 'INVALID_CREDENTIALS_PAYLOAD', type: ErrorResponse })
  @ApiResponse({
    status: 401,
    description: 'Credencial inválida — resposta genérica de propósito, sem revelar se o e-mail existe.',
    type: ErrorResponse,
  })
  login(@Body() body: unknown): Promise<{ token: string; user: PublicUser }> {
    const { email, password } = parseLoginDto(body);
    return this.auth.login(email, password);
  }

  @Get('me')
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Usuário da sessão atual, sem senha nem hash' })
  @ApiResponse({ status: 200, description: 'Usuário da sessão.', type: SessionUserResponse })
  @ApiResponse({
    status: 401,
    description: 'Token ausente, inválido, expirado ou sem perfil reconhecível.',
    type: ErrorResponse,
  })
  me(@Req() request: Request & { user: JwtPayload }): Promise<PublicUser> {
    return this.auth.me(request.user.sub);
  }
}
