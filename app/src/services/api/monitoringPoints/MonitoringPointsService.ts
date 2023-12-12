import { EditPoint, IListPoint, NewPoint } from "../../../redux/store/monitoringPoints/types";
import { Api } from "../ApiConfig";

const getAll = () => {
  return Api().get("/machines?_embed=monitoring_points");
};

const list = () => {
  return Api().get("/monitoring_points");
};

const create = (NewMonitoringPoint: NewPoint) => {
  return Api().post("/monitoring_points", NewMonitoringPoint);
};

const update = (NewMonitoringPoint: EditPoint) => {
  return Api().put(
    `/monitoring_points/${NewMonitoringPoint.id}`,
    NewMonitoringPoint,
  );
};

const deleteMonitoringPoint = (id: number) => {
  return Api().delete(`/monitoring_points/${id}`);
};

export const MonitoringPointsService = {
  getAll,
  create,
  update,
  list,
  delete: deleteMonitoringPoint,
};
