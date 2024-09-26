import { ISensor } from "./ISensor";
import SENSOR from "./sensorSchema";
import { IFilter } from "../../shared/utils/IFilter";
import { paginatedResults } from "../../middlewares/paginateResults";

class SensorDBQuery {
  createNewMachine = async (MachineInfo: ISensor) => {
    return await SENSOR.create(MachineInfo);
  };
  getAllMachines = async (filter: IFilter) => {
    return await paginatedResults(filter, SENSOR);
  };

  getMachine = async (id: string) => {
    return Promise.resolve(await SENSOR.findById(id).populate("profile"));
  };

  edit = async (id: string, MachineInfo: ISensor) => {
    return Promise.resolve(
      await SENSOR.findOneAndUpdate({ _id: id }, MachineInfo),
    );
  };

  delete = async (id: string) => {
    return Promise.resolve(await SENSOR.findOneAndDelete({ _id: id }));
  };
}

export default new SensorDBQuery();
