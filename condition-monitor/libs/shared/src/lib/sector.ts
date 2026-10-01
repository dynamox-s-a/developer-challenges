import { z } from 'zod';

/** A sector code prefixes machine tags (assumption B10); the database checks the same. */
export const SECTOR_CODE_PATTERN = /^[A-Z0-9]{2,10}$/;
export const SECTOR_NAME_MAX_LENGTH = 100;

/**
 * Typed codes are trimmed and uppercased before the check, so `dry` becomes `DRY`: the
 * meaning is unambiguous, and retyping it would only add friction.
 */
export const sectorCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(SECTOR_CODE_PATTERN, 'Must be 2 to 10 letters or digits.');

export const sectorNameSchema = z
  .string()
  .trim()
  .min(1, 'Required.')
  .max(SECTOR_NAME_MAX_LENGTH, `Must be at most ${SECTOR_NAME_MAX_LENGTH} characters.`);

/** Body of `POST /api/sectors`. */
export const createSectorSchema = z.object({
  code: sectorCodeSchema,
  name: sectorNameSchema,
});

/** Body of `PATCH /api/sectors/:id`: any subset of the fields, but at least one. */
export const updateSectorSchema = createSectorSchema
  .partial()
  .refine((body) => body.code !== undefined || body.name !== undefined, {
    message: 'Send at least one field to change.',
  });

export type CreateSectorRequest = z.infer<typeof createSectorSchema>;
export type UpdateSectorRequest = z.infer<typeof updateSectorSchema>;

/** A sector as the API answers it. */
export interface Sector {
  id: string;
  code: string;
  name: string;
  /** Machines installed in the sector; a sector with machines cannot be deleted (B9). */
  machineCount: number;
}
