import baseURL from '../common/config/api';

const chartsService = {
  get: async () => {
    const response = await baseURL.get('charts');
    return response.data;
  },
};

export default chartsService;
