import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { client as prisma } from '../../prisma/client';
import { auth } from '../middlewares/auth.middleware';
import { signAccessToken } from '../utils/jwt';

const router = Router();

const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(1),
});

router.get('/me', auth, async (req: any, res) => {
    const userId = Number(req.userId);

    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, email: true, createdAt: true },
    });

    return res.json({ user });
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = LoginSchema.parse(req.body);

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(401).json({ message: 'Invalid credentials' });

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok)
            return res.status(401).json({ message: 'Invalid credentials' });

        const accessToken = signAccessToken(String(user.id));

        return res.json({
            accessToken,
            user: { id: user.id, email: user.email },
        });
    } catch (e) {
        next(e);
    }
});

export default router;
