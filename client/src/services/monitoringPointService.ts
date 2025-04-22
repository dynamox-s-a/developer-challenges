import axios from 'axios';

const API_URL = 'http://localhost:5000/api/monitoring-points';

export const getMonitoringPoints = (page: number, sortBy: string, order: string) => 
  axios.get(`${API_URL}?page=${page}&sortBy=${sortBy}&order=${order}`);

export const createMonitoringPoint = (data: {
  machineId: string;
  name: string;
  sensor: {
    model: 'TcAg' | 'TcAs' | 'HF+';
    serialNumber: string;
  };
}) => axios.post(API_URL, data);
