import { IMachine } from "./IMachine";
import MachineDBQuery from "./machineDBQuery";
import { IFilter, PaginatedDTO } from "../../shared/utils/IFilter";

class MachineService {
  createNewMachine = async (machineInfo: IMachine) => {
    return await MachineDBQuery.createNewMachine(machineInfo);
  };

  editMachine = async (
    id: string,
    machineInfo: IMachine,
  ): Promise<IMachine> => {
    return await MachineDBQuery.edit(id, machineInfo);
  };

  getMachine = async (id: string): Promise<IMachine> => {
    return await MachineDBQuery.getMachine(id);
  };

  getAllMachines = async (query: any): Promise<PaginatedDTO> => {
    const filter: IFilter = {
      orderBy: query.orderBy || "name",
      order: query.order || "desc",
    };

    return await MachineDBQuery.getAllMachines(filter);
  };
  deleteMachine = async (id: string): Promise<any> => {
    return await MachineDBQuery.delete(id);
  };
}

export default new MachineService();
