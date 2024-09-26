import { IUser } from "./IUser";
import USER from "./userSchema";
import { IFilter } from "../../shared/utils/IFilter";
import { paginatedResults } from "../../middlewares/paginateResults";

class UserDBQuery {
  createNewUser = async (userInfo: IUser) => {
    return await USER.create(userInfo);
  };
  getAllUsers = async (filter: IFilter) => {
    return await paginatedResults(filter, USER);
  };

  getUser = async (id: string) => {
    return Promise.resolve(await USER.findById(id).populate("profile"));
  };

  edit = async (id: string, userInfo: IUser) => {
    return Promise.resolve(await USER.findOneAndUpdate({ _id: id }, userInfo));
  };

  delete = async (id: string) => {
    return Promise.resolve(await USER.findOneAndDelete({ _id: id }));
  };
}

export default new UserDBQuery();
