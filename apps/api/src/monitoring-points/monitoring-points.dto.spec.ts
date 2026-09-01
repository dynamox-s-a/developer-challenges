/**
 * Unitários puros dos parsers de pontos de monitoramento: corpo e query string.
 * Sem Nest, Prisma ou banco.
 */
import { BadRequestException } from '@nestjs/common';

import {
  MAX_PAGE,
  MAX_PAGE_SIZE,
  parseAssignSensorDto,
  parseCreateMonitoringPointDto,
  parseListMonitoringPointsQuery,
} from './monitoring-points.dto';

function errorCode(fn: () => unknown): string {
  try {
    fn();
  } catch (error) {
    if (error instanceof BadRequestException) {
      return (error.getResponse() as { code: string }).code;
    }
    throw error;
  }
  throw new Error('esperava BadRequestException');
}

describe('parseCreateMonitoringPointDto', () => {
  it('aceita machineId e nome válidos, com trim no nome', () => {
    expect(parseCreateMonitoringPointDto({ machineId: '6f3d4a1e-9c2b-4f7a-8d51-0b2f1c9e7a10', name: ' Mancal LA ' })).toEqual({
      machineId: '6f3d4a1e-9c2b-4f7a-8d51-0b2f1c9e7a10',
      name: 'Mancal LA',
    });
  });

  it('recusa machineId que não é UUID — malformado é 400, não busca inexistente', () => {
    // A distinção importa para o consumidor: identificador malformado é erro de
    // requisição; UUID bem formado que não existe é 404 vindo do service.
    expect(errorCode(() => parseCreateMonitoringPointDto({ machineId: 'x', name: 'Mancal' }))).toBe(
      'INVALID_MONITORING_POINT_PAYLOAD',
    );
    expect(
      errorCode(() => parseCreateMonitoringPointDto({ machineId: '6f3d4a1e-9c2b-4f7a-8d51-0b2f1c9e7a1', name: 'Mancal' })),
    ).toBe('INVALID_MONITORING_POINT_PAYLOAD');
    expect(
      parseCreateMonitoringPointDto({ machineId: '6f3d4a1e-9c2b-4f7a-8d51-0b2f1c9e7a10'.toUpperCase(), name: 'Mancal' }).machineId,
    ).toBe('6f3d4a1e-9c2b-4f7a-8d51-0b2f1c9e7a10'.toUpperCase());
  });

  it('recusa nome vazio, nome longo e propriedade desconhecida', () => {
    expect(
      errorCode(() => parseCreateMonitoringPointDto({ machineId: '6f3d4a1e-9c2b-4f7a-8d51-0b2f1c9e7a10', name: '  ' })),
    ).toBe('INVALID_MONITORING_POINT_PAYLOAD');
    expect(
      errorCode(() =>
        parseCreateMonitoringPointDto({ machineId: '6f3d4a1e-9c2b-4f7a-8d51-0b2f1c9e7a10', name: 'x'.repeat(121) }),
      ),
    ).toBe('INVALID_MONITORING_POINT_PAYLOAD');
    expect(
      errorCode(() =>
        parseCreateMonitoringPointDto({ machineId: '6f3d4a1e-9c2b-4f7a-8d51-0b2f1c9e7a10', name: 'P', extra: 1 }),
      ),
    ).toBe('INVALID_MONITORING_POINT_PAYLOAD');
  });
});

describe('parseAssignSensorDto — modelos permitidos', () => {
  it('aceita exatamente TcAg, TcAs e HF+', () => {
    for (const model of ['TcAg', 'TcAs', 'HF+'] as const) {
      expect(parseAssignSensorDto({ serialNumber: 'S-1', model })).toEqual({
        serialNumber: 'S-1',
        model,
      });
    }
  });

  it('recusa modelo fora do vocabulário com código próprio', () => {
    for (const model of ['HF', 'tcag', 'TCAG', '']) {
      expect(errorCode(() => parseAssignSensorDto({ serialNumber: 'S-1', model }))).toBe(
        'INVALID_SENSOR_MODEL',
      );
    }
  });

  it('recusa identificador vazio ou acima do limite', () => {
    expect(errorCode(() => parseAssignSensorDto({ serialNumber: '  ', model: 'HF+' }))).toBe(
      'INVALID_MONITORING_POINT_PAYLOAD',
    );
    expect(
      errorCode(() =>
        parseAssignSensorDto({ serialNumber: 'x'.repeat(61), model: 'HF+' }),
      ),
    ).toBe('INVALID_MONITORING_POINT_PAYLOAD');
  });
});

