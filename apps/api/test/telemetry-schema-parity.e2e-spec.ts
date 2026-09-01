/**
 * Paridade entre o schema de request publicado no OpenAPI e o validador que roda de fato.
 *
 * O bug que originou esta suíte: o corpo de POST /telemetry-cycles era descrito à mão no
 * Swagger, duplicando `contracts/dynamox/telemetry-cycle.schema.json`. As duas cópias
 * divergiram — o contrato exigia campos que o Ajv aceitava ausentes — e um payload
 * declarado inválido era respondido com 201.
 *
 * Aqui cada caso é submetido às DUAS portas e os vereditos precisam coincidir. Não é
 * prova de equivalência total dos dialetos; é a garantia de que a divergência conhecida
 * (e as da mesma família) não voltam silenciosamente.
 */
import { validateTelemetryCycle } from '@dynamox/contracts';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import type { OpenAPIObject } from '@nestjs/swagger';
import type {
  ExampleObject,
  OperationObject,
  RequestBodyObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import { AppModule } from '../src/app.module';
import { buildOpenApiDocument } from '../src/openapi';

/**
 * Desfaz as diferenças de dialeto para que o Ajv (draft 2020-12) possa compilar o schema
 * publicado em OpenAPI 3.0. Serve de contraprova da conversão: se ela não fosse
 * determinística e reversível, o schema não voltaria a compilar aqui.
 */
function openApiToJsonSchema(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(openApiToJsonSchema);
  if (typeof node !== 'object' || node === null) return node;

  const entrada = node as Record<string, unknown>;
  const saida: Record<string, unknown> = {};

  for (const [keyword, value] of Object.entries(entrada)) {
    // `nullable: true` volta a ser união de tipos.
    if (keyword === 'nullable') continue;
    if (keyword === 'type' && typeof value === 'string' && entrada.nullable === true) {
      saida.type = [value, 'null'];
      continue;
    }
    // `exclusiveMinimum: true` + `minimum: n` volta a ser `exclusiveMinimum: n`.
    if (keyword === 'exclusiveMinimum' && value === true) {
      saida.exclusiveMinimum = entrada.minimum;
      continue;
    }
    if (keyword === 'exclusiveMaximum' && value === true) {
      saida.exclusiveMaximum = entrada.maximum;
      continue;
    }
    if (keyword === 'minimum' && entrada.exclusiveMinimum === true) continue;
    if (keyword === 'maximum' && entrada.exclusiveMaximum === true) continue;

    saida[keyword] = openApiToJsonSchema(value);
  }
  return saida;
}

/** Ciclo aceito pelo schema oficial usando apenas o que ele exige de verdade. */
function cicloMinimo(): Record<string, unknown> {
  return {
    telemetryCycleData: {
      measuringSystemUniqueIdentifier: 'SIM-HF-001',
      measuringSystemModel: { name: 'paridade', version: 1 },
      measurements: [
        {
          resourceId: '42d726ba50f8645df08dba9f',
          attributes: { physicalQuantity: 'acceleration', axis: 'y', unit: 'g' },
          dataPoints: [{ timestamp: '2026-09-20T12:00:00.000Z', value: 0.0246 }],
        },
      ],
      metadata: { origin: 'simulation', generator: { name: 'paridade', version: '1.0.0' } },
      tags: ['simulated'],
    },
    configuration: {
      monitoringLocationMap: [
        { mapLabel: 'P-101 / Mancal', mapValue: '42d726ba50f8645df08dba9f' },
      ],
    },
  };
}

/**
 * Forma MUTÁVEL do ciclo usada só nesta suíte: os casos inválidos trocam tipos de
 * propósito (número onde o contrato pede string, propriedade extra, campo removido),
 * então as folhas são `unknown` e os contêineres ficam abertos — sem `any`, que
 * desligaria a verificação inteira em vez de afrouxar só as folhas.
 */
interface MedicaoMutavel extends Record<string, unknown> {
  resourceId?: unknown;
  attributes: Record<string, unknown>;
  dataPoints: Array<Record<string, unknown>>;
}

interface CicloMutavel {
  telemetryCycleData: Record<string, unknown> & {
    measuringSystemUniqueIdentifier?: unknown;
    measuringSystemModel: Record<string, unknown>;
    measurements: MedicaoMutavel[];
    metadata: Record<string, unknown>;
    tags?: unknown;
  };
  configuration: Record<string, unknown> & {
    monitoringLocationMap?: Array<Record<string, unknown>>;
  };
}

/** Aplica uma alteração pontual sobre uma cópia profunda do ciclo mínimo. */
function comMudanca(mutate: (cycle: CicloMutavel) => void): Record<string, unknown> {
  const cycle = JSON.parse(JSON.stringify(cicloMinimo())) as CicloMutavel;
  mutate(cycle);
  return cycle as unknown as Record<string, unknown>;
}

/**
 * Acesso tipado ao corpo publicado. O documento do Swagger permite `$ref`, que este
 * projeto não usa no corpo da ingestão; o cast é para a forma concreta, não para `any`.
 */
function corpoDaIngestao(document: OpenAPIObject): RequestBodyObject {
  const operacao = document.paths['/api/telemetry-cycles']?.post as OperationObject | undefined;
  const corpo = operacao?.requestBody as RequestBodyObject | undefined;
  if (!corpo) {
    throw new Error('POST /api/telemetry-cycles não publicou requestBody no documento.');
  }
  return corpo;
}

function schemaDaIngestao(document: OpenAPIObject): SchemaObject {
  return corpoDaIngestao(document).content['application/json'].schema as SchemaObject;
}

function exemplosDaIngestao(document: OpenAPIObject): Record<string, ExampleObject> {
  const examples = corpoDaIngestao(document).content['application/json'].examples ?? {};
  return examples as Record<string, ExampleObject>;
}

/** Leitura tipada do exemplo publicado (só o que o teste de colisão percorre). */
interface CicloDeExemplo {
  telemetryCycleData: {
    measuringSystemUniqueIdentifier: string;
    measurements: Array<{
      attributes: { physicalQuantity: string; axis?: string };
      dataPoints: Array<{ timestamp: string }>;
    }>;
  };
}

describe('paridade entre o schema publicado e o validador real', () => {
  let app: INestApplication;
  let document: OpenAPIObject;
  let validaPeloOpenApi: (payload: unknown) => boolean;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
    document = buildOpenApiDocument(app);

    const publicado = schemaDaIngestao(document);

    // O documento publicado é OpenAPI 3.0; traduzir de volta o dialeto permite exercitá-lo
    // com o mesmo motor de validação usado em produção.
    const ajv = new Ajv({ strict: false, allErrors: true });
    addFormats(ajv);
    const compilado = ajv.compile(openApiToJsonSchema(publicado) as object);
    validaPeloOpenApi = (payload: unknown) => compilado(payload) === true;
  }, 60000);

  afterAll(async () => {
    await app.close();
  });

  /** Os dois vereditos precisam coincidir — é isso que impede a divergência de voltar. */
  const esperarConcordancia = (rotulo: string, payload: unknown, valido: boolean): void => {
    const peloContrato = validaPeloOpenApi(payload);
    const peloRuntime = validateTelemetryCycle(payload).valid;
    expect(`${rotulo}: contrato=${peloContrato} runtime=${peloRuntime}`).toBe(
      `${rotulo}: contrato=${valido} runtime=${valido}`,
    );
  };

  describe('payloads válidos', () => {
    it('ciclo mínimo é aceito pelas duas portas', () => {
      esperarConcordancia('mínimo', cicloMinimo(), true);
    });

    it('opcionais ausentes não invalidam — displayName, cycleId, synthetic, profile', () => {
      // Exatamente o caso que o contrato antigo declarava inválido e o runtime aceitava.
      esperarConcordancia('sem displayName', cicloMinimo(), true);
      esperarConcordancia(
        'com cycleId e synthetic',
        comMudanca((c) => {
          c.telemetryCycleData.metadata.cycleId = 'paridade.001';
          c.telemetryCycleData.metadata.synthetic = true;
        }),
        true,
      );
      esperarConcordancia(
        'com displayName',
        comMudanca((c) => {
          c.telemetryCycleData.measurements[0].attributes.displayName = { pt: 'Y', en: 'Y' };
        }),
        true,
      );
    });

    it('profile aceita qualquer string, como o schema oficial define', () => {
      esperarConcordancia(
        'profile fora do trio conhecido',
        comMudanca((c) => {
          c.telemetryCycleData.metadata.profile = 'PERFIL-FUTURO';
        }),
        true,
      );
    });

    it('version aceita número não inteiro', () => {
      esperarConcordancia(
        'version 1.5',
        comMudanca((c) => {
          c.telemetryCycleData.measuringSystemModel.version = 1.5;
        }),
        true,
      );
    });

    it('configuration opcional pode vir preenchida', () => {
      esperarConcordancia(
        'configuration completa',
        comMudanca((c) => {
          Object.assign(c.configuration, {
            rpm: 1750,
            loadPercent: 70,
            scenario: 'normal',
            seed: 42,
            durationSeconds: 60,
            publishRateHz: 1,
          });
        }),
        true,
      );
    });

    it('mapValue aceita null (união convertida para nullable)', () => {
      esperarConcordancia(
        'mapValue null',
        comMudanca((c) => {
          c.configuration.monitoringLocationMap = [
            { mapLabel: 'P-101 / Mancal', mapValue: null },
          ];
        }),
        true,
      );
    });
  });

  describe('payloads inválidos', () => {
    it('resourceId fora do pattern de 24 hex', () => {
      esperarConcordancia(
        'resourceId inválido',
        comMudanca((c) => {
          c.telemetryCycleData.measurements[0].resourceId = 'NAO-EH-HEX';
        }),
        false,
      );
    });

    it('required real ausente: metadata.origin', () => {
      esperarConcordancia(
        'sem origin',
        comMudanca((c) => {
          delete c.telemetryCycleData.metadata.origin;
        }),
        false,
      );
    });

    it('required real ausente: configuration.monitoringLocationMap', () => {
      esperarConcordancia(
        'sem monitoringLocationMap',
        comMudanca((c) => {
          delete c.configuration.monitoringLocationMap;
        }),
        false,
      );
    });

    it('propriedade adicional onde additionalProperties é false', () => {
      esperarConcordancia(
        'extra em measuringSystemModel',
        comMudanca((c) => {
          c.telemetryCycleData.measuringSystemModel.extra = true;
        }),
        false,
      );
    });

    it('tipo incorreto em value', () => {
      esperarConcordancia(
        'value string',
        comMudanca((c) => {
          c.telemetryCycleData.measurements[0].dataPoints[0].value = 'alto';
        }),
        false,
      );
    });

    it('estrutura inválida: measurements vazio', () => {
      esperarConcordancia(
        'measurements vazio',
        comMudanca((c) => {
          c.telemetryCycleData.measurements = [];
        }),
        false,
      );
    });

    it('origin fora do enum', () => {
      esperarConcordancia(
        'origin desconhecido',
        comMudanca((c) => {
          c.telemetryCycleData.metadata.origin = 'inventado';
        }),
        false,
      );
    });
  });

  describe('exemplos publicados no Swagger', () => {
    it('todo exemplo do corpo é aceito pelo validador real', () => {
      const exemplos = exemplosDaIngestao(document);

      expect(Object.keys(exemplos).length).toBeGreaterThan(0);
      for (const [nome, exemplo] of Object.entries(exemplos)) {
        const resultado = validateTelemetryCycle(exemplo.value);
        expect(`${nome}: ${resultado.valid}`).toBe(`${nome}: true`);
        expect(`${nome} pelo contrato: ${validaPeloOpenApi(exemplo.value)}`).toBe(
          `${nome} pelo contrato: true`,
        );
      }
    });

    it('os exemplos não colidem entre si na mesma série', () => {
      const exemplos = exemplosDaIngestao(document);

      // Instantes repetidos na mesma série fariam o segundo "Try it out" responder 409.
      const vistos = new Map<string, string>();
      for (const [nome, exemplo] of Object.entries(exemplos)) {
        const ciclo = exemplo.value as CicloDeExemplo;
        const sensor = ciclo.telemetryCycleData.measuringSystemUniqueIdentifier;
        for (const measurement of ciclo.telemetryCycleData.measurements) {
          const serie = `${sensor}|${measurement.attributes.physicalQuantity}|${measurement.attributes.axis ?? '—'}`;
          for (const ponto of measurement.dataPoints) {
            const chave = `${serie}@${ponto.timestamp}`;
            const anterior = vistos.get(chave);
            expect(anterior === undefined || anterior === nome).toBe(true);
            vistos.set(chave, nome);
          }
        }
      }
    });
  });
});
