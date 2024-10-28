import AppAxios from "@/app/axios/AppAxios";
import MonitoringPoints from "@/app/types/MonitoringPoints";
import { toast } from "react-toastify";

export default {
  async save(monitoringPoint: MonitoringPoints) {
    return AppAxios()
      .post("/monitoringPoints", monitoringPoint)
      .then((response) => {
        if (response.status === 201) {
          toast.success("Monitoring point created successfully");
          return response;
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        return error.response;
      });
  },

  async getAllMonitoringPoints() {
    return AppAxios()
      .get("/monitoringPoints")
      .then((response) => {
        if (response.status === 200) {
          return response;
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        return error.response;
      });
  },

  async getMonitoringPointById(id: number) {
    return AppAxios()
      .get(`/monitoringPoints/${id}`)
      .then((response) => {
        if (response.status === 200) {
          return response;
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        return error.response;
      });
  },

  async update(id: number, monitoringPoint: MonitoringPoints) {
    return AppAxios()
      .put(`/monitoringPoints`, {
        id: id,
        machineId: monitoringPoint.machineId,
        sensorId: monitoringPoint.sensorId,
        name: monitoringPoint.name,
      })
      .then((response) => {
        if (response.status === 200) {
          toast.success("Monitoring point updated successfully");
          return response;
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        return error.response;
      });
  },
  async delete(id: number) {
    return AppAxios()
      .delete(`/monitoringPoints/${id}`)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Monitoring point deleted successfully");
          return response;
        }
      });
  },
};
