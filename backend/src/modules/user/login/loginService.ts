import { singInToken } from "../../../shared/utils/jwtHandler";
import loginDBQuery from "./loginDBQuery";

class LoginService {
  compareHash = async (email: string, password: string) => {
    const user = await loginDBQuery.getUserByEmail(email);

    if (!user || !(await user.correctPassword(password, user.password))) {
      return false;
    }

    return singInToken(user._doc);
  };
}

export default new LoginService();
