import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as jwt.Secret;

interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers.cookie?.split("token=")[1]?.split(";")[0];
    console.log("🚀 ~ file: authMiddleware.ts:17 ~ token:", token)
    if (!token) {
        return res.status(401).json({ error: "Missing or invalid token" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            email: string; userId: string; firstName: string; lastName: string
        };
        console.log("🚀 ~ file: authMiddleware.ts:23 ~ decoded:", decoded)
        req.user = {
            id: decoded.userId,
            email: decoded.email,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
        };
        next();
    } catch (_err) {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}