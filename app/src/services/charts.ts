import baseURL from '../common/config/api';

const chartsService = {
  get: async () => {
    const response = await baseURL.get('charts');
    return response.data;
  },
  getByName: async (path: string) => {
    const response = await baseURL.get(`chart?name=${path}`);
    return response.data[0];
  },
};

export default chartsService;
