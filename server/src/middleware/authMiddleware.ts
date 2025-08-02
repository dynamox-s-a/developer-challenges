import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.cookies.token;
    console.log("🚀 ~ file: authMiddleware.ts:15 ~ token:", token)
    if (!token) {
        return res.status(401).json({ error: "Missing or invalid token" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            email: string; userId: string
        };
        console.log("🚀 ~ file: authMiddleware.ts:21 ~ decoded:", decoded)
        req.user = {
            id: decoded.userId,
            email: decoded.email,
        };
        next();
    } catch (_err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}