import { NextFunction, Request, Response } from 'express';
import IMachine, { ICreateMachineParams } from '../Interfaces/IMachine';
import { HttpStatusCode } from './Interfaces';
import MachinesService from '../Services/MachinesService';

export default class MachinesController {
  private req: Request;
  private res: Response;
  private next: NextFunction;
  private service: MachinesService;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.service = new MachinesService();
  }

  public async create() {
    const machine: ICreateMachineParams = {
      name: this.req.body.name,
      type: this.req.body.type,
      userId: this.req.body.userId,
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

  public async update() {
    try {
      const machine: IMachine = {
        id: this.req.params.id,
        name: this.req.body.name,
        type: this.req.body.type,
        userId: this.req.body.userId,
      };

      const updatedMachine = await this.service.update(machine);
      return this.res.status(HttpStatusCode.OK).json(updatedMachine);
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
