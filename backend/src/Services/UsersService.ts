import IUser, { ICreateUserParams } from '../Interfaces/IUser';
import UserODM from '../Models/UserODM';
import User from '../Domain/User/User';

export default class UsersService {
  private createUserDomain(user: IUser | null): User | null {
    if (user) {
      return new User(user.id, user.name, user.email, undefined);
    }
    return null;
  }

  public async create(user: ICreateUserParams) {
    const userODM = new UserODM();
    const oldUser = await userODM.findByEmail(user.email);
    if (oldUser) {
      throw new Error("User already exist.")
    }

    const newUser = await userODM.create(user);
    return this.createUserDomain(newUser);
  }

  public async login({ email, password }: { email: string; password: string }) {
    const userODM = new UserODM();
    const user = await userODM.findByEmail(email);
    if (user?.password == password) {
      return new User(user.id, user.name, user.email, undefined);
    }

    return null;
  }
}
