import { IMonitoringPoint } from "../../../redux/store/monitoringPoints/types";
import { Api } from "../ApiConfig";

const getAll = () => {
  return Api().get("/monitoring_points");
};

const getById = (id: number) => {
  return Api().get(`/monitoring_points/${id}}`);
};

const create = (NewMonitoringPoint: IMonitoringPoint) => {
  return Api().post("/monitoring_points", NewMonitoringPoint);
};

const updateById = (NewMonitoringPoint: IMonitoringPoint) => {
  return Api().put(
    `/monitoring_points/${NewMonitoringPoint.id}}`,
    NewMonitoringPoint,
  );
};

const deleteById = (id: number) => {
  return Api().delete(`/monitoring_points/${id}}`);
};

export const MonitoringPointsService = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
