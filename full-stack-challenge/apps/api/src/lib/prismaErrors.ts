import { Prisma } from '../generated/prisma/client';
import { AppError } from '../errors/AppError';

export function isUniqueViolation(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  );
}

/** A write referenced a row that doesn't exist (e.g. an unknown sensorId). */
export function isForeignKeyViolation(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2003'
  );
}

interface UniqueViolationMeta {
  target?: string | string[];
  driverAdapterError?: {
    cause?: { constraint?: { fields?: string[]; index?: string } };
  };
}

/**
 * The fields of the unique constraint a P2002 violated. The native engine puts
 * them in `meta.target`; with a driver adapter (our @prisma/adapter-pg) they
 * only appear as the index name, e.g. `Sensor_serialNumber_key`.
 */
export function uniqueViolationFields(
  error: Prisma.PrismaClientKnownRequestError,
): string[] {
  const meta = (error.meta ?? {}) as UniqueViolationMeta;
  if (meta.target) {
    return Array.isArray(meta.target) ? meta.target : [meta.target];
  }

  const constraint = meta.driverAdapterError?.cause?.constraint;
  if (constraint?.fields) return constraint.fields;
  // Prisma names unique indexes `<Model>_<field>[_<field>...]_key`.
  const indexFields = constraint?.index?.match(/^[^_]+_(.+)_key$/)?.[1];
  return indexFields ? indexFields.split('_') : [];
}

/**
 * Awaits a Prisma write and turns "record not found" (P2025) into a 404 with a
 * resource-specific message. The errorHandler would map P2025 anyway, but only
 * to a generic "Resource not found".
 */
export async function orNotFound<T>(
  operation: Promise<T>,
  message: string,
): Promise<T> {
  try {
    return await operation;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw AppError.notFound(message);
    }
    throw error;
  }
}
