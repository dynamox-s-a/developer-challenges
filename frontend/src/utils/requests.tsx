import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

console.log('API', API);

export function deleteMachineById(
  id: string,
  okFunc = console.log,
  errFunc = console.log
) {
  let config = {
    method: 'delete',
    maxBodyLength: Infinity,
    url: `${API}/machines/${id}`,
    headers: {},
  };

  axios
    .request(config)
    .then((response) => {
      okFunc(response.data);
    })
    .catch((error) => {
      errFunc(error);
    });
}
