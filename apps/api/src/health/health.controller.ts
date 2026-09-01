import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';

import { Public } from '../auth/public.decorator';
// A classe documentada no OpenAPI é também o tipo de retorno: uma definição só, sem
// risco de o schema publicado divergir do que a rota devolve.
import { HealthResponse } from '../common/api-schemas';
import { PrismaService } from '../prisma/prisma.service';

/** Público de propósito: é o probe de disponibilidade usado antes de qualquer login. */
@ApiTags('health')
@Public()
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Estado da API e do banco (público)' })
  @ApiResponse({ status: 200, description: 'Saudável: API respondendo e banco acessível.', type: HealthResponse })
  @ApiResponse({
    status: 503,
    description: 'Degradado: banco inacessível. O corpo mantém o mesmo formato, com status "degraded".',
    type: HealthResponse,
  })
  async check(@Res({ passthrough: true }) response: Response): Promise<HealthResponse> {
    let database: 'up' | 'down' = 'down';

    try {
      await this.prisma.$queryRaw`SELECT 1`;
      database = 'up';
    } catch {
      database = 'down';
    }

    const status = database === 'up' ? 'ok' : 'degraded';
    response.status(status === 'ok' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE);

    return {
      status,
      database,
      version: process.env.npm_package_version ?? '0.1.0',
      timestamp: new Date().toISOString(),
    };
  }
}
