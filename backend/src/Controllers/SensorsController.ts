import { Request, Response, NextFunction } from 'express';
import { ICreateSensorParams } from '../Interfaces/ISensor';
import { HttpStatusCode } from './Interfaces';
import SensorsService from '../Services/SensorsService';

export default class SensorController {
  private req: Request;
  private res: Response;
  private next: NextFunction;
  private service: SensorsService;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.service = new SensorsService();
  }

  public async create() {
    const machine: ICreateSensorParams = {
      name: this.req.body.name,
      type: this.req.body.type,
      machineId: this.req.body.machineId,
    };

    try {
      const newMachine = await this.service.create(machine);
      return this.res.status(HttpStatusCode.CREATED).json(newMachine);
    } catch (error) {
      this.next(error);
    }
  }

  public async listAll() {
    try {
      const machines = await this.service.listAll(this.req.params.id);
      return this.res.status(HttpStatusCode.OK).json(machines);
    } catch (error) {
      this.next(error);
    }
  }
}
