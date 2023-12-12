import {
  IGetPagination,
  IMonitoringPoint,
  IPagination,
  ITableSort,
} from "../../../redux/store/monitoringPoints/types";
import { Api } from "../ApiConfig";

const getAll = ({ pagination, sort }: IGetPagination) => {
  const { page, limit }: IPagination = pagination;
  const { orderBy, order }: ITableSort = sort;
  return Api().get(
    `/machines?_embed=monitoring_points&_sort=${
      orderBy || "machineId"
    }&_order=${order || "DESC"}&_page=${page || 1}&_limit=${limit || 5}`,
  );
};

const create = (NewMonitoringPoint: IMonitoringPoint) => {
  return Api().post("/monitoring_points", NewMonitoringPoint);
};

const update = (NewMonitoringPoint: IMonitoringPoint) => {
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
  delete: deleteMonitoringPoint,
};
