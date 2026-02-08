import jwt from 'jsonwebtoken';

export type JwtPayload = { sub: string }; // userId

export function signAccessToken(userId: string): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not set');
    return jwt.sign({ sub: userId } satisfies JwtPayload, secret, {
        expiresIn: '2h',
    });
}

export function verifyAccessToken(token: string): JwtPayload {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is not set');
    return jwt.verify(token, secret) as JwtPayload;
}
