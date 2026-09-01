import {
  canonicalJson,
  computePayloadFingerprint,
  deterministicResourceId,
  isCanonicalMillisecondTimestamp,
  isValidIdempotencyKey,
  loadTelemetryCycleExample,
  loadTelemetryCycleSchema,
  validateTelemetryCycle,
  type TelemetryCyclePayload,
  DEMO_ANCHOR_BLOCK_MS,
  DEMO_ANCHOR_ENV,
  DEMO_HOUR_MS,
  demoAnchorMs,
  demoWindowIso,
} from '@dynamox/contracts';
import { isAxisValidForQuantity, isSensorModelAllowedForMachine } from '@dynamox/domain';

function clone(payload: TelemetryCyclePayload): TelemetryCyclePayload {
  return JSON.parse(JSON.stringify(payload)) as TelemetryCyclePayload;
}

describe('Contrato interno de telemetria (SCP-04)', () => {
  const example = loadTelemetryCycleExample();

  it('aceita o exemplo versionado em contracts/dynamox', () => {
    expect(validateTelemetryCycle(example)).toEqual(expect.objectContaining({ valid: true }));
  });

  it('rejeita ciclo sem measurements', () => {
    const payload = clone(example);
    payload.telemetryCycleData.measurements = [];
    expect(validateTelemetryCycle(payload).valid).toBe(false);
  });

  it('rejeita campo extra no topo de telemetryCycleData (additionalProperties:false)', () => {
    const payload = clone(example) as unknown as Record<string, Record<string, unknown>>;
    payload.telemetryCycleData.cycleId = 'chave-no-lugar-errado';

    const result = validateTelemetryCycle(payload);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.violations.some((violation) => /additional/i.test(violation.message))).toBe(true);
    }
  });

  it('rejeita resourceId fora do formato de 24 hexadecimais', () => {
    const payload = clone(example);
    payload.telemetryCycleData.measurements[0].resourceId = 'nao-e-um-object-id';
    expect(validateTelemetryCycle(payload).valid).toBe(false);
  });

  it('rejeita configuration sem monitoringLocationMap, o campo canônico interno', () => {
    const payload = clone(example) as unknown as { configuration: Record<string, unknown> };
    delete payload.configuration.monitoringLocationMap;
    expect(validateTelemetryCycle(payload).valid).toBe(false);
  });

  it('não declara monitoringLocationMapSchema, que é apenas alias da especificação pública', () => {
    const schema = loadTelemetryCycleSchema() as {
      properties: { configuration: { properties: Record<string, unknown> } };
    };

    expect(Object.keys(schema.properties.configuration.properties)).toContain(
      'monitoringLocationMap',
    );
    expect(Object.keys(schema.properties.configuration.properties)).not.toContain(
      'monitoringLocationMapSchema',
    );
  });
});

describe('Precisão temporal canônica', () => {
  const example = loadTelemetryCycleExample();

  it.each(['2026-08-26T12:00:00.000Z', '2026-08-26T23:59:59.999Z'])(
    'aceita o instante canônico %s',
    (timestamp) => {
      expect(isCanonicalMillisecondTimestamp(timestamp)).toBe(true);
    },
  );

  it.each([
    '2026-08-26T12:00:00.0001Z',
    '2026-08-26T12:00:00.0002Z',
    '2026-08-26T12:00:00Z',
    '2026-08-26T12:00:00.00Z',
    '2026-08-26T12:00:00.000+00:00',
    '2026-08-26T09:00:00.000-03:00',
    '2026-02-30T12:00:00.000Z',
  ])('recusa o instante não canônico %s', (timestamp) => {
    expect(isCanonicalMillisecondTimestamp(timestamp)).toBe(false);
  });

  it.each(['2026-08-26T12:00:00.0001Z', '2026-08-26T12:00:00.0002Z'])(
    'o schema recusa a precisão submilissegundo %s',
    (timestamp) => {
      const payload = clone(example);
      payload.telemetryCycleData.measurements[0].dataPoints[0].timestamp = timestamp;
      expect(validateTelemetryCycle(payload).valid).toBe(false);
    },
  );
});

