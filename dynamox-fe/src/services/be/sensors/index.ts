import { api } from "@/services/api/api";
import ApiServices from "@/constants/api-services";
import { Sensors } from "@/store/reducers/sensors.reducer";

const url = ApiServices.be;

const getAll = async (): Promise<{ data: Sensors[] }> => {
  try {
    return api.get(`${url}/sensors`);
  } catch (error) {
    throw error;
  }
};

export default {
  getAll,
};
