import { IUser } from "./IUser";
import UserDBQuery from "./userDBQuery";
import { IFilter } from "../../shared/utils/IFilter";

class UserService {
  createNewUser = async (userInfo: IUser) => {
    return await UserDBQuery.createNewUser(userInfo);
  };

  editUser = async (id: string, userInfo: IUser): Promise<IUser> => {
    return await UserDBQuery.edit(id, userInfo);
  };

  getUser = async (id: string): Promise<IUser> => {
    return await UserDBQuery.getUser(id);
  };

  getAllUsers = async (query: any): Promise<IUser[]> => {
    const filter: IFilter = {
      orderBy: query.orderBy || "name",
      order: query.order || "desc",
      page: query.page,
      limit: query.limit,
      populate: { path: "profile" },
      value: query.value
        ? {
            $or: [
              { name: { $regex: query.value, $options: "i" } },
              { email: { $regex: query.value, $options: "i" } },
              { supvCode: { $regex: query.value, $options: "i" } },
            ],
          }
        : {},
    };

    return await UserDBQuery.getAllUsers(filter);
  };
  deleteUser = async (id: string): Promise<any> => {
    return await UserDBQuery.delete(id);
  };
}

export default new UserService();
