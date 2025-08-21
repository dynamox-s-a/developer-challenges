import MachineRepository from "../db/models/machineModel";
import MonitoringPointRepository from '../db/models/monitoringPointModel';
import { Request, Response } from 'express'

async function findAll(req: Request, res: Response) {
    const machines = await MachineRepository.findAll({
        where: {
            user_id: req.params.id
        }
    });

    let monitoringPoints: any[] = [];

    for(let machine of machines) {
        const points = await MonitoringPointRepository.findAll({
            where: {
                machine_id: machine.get('id'),
            },
            raw: true,
        });

        monitoringPoints = monitoringPoints.concat(points.map((i:any) => ({
            machineId: machine.get('id'),
            id: i.id,
            machineName: machine.get('name'),
            machineType: machine.get('type'),
            name: i.name,
            model: i.model,
        })));
    }
    
    res.json(monitoringPoints);
}

function findMachine(req: Request, res: Response) {
    MachineRepository.findByPk(req.params.id).then((result) => res.json(result));
}

function addMachine(req: Request, res: Response) {
    MachineRepository.create({
        name: req.body.name,
        type: req.body.type,
        user_id: req.body.user_id,
    }).then((result) => res.json(result));
}

async function updateMachine(req: Request, res: Response) {
    await MachineRepository.update(
    {
        name: req.body.name,
        type: req.body.type,
        user_id: req.body.user_id,
    },
    {
        where: {
            id: req.body.id,
        },
    }
    );

    MachineRepository.findByPk(req.body.id).then((result) => res.json(result));
}

async function deleteMachine(req: Request, res: Response) {
    await MachineRepository.destroy({
    where: {
        id: req.params.id,
    },
    });

    MachineRepository.findAll().then((result) => res.json(result));
}

export default { findAll, findMachine, addMachine, updateMachine, deleteMachine };
