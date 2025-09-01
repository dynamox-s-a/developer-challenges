import React, { useState } from 'react';
import { createMachine } from '../services/api';

const CreateMachine: React.FC = () => {
  const [name, setName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [description, setDescription] = useState('');
  const [machineTypeId, setMachineTypeId] = useState<number>(1); // Default to "Press"

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const machine = { name, serialNumber, description, machineTypeId };
    await createMachine(machine);
    alert('Machine created successfully!');
  };

  return (
    <div>
      <h1>Create New Machine</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Serial Number:
          <input
            type="text"
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <br />
        <label>
          Machine Type:
          <select
            value={machineTypeId}
            onChange={(e) => setMachineTypeId(Number(e.target.value))}
          >
            <option value={1}>Press</option>
            <option value={2}>Lathe</option>
            <option value={3}>Milling Machine</option>
          </select>
        </label>
        <br />
        <button type="submit">Create Machine</button>
      </form>
    </div>
  );
};

export default CreateMachine;
