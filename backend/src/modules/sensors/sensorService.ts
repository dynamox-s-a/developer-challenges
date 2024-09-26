import { ISensor } from "./ISensor";
import { IFilter, PaginatedDTO } from "../../shared/utils/IFilter";
import SensorDBQuery from "./sensorDBQuery";

class SensorService {
  createNewSensor = async (sensorInfo: ISensor) => {
    return await SensorDBQuery.createNewMachine(sensorInfo);
  };

  editSensor = async (id: string, sensorInfo: ISensor): Promise<ISensor> => {
    return await SensorDBQuery.edit(id, sensorInfo);
  };

  getSensor = async (id: string): Promise<ISensor> => {
    return await SensorDBQuery.getMachine(id);
  };

  getAllSensor = async (query: any): Promise<PaginatedDTO> => {
    const filter: IFilter = {
      orderBy: query.orderBy || "name",
      order: query.order || "desc",
    };

    return await SensorDBQuery.getAllMachines(filter);
  };
  deleteSensor = async (id: string): Promise<any> => {
    return await SensorDBQuery.delete(id);
  };
}

export default new SensorService();
