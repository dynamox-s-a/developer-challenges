import { Schema } from 'mongoose';
import { IUser } from './Interfaces';
import { ICreateUserParams } from '../Interfaces/IUser';
import AbstractODM from './AbstractODM';

class UserODM extends AbstractODM<IUser> {
  constructor() {
    const schema = new Schema<IUser>({
      name: { type: String, required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
    });
    super(schema, 'User');
  }

  public async create(user: ICreateUserParams): Promise<IUser> {
    const { _id, email, name } = await this.model.create(user);

    return new Promise((resolve) => {
      resolve({ id: _id.toHexString(), name, email, password: '' });
    });
  }

  public async findByEmail(email: string): Promise<IUser | null> {
    const user = await this.model.findOne({ email });

    if (user) {
      const { _id, name, password } = user;

      return new Promise((resolve) => {
        resolve({ id: _id.toHexString(), name, email, password });
      });
    }
    return null;
  }
}

export default UserODM;