describe('parseListMonitoringPointsQuery — contrato rígido da listagem', () => {
  it('sem parâmetros, usa os padrões do enunciado (página 1, 5 por página)', () => {
    expect(parseListMonitoringPointsQuery({})).toEqual({
      page: 1,
      pageSize: 5,
      sortBy: 'machineName',
      sortDir: 'asc',
      // Ausência de recorte é explícita: nenhum filtro aplicado, não "filtro vazio".
      search: null,
      machineType: null,
      sensorModel: null,
      hasSensor: null,
    });
  });

  it('normaliza busca em branco para ausência de recorte', () => {
    expect(parseListMonitoringPointsQuery({ search: '   ' }).search).toBeNull();
    expect(parseListMonitoringPointsQuery({ search: '  P-101 ' }).search).toBe('P-101');
  });

  it('aceita os filtros do vocabulário público e recusa o resto', () => {
    expect(parseListMonitoringPointsQuery({ machineType: 'Pump' }).machineType).toBe('Pump');
    expect(parseListMonitoringPointsQuery({ sensorModel: 'HF+' }).sensorModel).toBe('HF+');
    expect(parseListMonitoringPointsQuery({ hasSensor: 'false' }).hasSensor).toBe(false);
    expect(parseListMonitoringPointsQuery({ hasSensor: 'true' }).hasSensor).toBe(true);

    expect(() => parseListMonitoringPointsQuery({ machineType: 'PUMP' })).toThrow();
    expect(() => parseListMonitoringPointsQuery({ sensorModel: 'HF ' })).toThrow();
    expect(() => parseListMonitoringPointsQuery({ hasSensor: '1' })).toThrow();
  });

  it('recusa busca acima do limite defensivo', () => {
    expect(() => parseListMonitoringPointsQuery({ search: 'x'.repeat(121) })).toThrow();
    expect(parseListMonitoringPointsQuery({ search: 'x'.repeat(120) }).search).toHaveLength(120);
  });

  it('aceita ordenação por qualquer uma das quatro colunas, nos dois sentidos', () => {
    for (const sortBy of ['machineName', 'machineType', 'pointName', 'sensorModel']) {
      for (const sortDir of ['asc', 'desc']) {
        expect(parseListMonitoringPointsQuery({ sortBy, sortDir })).toMatchObject({
          sortBy,
          sortDir,
        });
      }
    }
  });

  it('recusa parâmetro desconhecido em vez de ignorá-lo', () => {
    expect(errorCode(() => parseListMonitoringPointsQuery({ injetado: 'x' }))).toBe(
      'INVALID_MONITORING_POINT_QUERY',
    );
  });

  it('recusa page/pageSize não inteiros ou fora dos limites', () => {
    for (const query of [
      { page: '0' },
      { page: 'abc' },
      { page: '1.5' },
      { page: String(MAX_PAGE + 1) },
      { pageSize: '0' },
      { pageSize: String(MAX_PAGE_SIZE + 1) },
    ]) {
      expect(errorCode(() => parseListMonitoringPointsQuery(query))).toBe(
        'INVALID_MONITORING_POINT_QUERY',
      );
    }
  });

  it('recusa inteiros gigantes que virariam Infinity no offset (400, nunca 500)', () => {
    expect(errorCode(() => parseListMonitoringPointsQuery({ page: '9'.repeat(400) }))).toBe(
      'INVALID_MONITORING_POINT_QUERY',
    );
    expect(
      errorCode(() =>
        parseListMonitoringPointsQuery({ page: String(Number.MAX_SAFE_INTEGER + 2) }),
      ),
    ).toBe('INVALID_MONITORING_POINT_QUERY');
  });

  it('recusa sortBy e sortDir fora do vocabulário', () => {
    expect(errorCode(() => parseListMonitoringPointsQuery({ sortBy: 'id' }))).toBe(
      'INVALID_MONITORING_POINT_QUERY',
    );
    expect(errorCode(() => parseListMonitoringPointsQuery({ sortDir: 'up' }))).toBe(
      'INVALID_MONITORING_POINT_QUERY',
    );
  });
});
