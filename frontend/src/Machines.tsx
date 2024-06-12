import UserCard from './UserCard';
import useAuth from './useAuth';
import { useState } from 'react';
import './Machines.css';
import axios from 'axios';

const MACHINE_TYPES = ['fan', 'pump'];

export default function Machines() {
  return (
    <div>
      <h1>Machines</h1>
      <div>
        <CreateNewMachine />
      </div>
      <UserCard />
    </div>
  );
}

function CreateNewMachine() {
  const auth = useAuth();
  const { id } = auth!.user;
  const [data, setdata] = useState({
    name: '',
    type: MACHINE_TYPES[0],
  });

  const { name, type } = data;
  const setName = (value: string) => setdata({ ...data, name: value });
  const setType = (value: string) => setdata({ ...data, type: value });

  const okFunc = (data: string) => {
    alert('New machine created!');
    console.log(data);
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
          {/* <option value="pump">Pump</option>
          <option value="fan">Fan</option> */}
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
