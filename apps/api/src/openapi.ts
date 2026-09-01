import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule, type OpenAPIObject } from '@nestjs/swagger';

/**
 * Documentação viva da API em /api/docs (UI) e /api/docs-json (OpenAPI 3).
 * O contrato rígido real é aplicado pelos parsers dos DTOs (chaves desconhecidas são
 * 400 em corpo e query); o Swagger descreve esse comportamento, não o substitui.
 */
/** Configuração do documento, isolada para que os testes possam gerá-lo sem subir a UI. */
export function buildOpenApiDocument(app: INestApplication): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle('Dynamox Challenge API')
    .setDescription(
      'API do desafio Full-Stack: autenticação JWT, CRUD de máquinas, pontos de ' +
        'monitoramento e sensores (regra Pump × TcAg/TcAs), ingestão idempotente de ' +
        'telemetria e leitura/exclusão de séries temporais. Corpos e query strings ' +
        'rejeitam propriedades desconhecidas com 400. Todas as rotas, exceto ' +
        '/api/health e /api/auth/login, exigem Authorization: Bearer <token>.',
    )
    .setVersion('0.1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearer',
    )
    .addTag('health', 'Probe de disponibilidade (público)')
    .addTag('auth', 'Login com credencial fixa e sessão JWT')
    .addTag('machines', 'CRUD de máquinas (Pump/Fan)')
    .addTag('monitoring-points', 'Pontos de monitoramento e sensores')
    .addTag('telemetry', 'Ingestão idempotente de ciclos (contrato SCP-04)')
    .addTag('time-series', 'Leitura paginada, métricas e exclusão de séries')
    .addTag('analytics', 'Consultas agregadas por janela temporal para investigação')
    .addTag(
      'alerts',
      'Episódios de alerta persistidos (A1/A2) — uma regra da política disparou contra a ' +
        'BASELINE APRENDIDA do ponto, por leituras consecutivas, e o episódio tem abertura, ' +
        'escalada, reconhecimento e resolução. Não confundir com a CONDIÇÃO de /analytics, que é ' +
        'derivada e compara a aquisição atual com a anterior: as duas referências são diferentes e ' +
        'os números podem divergir legitimamente. O tipo do alerta descreve a regra que disparou, ' +
        'nunca um diagnóstico — e os alertas de telemetria afirmam ausência de dado, não causa.',
    )
    .build();

  return SwaggerModule.createDocument(app, config);
}

export function setupOpenApi(app: INestApplication): void {
  SwaggerModule.setup('api/docs', app, buildOpenApiDocument(app), {
    customSiteTitle: 'Dynamox Challenge API',
    swaggerOptions: { persistAuthorization: true },
  });
}
