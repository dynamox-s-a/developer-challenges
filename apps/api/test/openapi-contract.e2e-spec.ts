/**
 * Qualidade do contrato publicado em /api/docs-json.
 *
 * Existe para que a documentação não volte a ser uma frase descrevendo o formato: toda
 * resposta precisa apontar para um schema navegável. Uma rota nova sem schema quebra
 * este teste em vez de chegar silenciosamente ao avaliador.
 */
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { OpenAPIObject } from '@nestjs/swagger';

import { AppModule } from '../src/app.module';
import { buildOpenApiDocument } from '../src/openapi';

/** 204 não tem corpo por definição; qualquer outro status precisa descrever o que devolve. */
const STATUSES_WITHOUT_BODY = new Set(['204']);

describe('contrato OpenAPI publicado', () => {
  let app: INestApplication;
  let document: OpenAPIObject;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    document = buildOpenApiDocument(app);
  }, 60000);

  afterAll(async () => {
    await app.close();
  });

  const operations = (): Array<{ path: string; method: string; operation: Record<string, unknown> }> =>
    Object.entries(document.paths).flatMap(([path, item]) =>
      Object.entries(item as Record<string, unknown>)
        .filter(([method]) => ['get', 'post', 'patch', 'put', 'delete'].includes(method))
        .map(([method, operation]) => ({
          path,
          method,
          operation: operation as Record<string, unknown>,
        })),
    );

  it('publica schemas reutilizáveis em components.schemas', () => {
    const schemas = document.components?.schemas ?? {};
    expect(Object.keys(schemas).length).toBeGreaterThan(0);
    // Os modelos centrais precisam existir para que as rotas possam referenciá-los.
    for (const name of ['ErrorResponse', 'MachineResponse', 'MonitoringPointPageResponse']) {
      expect(schemas[name]).toBeDefined();
    }
  });

  it('toda resposta com corpo aponta para um schema', () => {
    const semSchema: string[] = [];
    for (const { path, method, operation } of operations()) {
      const responses = (operation.responses ?? {}) as Record<
        string,
        { content?: Record<string, { schema?: unknown }> }
      >;
      for (const [status, response] of Object.entries(responses)) {
        if (STATUSES_WITHOUT_BODY.has(status)) continue;
        // Não basta existir `content`: um media type sem `schema` deixa o consumidor
        // sem saber o formato, que é exatamente o problema que esta suíte previne.
        const medias = Object.entries(response.content ?? {});
        const descrito = medias.length > 0 && medias.every(([, media]) => Boolean(media?.schema));
        if (!descrito) semSchema.push(`${method.toUpperCase()} ${path} → ${status}`);
      }
    }
    expect(semSchema).toEqual([]);
  });

  it('toda rota declara pelo menos um status de erro', () => {
    for (const { operation } of operations()) {
      const codes = Object.keys((operation.responses ?? {}) as Record<string, unknown>);
      expect(codes.some((code) => code.startsWith('4') || code.startsWith('5'))).toBe(true);
    }
  });

  it('nenhum parâmetro é declarado duas vezes na mesma rota', () => {
    for (const { operation } of operations()) {
      const params = (operation.parameters ?? []) as Array<{ name: string; in: string }>;
      const keys = params.map((p) => `${p.in}:${p.name.toLowerCase()}`);
      expect(new Set(keys).size).toBe(keys.length);
    }
  });

  it('só parâmetros de rota são obrigatórios — query e header opcionais não mentem', () => {
    for (const { path, method, operation } of operations()) {
      const params = (operation.parameters ?? []) as Array<{ name: string; in: string; required?: boolean }>;
      for (const param of params) {
        if (param.in !== 'path' && param.required) {
          throw new Error(`${method.toUpperCase()} ${path}: ${param.in} "${param.name}" está como obrigatório`);
        }
      }
    }
  });

  it('operações de corpo trazem exemplo utilizável e com schema declarado', () => {
    const problemas: string[] = [];
    for (const { path, method, operation } of operations()) {
      const body = operation.requestBody as
        | {
            content?: Record<
              string,
              { schema?: unknown; examples?: Record<string, { value?: unknown }>; example?: unknown }
            >;
          }
        | undefined;
      if (!body?.content) continue;

      for (const [mediaType, media] of Object.entries(body.content)) {
        if (!media?.schema) problemas.push(`${method.toUpperCase()} ${path} (${mediaType}) sem schema`);

        const exemplos = media?.examples;
        const temExemplo = Boolean(exemplos ?? media?.example);
        if (!temExemplo) {
          problemas.push(`${method.toUpperCase()} ${path} (${mediaType}) sem exemplo`);
          continue;
        }
        // Exemplo vazio passa como "existe" mas não serve para ninguém copiar.
        for (const [nome, exemplo] of Object.entries(exemplos ?? {})) {
          const valor = exemplo?.value;
          const util =
            valor !== undefined &&
            valor !== null &&
            (typeof valor !== 'object' || Object.keys(valor as object).length > 0);
          if (!util) problemas.push(`${method.toUpperCase()} ${path} exemplo "${nome}" vazio`);
        }
      }
    }
    expect(problemas).toEqual([]);
  });

  it('cada operação tem resumo legível e pertence a uma seção', () => {
    for (const { operation } of operations()) {
      expect(typeof operation.summary).toBe('string');
      expect((operation.summary as string).length).toBeGreaterThan(10);
      expect((operation.tags as string[]).length).toBeGreaterThan(0);
    }
  });

  /**
   * Campo anulável precisa manter o tipo base publicado. O gerador lê o metadado de
   * runtime do TypeScript e, numa união com null, ele chega como Object — sem `type`
   * explícito o contrato passa a anunciar `object` no lugar de string/number/boolean.
   * Este teste olha o documento final, não o decorator, para pegar a regressão onde ela
   * apareceria para o consumidor.
   */
  it('campo anulável preserva o tipo primitivo em vez de virar object', () => {
    const esperado: Record<string, Record<string, { type: string; format?: string }>> = {
      MonitoringPointPageResponse: {
        search: { type: 'string' },
        hasSensor: { type: 'boolean' },
        machineType: { type: 'string' },
        sensorModel: { type: 'string' },
      },
      SeriesMetricsResponse: {
        min: { type: 'number' },
        max: { type: 'number' },
        avg: { type: 'number' },
        last: { type: 'number' },
        firstTimestamp: { type: 'string', format: 'date-time' },
        lastTimestamp: { type: 'string', format: 'date-time' },
      },
      TimeSeriesSummaryResponse: {
        axis: { type: 'string' },
      },
    };

    const schemas = (document.components?.schemas ?? {}) as Record<
      string,
      { properties?: Record<string, { type?: string; format?: string; nullable?: boolean }> }
    >;

    for (const [schemaName, fields] of Object.entries(esperado)) {
      for (const [field, expectation] of Object.entries(fields)) {
        const property = schemas[schemaName]?.properties?.[field];
        expect(property).toBeDefined();
        expect(`${schemaName}.${field}: ${property?.type}`).toBe(
          `${schemaName}.${field}: ${expectation.type}`,
        );
        expect(property?.nullable).toBe(true);
        if (expectation.format) expect(property?.format).toBe(expectation.format);
      }
    }
  });

  it('nenhuma propriedade primitiva é publicada como object, em qualquer profundidade', () => {
    const suspeitas: string[] = [];

    /** Desce por properties, items e combinadores — não só o primeiro nível. */
    const percorrer = (node: unknown, caminho: string): void => {
      if (Array.isArray(node)) {
        node.forEach((item, i) => percorrer(item, `${caminho}[${i}]`));
        return;
      }
      if (typeof node !== 'object' || node === null) return;

      const schema = node as Record<string, unknown>;
      const ehObjetoReal =
        'properties' in schema ||
        '$ref' in schema ||
        'allOf' in schema ||
        'anyOf' in schema ||
        'oneOf' in schema ||
        'additionalProperties' in schema;
      if (schema.type === 'object' && !ehObjetoReal) suspeitas.push(caminho);

      for (const [keyword, value] of Object.entries(schema)) {
        if (keyword === 'properties' && typeof value === 'object' && value !== null) {
          for (const [field, sub] of Object.entries(value as Record<string, unknown>)) {
            percorrer(sub, `${caminho}.${field}`);
          }
          continue;
        }
        if (keyword === 'items' || keyword === 'additionalProperties') {
          percorrer(value, `${caminho}.${keyword}`);
          continue;
        }
        if (['allOf', 'anyOf', 'oneOf'].includes(keyword)) percorrer(value, `${caminho}.${keyword}`);
      }
    };

    for (const [name, schema] of Object.entries(document.components?.schemas ?? {})) {
      percorrer(schema, name);
    }
    // Corpos de requisição também são contrato publicado.
    for (const { path, method, operation } of operations()) {
      const body = operation.requestBody as { content?: Record<string, { schema?: unknown }> } | undefined;
      for (const [mediaType, media] of Object.entries(body?.content ?? {})) {
        percorrer(media?.schema, `${method.toUpperCase()} ${path} (${mediaType})`);
      }
    }

    expect(suspeitas).toEqual([]);
  });

  /**
   * O 403 nasce da autorização por perfil: só faz sentido onde há mutação. Anunciá-lo
   * numa leitura diria ao consumidor que o perfil VIEWER não pode consultar — o oposto
   * do que a API faz.
   */
  it('403 é publicado apenas em operações que alteram estado', () => {
    const divergencias: string[] = [];
    for (const { path, method, operation } of operations()) {
      const publica403 = '403' in ((operation.responses ?? {}) as Record<string, unknown>);
      const altera = ['post', 'patch', 'put', 'delete'].includes(method);
      const publico = path === '/api/auth/login' || path === '/api/health';
      const deveria = altera && !publico;
      if (publica403 !== deveria) {
        divergencias.push(`${method.toUpperCase()} ${path} publica403=${publica403} esperado=${deveria}`);
      }
    }
    expect(divergencias).toEqual([]);
  });

  it('toda operação privada publica 401', () => {
    for (const { path, method, operation } of operations()) {
      if (path === '/api/auth/login' || path === '/api/health') continue;
      const codes = Object.keys((operation.responses ?? {}) as Record<string, unknown>);
      expect(`${method.toUpperCase()} ${path}: ${codes.includes('401')}`).toBe(
        `${method.toUpperCase()} ${path}: true`,
      );
    }
  });

  it('respostas de erro apontam para o contrato { code, message }', () => {
    const schemas = (document.components?.schemas ?? {}) as Record<string, unknown>;
    expect(schemas.ErrorResponse).toBeDefined();

    /**
     * Exceção deliberada: o probe de saúde responde 503 com o MESMO corpo do 200, apenas
     * com status "degraded". É estado de disponibilidade, não erro de negócio — forçá-lo
     * ao formato { code, message } quebraria quem monitora o endpoint.
     */
    const naoUsamErrorResponse = new Set(['GET /api/health 503']);

    for (const { path, method, operation } of operations()) {
      const responses = (operation.responses ?? {}) as Record<
        string,
        { content?: Record<string, { schema?: { $ref?: string } }> }
      >;
      for (const [status, response] of Object.entries(responses)) {
        if (!status.startsWith('4') && !status.startsWith('5')) continue;
        if (naoUsamErrorResponse.has(`${method.toUpperCase()} ${path} ${status}`)) continue;
        const ref = Object.values(response.content ?? {})[0]?.schema?.$ref;
        expect(`${method.toUpperCase()} ${path} ${status}: ${ref}`).toBe(
          `${method.toUpperCase()} ${path} ${status}: #/components/schemas/ErrorResponse`,
        );
      }
    }
  });
});
