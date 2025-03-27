import MonitoringPointRepository from "../db/models/monitoringPointModel";
import { Request, Response } from 'express'

async function findAll(req: Request, res: Response) {
  const monitoringPoints = await MonitoringPointRepository.findAll();
  res.json(monitoringPoints);
}

function findMonitoringPoint(req: Request, res: Response) {
    MonitoringPointRepository.findByPk(req.params.id).then((result) => res.json(result));
}

function addMonitoringPoint(req: Request, res: Response) {
    MonitoringPointRepository.create({
        name: req.body.name,
        model: req.body.model,
        machine_id: req.body.machine_id,
    }).then((result) => res.json(result));
}

async function updateMonitoringPoint(req: Request, res: Response) {
    await MonitoringPointRepository.update(
    {
        name: req.body.name,
        model: req.body.model,
        machine_id: req.body.machine_id,
    },
    {
        where: {
            id: req.body.id,
        },
    }
    );

    MonitoringPointRepository.findByPk(req.body.id).then((result) => res.json(result));
}

async function deleteMonitoringPoint(req: Request, res: Response) {
    await MonitoringPointRepository.destroy({
    where: {
        id: req.params.id,
    },
    });

    MonitoringPointRepository.findAll().then((result) => res.json(result));
}

export default { findAll, findMonitoringPoint, addMonitoringPoint, updateMonitoringPoint, deleteMonitoringPoint };
