import { IMonitoringPoint } from "../../../types";
import { Api } from "../ApiConfig";
import { ApiException } from "../ErrorException";

const getAll = async (): Promise<IMonitoringPoint[] | ApiException> => {
  try {
    const { data } = await Api().get("/monitoring_points");
    return data;
  } catch (error: any) {
    return new ApiException(error.message || "Erro ao buscar os registros");
  }
};

const getById = async (
  id: number,
): Promise<IMonitoringPoint | ApiException> => {
  try {
    const { data } = await Api().get(`/monitoring_points/${id}}`);
    return data;
  } catch (error: any) {
    return new ApiException(error.message || "Erro ao buscar o registro");
  }
};

const create = async (
  NewMonitoringPoint: Omit<IMonitoringPoint, "id">,
): Promise<IMonitoringPoint | ApiException> => {
  try {
    const { data } = await Api().post("/monitoring_points", NewMonitoringPoint);
    return data;
  } catch (error: any) {
    return new ApiException(error.message || "Erro ao criar o registro");
  }
};

const updateById = async (
  NewMonitoringPoint: IMonitoringPoint,
): Promise<IMonitoringPoint | ApiException> => {
  try {
    const { data } = await Api().put(
      `/monitoring_points/${NewMonitoringPoint.id}}`,
      NewMonitoringPoint,
    );
    return data;
  } catch (error: any) {
    return new ApiException(error.message || "Erro ao atualizar o registro");
  }
};

const deleteById = async (id: number): Promise<undefined | ApiException> => {
  try {
    await Api().delete(`/monitoring_points/${id}}`);
    return;
  } catch (error: any) {
    return new ApiException(error.message || "Erro ao apagar o registro");
  }
};
export const MonitoringPointsService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
