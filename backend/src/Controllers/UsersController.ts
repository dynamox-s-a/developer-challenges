import { NextFunction, Request, Response } from 'express';
import { ICreateUserParams } from '../Interfaces/IUser';
import { HttpStatusCode } from './Interfaces';
import UsersServices from '../Services/UsersServices';

export default class UsersController {
  private req: Request;
  private res: Response;
  private next: NextFunction;
  private service: UsersServices;

  constructor(req: Request, res: Response, next: NextFunction) {
    this.req = req;
    this.res = res;
    this.next = next;
    this.service = new UsersServices();
  }

  public async create() {
    const user: ICreateUserParams = {
      name: this.req.body.name,
      email: this.req.body.email,
      password: this.req.body.password,
    };

    try {
      const newUser = await this.service.create(user);
      return this.res.status(HttpStatusCode.CREATED).json(newUser);
    } catch (error) {
      this.next(error);
    }
  }
}
