import { Request, Response, NextFunction } from 'express';
import { HttpStatusCode } from './Interfaces';
import MonitorService from '../Services/MonitorService';

export default class MonitorController {
  private req: Request;
  private res: Response;
  private next: NextFunction;
  private service: MonitorService;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.service = new MonitorService();
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