describe('Fingerprint canônico do payload', () => {
  const example = loadTelemetryCycleExample();

  it('produz 64 hexadecimais estáveis para o mesmo conteúdo', () => {
    const fingerprint = computePayloadFingerprint(example);
    expect(fingerprint).toMatch(/^[0-9a-f]{64}$/);
    expect(computePayloadFingerprint(clone(example))).toBe(fingerprint);
  });

  it('ignora a ordem das propriedades JSON', () => {
    const reordered = JSON.parse(
      JSON.stringify({
        configuration: example.configuration,
        telemetryCycleData: {
          tags: example.telemetryCycleData.tags,
          metadata: example.telemetryCycleData.metadata,
          measurements: example.telemetryCycleData.measurements,
          measuringSystemModel: example.telemetryCycleData.measuringSystemModel,
          measuringSystemUniqueIdentifier:
            example.telemetryCycleData.measuringSystemUniqueIdentifier,
        },
      }),
    ) as TelemetryCyclePayload;

    expect(computePayloadFingerprint(reordered)).toBe(computePayloadFingerprint(example));
  });

  it('ignora a ordem das medições, das amostras e das tags', () => {
    const shuffled = clone(example);
    shuffled.telemetryCycleData.measurements.reverse();
    shuffled.telemetryCycleData.measurements[0].dataPoints.reverse();
    shuffled.telemetryCycleData.tags.reverse();

    expect(computePayloadFingerprint(shuffled)).toBe(computePayloadFingerprint(example));
  });

  it('muda quando um valor intermediário muda, mantidos limites e quantidade', () => {
    const altered = clone(example);
    const points = altered.telemetryCycleData.measurements[0].dataPoints;
    expect(points).toHaveLength(3);

    points[1].value = points[1].value + 0.001;

    expect(altered.telemetryCycleData.measurements[0].dataPoints[0].timestamp).toBe(
      example.telemetryCycleData.measurements[0].dataPoints[0].timestamp,
    );
    expect(computePayloadFingerprint(altered)).not.toBe(computePayloadFingerprint(example));
  });

  it.each([
    ['unidade', (p: TelemetryCyclePayload) => (p.telemetryCycleData.measurements[0].attributes.unit = 'm/s2')],
    ['metadata', (p: TelemetryCyclePayload) => (p.telemetryCycleData.metadata.profile = 'TcAg')],
    ['tags', (p: TelemetryCyclePayload) => p.telemetryCycleData.tags.push('extra')],
    ['configuration', (p: TelemetryCyclePayload) => (p.configuration.rpm = 3600)],
    [
      'timestamp intermediário',
      (p: TelemetryCyclePayload) =>
        (p.telemetryCycleData.measurements[0].dataPoints[1].timestamp =
          '2026-08-26T12:00:11.000Z'),
    ],
  ])('muda quando %s muda', (_label, mutate) => {
    const altered = clone(example);
    mutate(altered);
    expect(computePayloadFingerprint(altered)).not.toBe(computePayloadFingerprint(example));
  });

  it('não é ambíguo quanto a separadores presentes nos próprios valores', () => {
    const withPipes = clone(example);
    withPipes.telemetryCycleData.measuringSystemUniqueIdentifier = 'A|B';

    const shifted = clone(example);
    shifted.telemetryCycleData.measuringSystemUniqueIdentifier = 'A';
    shifted.telemetryCycleData.measuringSystemModel.name = `B|${shifted.telemetryCycleData.measuringSystemModel.name}`;

    expect(computePayloadFingerprint(withPipes)).not.toBe(computePayloadFingerprint(shifted));
  });

  it('serializa objetos com chaves ordenadas recursivamente', () => {
    expect(canonicalJson({ b: 1, a: { d: 2, c: 3 } })).toBe('{"a":{"c":3,"d":2},"b":1}');
  });
});

describe('Formato da Idempotency-Key', () => {
  it('aceita chaves opacas curtas dentro do conjunto seguro', () => {
    expect(isValidIdempotencyKey('replay-manual-001')).toBe(true);
    expect(isValidIdempotencyKey('a'.repeat(128))).toBe(true);
  });

  it('recusa chave vazia, longa demais ou com caracteres perigosos', () => {
    expect(isValidIdempotencyKey('')).toBe(false);
    expect(isValidIdempotencyKey('a'.repeat(129))).toBe(false);
    expect(isValidIdempotencyKey('chave com espaço')).toBe(false);
    expect(isValidIdempotencyKey('chave\nquebrada')).toBe(false);
  });
});

