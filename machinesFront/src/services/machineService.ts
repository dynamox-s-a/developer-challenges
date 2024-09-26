import { http } from "./http.ts";
import { filterType } from "../utils/filterType.ts";
import {IMachine} from "../pages/Machine/IMachine.ts";


export async function createMachine(machineInfo: IMachine) {
  return await http.post(`/machine`, machineInfo);
}

export async function upDateMachine(machineInfo: IMachine) {
  return await http.put(`/machine/${machineInfo._id}`, machineInfo);
}

export async function getAllMachines(filter: filterType) {
  const { data } = await http.get(
    `/machine?orderBy=${filter.sort.orderBy}&order=${filter.sort.order}`,
  );
  return data;
}

export async function deleteMachine(id: string) {
  await http.delete(`/machine/${id}`);
}

// export async function getAllSensors(filter: filterType) {
//   const { data } = await http.get(
//     `/sensor?orderBy=${filter.sort.orderBy}&order=${filter.sort.order}`,
//   );
//   return data;
// }
