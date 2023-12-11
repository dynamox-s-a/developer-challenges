import { IMonitoringPoint } from "../../../redux/store/monitoringPoints/types";
import { Api } from "../ApiConfig";

const getAll = () => {
  return Api().get("/monitoring_points");
};

const create = (NewMonitoringPoint: IMonitoringPoint) => {
  return Api().post("/monitoring_points", NewMonitoringPoint);
};

const updateById = (NewMonitoringPoint: IMonitoringPoint) => {
  return Api().put(
    `/monitoring_points/${NewMonitoringPoint.id}`,
    NewMonitoringPoint,
  );
};

const deleteById = (id: number) => {
  return Api().delete(`/monitoring_points/${id}`);
};

export const MonitoringPointsService = {
  getAll,
  create,
  updateById,
  deleteById,
};
