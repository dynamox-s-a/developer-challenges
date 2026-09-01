/**
 * Unitários puros dos parsers de máquina: nenhuma dependência de Nest, Prisma ou banco.
 * Cada caso nomeia a regra de negócio que trava.
 */
import { BadRequestException } from '@nestjs/common';

import {
  MACHINE_NAME_MAX_LENGTH,
  parseCreateMachineDto,
  parseUpdateMachineDto,
} from './machines.dto';

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

describe('parseCreateMachineDto — regras do cadastro', () => {
  it('aceita nome válido e tipo do vocabulário público, normalizando por trim', () => {
    expect(parseCreateMachineDto({ name: '  P-101  ', type: 'Pump' })).toEqual({
      name: 'P-101',
      type: 'Pump',
    });
  });

  it('recusa corpo que não é objeto JSON', () => {
    for (const body of [null, [], 'texto', 42]) {
      expect(errorCode(() => parseCreateMachineDto(body))).toBe('INVALID_MACHINE_PAYLOAD');
    }
  });

  it('recusa nome vazio ou só espaços', () => {
    expect(errorCode(() => parseCreateMachineDto({ name: '   ', type: 'Fan' }))).toBe(
      'INVALID_MACHINE_PAYLOAD',
    );
  });

  it(`recusa nome acima de ${MACHINE_NAME_MAX_LENGTH} caracteres antes de chegar ao banco`, () => {
    const name = 'x'.repeat(MACHINE_NAME_MAX_LENGTH + 1);
    expect(errorCode(() => parseCreateMachineDto({ name, type: 'Fan' }))).toBe(
      'INVALID_MACHINE_PAYLOAD',
    );
  });

  it('recusa tipo fora de Pump/Fan com código próprio', () => {
    expect(errorCode(() => parseCreateMachineDto({ name: 'C-1', type: 'Compressor' }))).toBe(
      'INVALID_MACHINE_TYPE',
    );
  });

  it('recusa propriedade desconhecida em vez de ignorá-la', () => {
    expect(errorCode(() => parseCreateMachineDto({ name: 'P-1', type: 'Pump', rpm: 1750 }))).toBe(
      'INVALID_MACHINE_PAYLOAD',
    );
  });
});

describe('parseUpdateMachineDto — regras do PATCH', () => {
  it('aceita atualização parcial de nome ou de tipo', () => {
    expect(parseUpdateMachineDto({ name: 'Nova' })).toEqual({ name: 'Nova' });
    expect(parseUpdateMachineDto({ type: 'Fan' })).toEqual({ type: 'Fan' });
  });

  it('recusa PATCH sem nenhum campo: pedido sem efeito é erro, não 200 vazio', () => {
    expect(errorCode(() => parseUpdateMachineDto({}))).toBe('INVALID_MACHINE_PAYLOAD');
  });

  it('aplica as mesmas validações de nome e tipo do cadastro', () => {
    expect(errorCode(() => parseUpdateMachineDto({ name: '' }))).toBe('INVALID_MACHINE_PAYLOAD');
    expect(errorCode(() => parseUpdateMachineDto({ type: 'Turbina' }))).toBe(
      'INVALID_MACHINE_TYPE',
    );
  });
});
