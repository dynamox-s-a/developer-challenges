import AppAxios from "@/app/axios/AppAxios";
import Machine from "@/app/types/Machine";
import { toast } from "react-toastify";

export default {
  async getAllMachines() {
    return AppAxios()
      .get("/machines")
      .then((response) => {
        return response;
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        return error.response;
      });
  },

  async getMachineById(id: number) {
    return AppAxios()
      .get(`/machines/${id}`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        return error.response;
      });
  },

  async save(machine: Omit<Machine, "id">) {
    return AppAxios()
      .post("/machines", machine)
      .then((Response) => {
        if (Response.status === 201) {
          toast.success("Machine created successfully");
        }
        return Response;
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        return error.response;
      });
  },
  async update(id: number, machine: Machine) {
    return AppAxios()
      .put(`/machines`, {
        id: id,
        name: machine.name,
        type: machine.type,
      })
      .then((Response) => {
        if (Response.status === 200) {
          toast.success("Machine updated successfully");
        }
        return Response;
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        console.error(error);
      });
  },
  async delete(id: number) {
    return AppAxios()
      .delete(`/machines/${id}`)
      .then((Response) => {
        if (Response.status === 200) {
          toast.success("Machine deleted successfully");
        }
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        return error.response;
      });
  },
};
