import { Router } from 'express';
import { z } from 'zod';
import { client as prisma } from '../../prisma/client';
import type { AuthedRequest } from '../middlewares/auth.middleware';

const router = Router();

const CreateMPSchema = z.object({
    machineId: z.coerce.number().int().positive(),
    name: z.string().min(1),
});

const UpdateMPSchema = z.object({
    name: z.string().min(1),
});

const AttachSensorSchema = z.object({
    uid: z.string().min(1),
    model: z.enum(['TcAg', 'TcAs', 'HF_PLUS']), // no front você exibe "HF+"
});

/**
 * POST /monitoring-points
 * cria MP para uma máquina do usuário autenticado
 */
router.post('/', async (req: AuthedRequest, res, next) => {
    try {
        const userId = Number(req.userId);
        const { machineId, name } = CreateMPSchema.parse(req.body);

        const machine = await prisma.machine.findFirst({
            where: { id: machineId, userId },
            select: { id: true },
        });
        if (!machine)
            return res.status(404).json({ message: 'Machine not found' });

        const mp = await prisma.monitoringPoint.create({
            data: {
                machineId,
                name,
            },
        });

        return res.status(201).json(mp);
    } catch (e) {
        next(e);
    }
});

/**
 * PUT /monitoring-points/:id
 */
router.put('/:id', async (req: AuthedRequest, res, next) => {
    try {
        const userId = Number(req.userId);
        const id = z.coerce.number().int().positive().parse(req.params.id);
        const { name } = UpdateMPSchema.parse(req.body);

        const mp = await prisma.monitoringPoint.findFirst({
            where: { id, machine: { userId } },
            select: { id: true },
        });
        if (!mp)
            return res
                .status(404)
                .json({ message: 'Monitoring point not found' });

        const updated = await prisma.monitoringPoint.update({
            where: { id },
            data: { name },
        });

        return res.json(updated);
    } catch (e) {
        next(e);
    }
});

/**
 * DELETE /monitoring-points/:id
 */
router.delete('/:id', async (req: AuthedRequest, res, next) => {
    try {
        const userId = Number(req.userId);
        const id = z.coerce.number().int().positive().parse(req.params.id);

        const mp = await prisma.monitoringPoint.findFirst({
            where: { id, machine: { userId } },
            select: { id: true },
        });
        if (!mp)
            return res
                .status(404)
                .json({ message: 'Monitoring point not found' });

        await prisma.monitoringPoint.delete({ where: { id } });
        return res.status(204).send();
    } catch (e) {
        next(e);
    }
});

/**
 * POST /monitoring-points/:id/sensor
 * Anexa (ou substitui) sensor no MP com regra:
 * - se machine.type = Pump => proíbe TcAg / TcAs
 */
router.post('/:id/sensor', async (req: AuthedRequest, res, next) => {
    try {
        const userId = Number(req.userId);
        const mpId = z.coerce.number().int().positive().parse(req.params.id);
        const { uid, model } = AttachSensorSchema.parse(req.body);

        const mp = await prisma.monitoringPoint.findFirst({
            where: { id: mpId, machine: { userId } },
            include: { machine: true, sensor: true },
        });
        if (!mp)
            return res
                .status(404)
                .json({ message: 'Monitoring point not found' });

        // Regra de negócio do desafio
        if (
            mp.machine.type === 'Pump' &&
            (model === 'TcAg' || model === 'TcAs')
        ) {
            return res.status(400).json({
                message:
                    'Sensors TcAg and TcAs are not allowed for Pump machines',
            });
        }

        // Upsert 1-1 (sensor por MP)
        const sensor = await prisma.sensor.upsert({
            where: { monitoringPointId: mpId },
            update: { uid, model },
            create: { monitoringPointId: mpId, uid, model },
        });

        return res.status(201).json(sensor);
    } catch (e: any) {
        // erro de unique uid
        if (e?.code === 'P2002') {
            return res
                .status(409)
                .json({ message: 'Sensor uid already exists' });
        }
        next(e);
    }
});

/**
 * DELETE /monitoring-points/:id/sensor
 */
router.delete('/:id/sensor', async (req: AuthedRequest, res, next) => {
    try {
        const userId = Number(req.userId);
        const mpId = z.coerce.number().int().positive().parse(req.params.id);

        const mp = await prisma.monitoringPoint.findFirst({
            where: { id: mpId, machine: { userId } },
            include: { sensor: true },
        });
        if (!mp)
            return res
                .status(404)
                .json({ message: 'Monitoring point not found' });

        if (!mp.sensor) return res.status(204).send();

        await prisma.sensor.delete({ where: { id: mp.sensor.id } });
        return res.status(204).send();
    } catch (e) {
        next(e);
    }
});

/**
 * GET /monitoring-points?page=1&pageSize=5&sort=machineName&dir=asc
 * Lista paginada/sortável (server-side)
 */
router.get('/', async (req: AuthedRequest, res, next) => {
    try {
        const userId = Number(req.userId);

        const page = z.coerce
            .number()
            .int()
            .positive()
            .catch(1)
            .parse(req.query.page);
        const pageSizeRaw = z.coerce
            .number()
            .int()
            .positive()
            .catch(5)
            .parse(req.query.pageSize);
        const pageSize = Math.min(pageSizeRaw, 5); // enunciado: máximo 5 por página

        const sort = z
            .enum([
                'machineName',
                'machineType',
                'monitoringPointName',
                'sensorModel',
                'createdAt',
            ])
            .catch('machineName')
            .parse(req.query.sort);

        const dir = z.enum(['asc', 'desc']).catch('asc').parse(req.query.dir);

        const orderByMap: any = {
            machineName: { machine: { name: dir } },
            machineType: { machine: { type: dir } },
            monitoringPointName: { name: dir },
            sensorModel: { sensor: { model: dir } },
            createdAt: { createdAt: dir },
        };

        const where = {
            machine: { userId },
        };

        const [total, rows] = await Promise.all([
            prisma.monitoringPoint.count({ where }),
            prisma.monitoringPoint.findMany({
                where,
                include: {
                    machine: { select: { name: true, type: true } },
                    sensor: { select: { model: true } },
                },
                orderBy: orderByMap[sort],
                skip: (page - 1) * pageSize,
                take: pageSize,
            }),
        ]);

        const items = rows.map((r) => ({
            id: r.id,
            machineName: r.machine.name,
            machineType: r.machine.type,
            monitoringPointName: r.name,
            sensorModel: r.sensor?.model ?? null,
            createdAt: r.createdAt.toISOString(),
        }));

        return res.json({
            page,
            pageSize,
            total,
            items,
        });
    } catch (e) {
        next(e);
    }
});

export default router;
