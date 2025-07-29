import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
    };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }
    const token = authHeader.replace("Bearer ", "");
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
        req.user = {
            id: decoded.userId,
        };
        next();
    } catch (_err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}