import { Request, Response } from "express";
import MachineService from "./machineService";

class MachineController {
  createMachine = async (req: Request, res: Response): Promise<any> => {
    const machineInfo = req.body;
    const newMachine = await MachineService.createNewMachine(machineInfo);

    return res.status(200).json(newMachine);
  };

  getAllMachines = async (req: Request, res: Response): Promise<any> => {
    const getInfo = req.query;
    const allMachines = await MachineService.getAllMachines(getInfo);

    return res.status(200).json(allMachines);
  };

  editMachine = async (req: Request, res: Response) => {
    const { id } = req.params;
    const MachineInfo = req.body;
    const updatedMachine = await MachineService.editMachine(id, MachineInfo);

    return res.status(200).json({
      status: "success",
      data: updatedMachine,
    });
  };

  getMachine = async (req: Request, res: Response) => {
    const { id } = req.params;
    const Machine = await MachineService.getMachine(id);

    return res.status(200).json({
      status: "sucess",
      data: Machine,
    });
  };

  deleteMachine = async (req: Request, res: Response) => {
    const { id } = req.params;
    await MachineService.deleteMachine(id);

    return res.status(200).json({
      status: "Deleted",
    });
  };
}

export default new MachineController();
