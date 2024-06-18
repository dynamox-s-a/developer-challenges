import axios from 'axios';
import { useState } from 'react';
import useAuth from './useAuth';
import { MACHINE_TYPES } from './constants';
import { useGetMachinesQuery } from './features/monitor/monitorSlice';

export default function CreateMachine() {
  const auth = useAuth();
  const { id } = auth!.user;
  const [data, setdata] = useState({
    name: '',
    type: MACHINE_TYPES[0],
  });

  const { refetch } = useGetMachinesQuery(auth!.user.id);

  const { name, type } = data;
  const setName = (value: string) => setdata({ ...data, name: value });
  const setType = (value: string) => setdata({ ...data, type: value });

  const okFunc = (data: string) => {
    alert('New machine created!');
    console.log(data);
    refetch();
  };

  const errFunc = (data: string) => {
    alert('Error! No new machine created.');
    console.log(data);
  };

  const handleCreate = () => {
    console.log('New Machine: ', { id, name, type });
    const machine: newMachineParams = { userId: id, name, type };
    requestNewMachine(machine, okFunc, errFunc);
  };

  return (
    <div id="createMachine">
      <div>
        <h2>Create a new machine</h2>
      </div>
      <div>
        <label htmlFor="name">Machine Name:</label>{' '}
        <input
          id="name"
          type="text"
          onChange={({ target: { value } }) => setName(value)}
        />
      </div>
      <div>
        <label htmlFor="name">Machine Type:</label>{' '}
        <select onChange={({ target: { value } }) => setType(value)}>
          {MACHINE_TYPES.map((i, k) => (
            <option key={k} value={i}>
              {i}
            </option>
          ))}
        </select>
      </div>
      <div id="buttonBox">
        <button type="button" onClick={handleCreate}>
          Create
        </button>
        {/* <button type="button">Cancel</button> */}
      </div>
    </div>
  );
}

export type newMachineParams = { userId: string; name: string; type: string };

function requestNewMachine(
  machine: newMachineParams,
  okFunc = console.log,
  errFunc = console.log
) {
  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'http://localhost:3001/machines',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(machine),
  };

  axios
    .request(config)
    .then((response) => {
      okFunc(JSON.stringify(response.data));
    })
    .catch((error) => {
      errFunc(error);
    });
}
