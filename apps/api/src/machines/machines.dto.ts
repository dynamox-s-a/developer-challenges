import { BadRequestException } from '@nestjs/common';

import { MACHINE_TYPES, isMachineType, type MachineType } from '@dynamox/domain';

export interface CreateMachineDto {
  name: string;
  type: MachineType;
}

export interface UpdateMachineDto {
  name?: string;
  type?: MachineType;
}

const ALLOWED_KEYS = ['name', 'type'] as const;

/** Nomes longos demais não têm uso real e só inflariam o índice único. */
export const MACHINE_NAME_MAX_LENGTH = 120;

function assertNoUnknownKeys(body: Record<string, unknown>): void {
  const unknown = Object.keys(body).filter(
    (key) => !(ALLOWED_KEYS as readonly string[]).includes(key),
  );
  if (unknown.length > 0) {
    throw new BadRequestException({
      code: 'INVALID_MACHINE_PAYLOAD',
      message: `Propriedade(s) não suportada(s): ${unknown.join(', ')}. Aceitos: ${ALLOWED_KEYS.join(', ')}.`,
    });
  }
}

/** O nome é normalizado por trim; a unicidade é a do banco, sensível a maiúsculas. */
function parseName(value: unknown): string {
  if (typeof value !== 'string') {
    throw new BadRequestException({
      code: 'INVALID_MACHINE_PAYLOAD',
      message: 'O campo "name" deve ser uma string.',
    });
  }
  const name = value.trim();
  if (name === '') {
    throw new BadRequestException({
      code: 'INVALID_MACHINE_PAYLOAD',
      message: 'O campo "name" não pode ser vazio.',
    });
  }
  if (name.length > MACHINE_NAME_MAX_LENGTH) {
    throw new BadRequestException({
      code: 'INVALID_MACHINE_PAYLOAD',
      message: `O campo "name" deve ter no máximo ${MACHINE_NAME_MAX_LENGTH} caracteres.`,
    });
  }
  return name;
}

function parseType(value: unknown): MachineType {
  if (!isMachineType(value)) {
    throw new BadRequestException({
      code: 'INVALID_MACHINE_TYPE',
      message: `O campo "type" deve ser um destes valores: ${MACHINE_TYPES.join(', ')}.`,
    });
  }
  return value;
}

function asObject(body: unknown): Record<string, unknown> {
  if (body === null || typeof body !== 'object' || Array.isArray(body)) {
    throw new BadRequestException({
      code: 'INVALID_MACHINE_PAYLOAD',
      message: 'O corpo da requisição deve ser um objeto JSON.',
    });
  }
  return body as Record<string, unknown>;
}

export function parseCreateMachineDto(body: unknown): CreateMachineDto {
  const object = asObject(body);
  assertNoUnknownKeys(object);
  return { name: parseName(object.name), type: parseType(object.type) };
}

export function parseUpdateMachineDto(body: unknown): UpdateMachineDto {
  const object = asObject(body);
  assertNoUnknownKeys(object);

  const dto: UpdateMachineDto = {};
  if (object.name !== undefined) dto.name = parseName(object.name);
  if (object.type !== undefined) dto.type = parseType(object.type);

  // Um PATCH sem nenhum campo é um pedido sem efeito: recusar é mais honesto que
  // devolver 200 fingindo que algo mudou.
  if (Object.keys(dto).length === 0) {
    throw new BadRequestException({
      code: 'INVALID_MACHINE_PAYLOAD',
      message: `Informe ao menos um campo para atualizar: ${ALLOWED_KEYS.join(' ou ')}.`,
    });
  }
  return dto;
}
