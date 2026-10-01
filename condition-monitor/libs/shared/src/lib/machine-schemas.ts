import { z } from 'zod';
import { MACHINE_TYPES, type MachineType } from './machine.js';
import { paginationQuerySchema } from './pagination.js';
import { MACHINE_NUMBER_MAX } from './tag.js';

export const MACHINE_NAME_MAX_LENGTH = 100;

const idSchema = z.uuid('Must be a valid id.');

export const machineTypeSchema = z.enum(MACHINE_TYPES, {
  error: `Must be one of: ${MACHINE_TYPES.join(', ')}.`,
});

/** Completes the tag (assumption B10); the database checks the same range. */
export const machineNumberSchema = z
  .number({ error: `Must be a whole number from 1 to ${MACHINE_NUMBER_MAX}.` })
  .int(`Must be a whole number from 1 to ${MACHINE_NUMBER_MAX}.`)
  .min(1, `Must be a whole number from 1 to ${MACHINE_NUMBER_MAX}.`)
  .max(MACHINE_NUMBER_MAX, `Must be a whole number from 1 to ${MACHINE_NUMBER_MAX}.`);

/** Free text that may repeat (assumption B2): only empty or overlong names are refused. */
export const machineNameSchema = z
  .string()
  .trim()
  .min(1, 'Required.')
  .max(MACHINE_NAME_MAX_LENGTH, `Must be at most ${MACHINE_NAME_MAX_LENGTH} characters.`);

/** Body of `POST /api/machines`. */
export const createMachineSchema = z.object({
  sectorId: idSchema,
  type: machineTypeSchema,
  number: machineNumberSchema,
  name: machineNameSchema,
});

/** Body of `PATCH /api/machines/:id`: any subset of the fields, but at least one. */
export const updateMachineSchema = createMachineSchema
  .partial()
  .refine((body) => Object.values(body).some((value) => value !== undefined), {
    message: 'Send at least one field to change.',
  });

export const MACHINE_SORT_KEYS = ['tag', 'name', 'type', 'sector'] as const;
export type MachineSortKey = (typeof MACHINE_SORT_KEYS)[number];

/** Query of `GET /api/machines`: a page of machines, optionally of one sector. */
export const listMachinesQuerySchema = paginationQuerySchema({
  sortKeys: MACHINE_SORT_KEYS,
  defaultSort: 'tag',
  defaultPageSize: 10,
}).extend({ sectorId: idSchema.optional() });

/** Query of `GET /api/machines/next-number`. */
export const nextNumberQuerySchema = z.object({ sectorId: idSchema, type: machineTypeSchema });

export type CreateMachineRequest = z.infer<typeof createMachineSchema>;
export type UpdateMachineRequest = z.infer<typeof updateMachineSchema>;
export type ListMachinesQuery = z.infer<typeof listMachinesQuerySchema>;
export type NextNumberQuery = z.infer<typeof nextNumberQuerySchema>;

/** A machine as the API answers it, with its tag already built. */
export interface Machine {
  id: string;
  tag: string;
  name: string;
  type: MachineType;
  number: number;
  sector: { id: string; code: string; name: string };
}

/** Answer of `GET /api/machines/next-number`. */
export interface NextNumber {
  number: number;
  tag: string;
}
