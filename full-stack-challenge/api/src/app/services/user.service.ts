import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import * as CryptoJS from 'crypto-js';
import { ClientSession, Connection } from 'mongoose';
import BaseService from '../core/base.service';
import User from '../models/user.model';
import UserRepository from '../repositories/user.repository';

@Injectable()
export default class UserService extends BaseService<User> {
  @InjectConnection()
  private connection: Connection;

  constructor(@Inject(UserRepository) repository) {
    super(repository);
  }

  encryptPassword(password): string {
    return CryptoJS.HmacSHA256(
      password.normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      process.env.PASSWORD_SECRET
    ).toString();
  }

  async insert(props: User, session?: ClientSession): Promise<User> {
    if (props.email) {
      const user = await super.findOne({
        where: { email: props.email.trim().toLowerCase() },
        withDeleted: true,
      });
      if (user) {
        throw new ConflictException(
          'O e-mail informado já está em uso',
          'duplicated_email'
        );
      }
    }

    if (session) {
      const user = await super.insert(props, session);

      return user;
    }

    session = await this.connection.startSession();
    try {
      await session.startTransaction();

      const user = await super.insert(props, session);

      await session.commitTransaction();
      return user;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
