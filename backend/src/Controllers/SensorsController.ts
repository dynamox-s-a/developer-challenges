import { Request, Response, NextFunction } from 'express';
import ISensor, { ICreateSensorParams } from '../Interfaces/ISensor';
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
    const sensor: ICreateSensorParams = {
      name: this.req.body.name,
      type: this.req.body.type,
      machineId: this.req.body.machineId,
    };

    try {
      const newSensor = await this.service.create(sensor);
      return this.res.status(HttpStatusCode.CREATED).json(newSensor);
    } catch (error) {
      this.next(error);
    }
  }

  public async listAll() {
    try {
      const sensors = await this.service.listAll(this.req.params.id);
      return this.res.status(HttpStatusCode.OK).json(sensors);
    } catch (error) {
      this.next(error);
    }
  }

  public async update() {
    try {
      const sensor: ISensor = {
        id: this.req.params.id,
        name: this.req.body.name,
        type: this.req.body.type,
        machineId: this.req.body.machineId,
      };

      const updatedSensor = await this.service.update(sensor);
      return this.res.status(HttpStatusCode.OK).json(updatedSensor);
    } catch (error) {
      this.next(error);
    }
  }

  public async delete() {
    try {
      const deleted = await this.service.delete(this.req.params.id);
      return this.res.status(HttpStatusCode.OK).json({ message: deleted });
    } catch (error) {
      this.next(error);
    }
  }
}
