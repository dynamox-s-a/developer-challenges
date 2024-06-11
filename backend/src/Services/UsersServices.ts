import { IUser } from '../Models/Interfaces';
import { ICreateUserParams } from '../Interfaces/IUser';
import UserODM from '../Models/UserODM';
import User from '../Domain/User/User';

export default class UsersServices {
  private createUserDomain(user: IUser | null): User | null {
    if (user) {
      return new User(user.id, user.name, user.email, undefined);
    }
    return null;
  }

  public async create(user: ICreateUserParams) {
    const userODM = new UserODM();
    const newUser = await userODM.create(user);
    return this.createUserDomain(newUser);
  }
}
