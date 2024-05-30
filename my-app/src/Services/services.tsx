import axios from "axios";
import { PATH } from "../PATH";

const services = {
  getFlowchart: async () => {
    return axios
      .get(`${PATH.base}/flowchart/`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  },

  getMachine: async () => {
    return axios
      .get(`${PATH.base}/machines`)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        throw error;
      });
  },
};

export default services;