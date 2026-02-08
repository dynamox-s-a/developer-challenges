import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../utils/httpError';

export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
) {

    // Zod validation
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: 'Validation error',
            issues: err.issues.map((i) => ({
                path: i.path.join('.'),
                message: i.message,
            })),
        });
    }

    // Custom typed errors
    if (err instanceof HttpError) {
        return res.status(err.status).json({
            message: err.message,
            details: err.details ?? null,
        });
    }

    // Prisma unique violation (P2002)
    const anyErr = err as any;
    if (anyErr?.code === 'P2002') {
        return res
            .status(409)
            .json({
                message: 'Unique constraint violation',
                details: anyErr?.meta ?? null,
            });
    }

    // Generic
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
}
