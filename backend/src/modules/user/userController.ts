import { Request, Response } from "express";
import UserService from "./userService";

class UserController {
  createUser = async (req: Request, res: Response): Promise<any> => {
    const userInfo = req.body;
    const newUser = await UserService.createNewUser(userInfo);

    return res.status(200).json(newUser);
  };

  getAllUsers = async (req: Request, res: Response): Promise<any> => {
    const getInfo = req.query;
    const allUsers = await UserService.getAllUsers(getInfo);

    return res.status(200).json(allUsers);
  };

  editUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const userInfo = req.body;
    const updatedUser = await UserService.editUser(id, userInfo);

    return res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  };

  getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await UserService.getUser(id);

    return res.status(200).json({
      status: "sucess",
      data: user,
    });
  };

  deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    await UserService.deleteUser(id);

    return res.status(200).json({
      status: "Deleted",
    });
  };
}

export default new UserController();
