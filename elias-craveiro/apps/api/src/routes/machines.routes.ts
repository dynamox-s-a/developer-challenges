import { Router } from 'express';
import { z } from 'zod';
import { client as prisma } from '../../prisma/client';
import type { AuthedRequest } from '../middlewares/auth.middleware';

const router = Router();

const MachineCreateSchema = z.object({
    name: z.string().min(1),
    type: z.enum(['Pump', 'Fan']),
});

const MachineUpdateSchema = z.object({
    name: z.string().min(1).optional(),
    type: z.enum(['Pump', 'Fan']).optional(),
});

router.get('/', async (req: AuthedRequest, res, next) => {
    try {
        const userId = Number(req.userId);
        const machines = await prisma.machine.findMany({
            where: { userId: Number(userId) },
            orderBy: { id: 'desc' },
        });
        res.json({ items: machines });
    } catch (e) {
        next(e);
    }
});

router.post('/', async (req: AuthedRequest, res, next) => {
    try {
        const userId = Number(req.userId);
        const data = MachineCreateSchema.parse(req.body);

        const created = await prisma.machine.create({
            data: {
                userId: Number(userId),
                name: data.name,
                type: data.type,
            },
        });

        res.status(201).json(created);
    } catch (e) {
        next(e);
    }
});

router.put('/:id', async (req: AuthedRequest, res, next) => {
    try {
        const userId = Number(req.userId);
        const id = parseInt(req.params.id);
        const data = MachineUpdateSchema.parse(req.body);

        // garante ownership
        const existing = await prisma.machine.findFirst({
            where: { id, userId: Number(userId) },
        });
        if (!existing)
            return res.status(404).json({ message: 'Machine not found' });

        const updated = await prisma.machine.update({
            where: { id },
            data,
        });

        res.json(updated);
    } catch (e) {
        next(e);
    }
});

router.delete('/:id', async (req: AuthedRequest, res, next) => {
    try {
        const userId = parseInt(req.userId);
        const id = parseInt(req.params.id);

        const existing = await prisma.machine.findFirst({
            where: { id, userId: userId },
        });
        if (!existing)
            return res.status(404).json({ message: 'Machine not found' });

        await prisma.machine.delete({ where: { id } });
        res.status(204).send();
    } catch (e) {
        next(e);
    }
});

export default router;
