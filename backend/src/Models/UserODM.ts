import mongoose, { Schema, isObjectIdOrHexString } from 'mongoose';
import IUser, { ICreateUserParams } from '../Interfaces/IUser';
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

  public async findById(id: string): Promise<IUser | null> {

    if (!isObjectIdOrHexString(id)) {
      throw new Error("Invalid user ID format")
    }

    const _id = new mongoose.Types.ObjectId(id);
    const user = await this.model.findOne({ _id });

    if (user) {
      const { _id, name, email, password } = user;

      return new Promise((resolve) => {
        resolve({ id: _id.toHexString(), name, email, password });
      });
    }
    throw new Error("User ID not found");
  }
}

export default UserODM;