describe('Identificadores determinísticos', () => {
  it('deriva 24 hexadecimais minúsculos e estáveis', () => {
    const first = deterministicResourceId('dynamox-challenge', 'monitoring-point', 'P-101');
    expect(first).toBe(deterministicResourceId('dynamox-challenge', 'monitoring-point', 'P-101'));
    expect(first).toMatch(/^[0-9a-f]{24}$/);
  });
});

describe('Invariantes de domínio', () => {
  it('impede TcAg e TcAs em máquinas do tipo Pump', () => {
    expect(isSensorModelAllowedForMachine('Pump', 'TcAg')).toBe(false);
    expect(isSensorModelAllowedForMachine('Pump', 'TcAs')).toBe(false);
  });

  it('permite HF+ em Pump e qualquer modelo em Fan', () => {
    expect(isSensorModelAllowedForMachine('Pump', 'HF+')).toBe(true);
    expect(isSensorModelAllowedForMachine('Fan', 'TcAg')).toBe(true);
  });

  it('exige eixo para grandezas vetoriais e proíbe para escalares', () => {
    expect(isAxisValidForQuantity('acceleration', 'x')).toBe(true);
    expect(isAxisValidForQuantity('acceleration', undefined)).toBe(false);
    expect(isAxisValidForQuantity('velocity', 'z')).toBe(true);
    expect(isAxisValidForQuantity('temperature', undefined)).toBe(true);
    expect(isAxisValidForQuantity('temperature', 'y')).toBe(false);
    expect(isAxisValidForQuantity('rotationalSpeed', undefined)).toBe(true);
    expect(isAxisValidForQuantity('rotationalSpeed', 'x')).toBe(false);
  });
});


/**
 * Ancoragem dos dados de demonstração. O defeito que originou estes testes: seed e planta
 * gravavam instantes ABSOLUTOS, então o painel — que classifica recência contra o relógio —
 * passava a mostrar leituras "no futuro" e tendência vazia assim que a data passava.
 */
describe('Âncora temporal dos dados de demonstração', () => {
  const semOverride: Record<string, string | undefined> = {};

  it('é estável dentro do bloco: duas execuções na mesma janela produzem o mesmo instante', () => {
    const inicio = Date.UTC(2026, 8, 20, 12, 0, 0);
    const fim = inicio + DEMO_ANCHOR_BLOCK_MS - 1;
    expect(demoAnchorMs(inicio, semOverride)).toBe(demoAnchorMs(fim, semOverride));
  });

  it('muda no bloco seguinte — aquisição nova, não repetição da anterior', () => {
    const inicio = Date.UTC(2026, 8, 20, 12, 0, 0);
    expect(demoAnchorMs(inicio + DEMO_ANCHOR_BLOCK_MS, semOverride)).toBe(
      demoAnchorMs(inicio, semOverride) + DEMO_ANCHOR_BLOCK_MS,
    );
  });

  it('nunca está no futuro do instante informado', () => {
    for (const minuto of [0, 1, 59, 359]) {
      const agora = Date.UTC(2026, 8, 20, 3, 0, 0) + minuto * 60_000;
      expect(demoAnchorMs(agora, semOverride)).toBeLessThanOrEqual(agora);
      expect(agora - demoAnchorMs(agora, semOverride)).toBeLessThan(DEMO_ANCHOR_BLOCK_MS);
    }
  });

  it('janelas derivadas são canônicas e ficam no passado', () => {
    const agora = Date.UTC(2026, 8, 20, 14, 37, 12);
    for (const horas of [-3, -2, -1]) {
      const janela = demoWindowIso(horas * DEMO_HOUR_MS, agora, semOverride);
      expect(isCanonicalMillisecondTimestamp(janela)).toBe(true);
      expect(Date.parse(janela)).toBeLessThan(agora);
    }
  });

  it('a variável de ambiente fixa a âncora para reproduzir uma demonstração', () => {
    const env = { [DEMO_ANCHOR_ENV]: '2026-08-31T08:00:00.000Z' };
    expect(demoWindowIso(0, Date.now(), env)).toBe('2026-08-31T08:00:00.000Z');
    expect(() => demoAnchorMs(Date.now(), { [DEMO_ANCHOR_ENV]: 'ontem' })).toThrow(
      new RegExp(DEMO_ANCHOR_ENV),
    );
  });
});
