import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';

export type AuthedRequest = Request & { userId?: string };

export function auth(req: AuthedRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization || '';
    const [type, token] = header.split(' ');

    if (type !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const payload = verifyAccessToken(token);
        req.userId = payload.sub;
        return next();
    } catch {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}
