import React, { useState, useEffect } from 'react';
import api from '../../../api/api';

interface Machine {
  id: number;
  name: string;
  type: string;
}

const MachineList: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);

  const fetchMachines = async () => {
    const response = await api.get('/machines');
    setMachines(response.data);
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/machines/${id}`);
    fetchMachines();
  };

  useEffect(() => {
    fetchMachines();
  }, []);

  return (
    <div>
      <h2>Lista de Máquinas</h2>
      <ul>
        {machines.map((machine) => (
          <li key={machine.id}>
            {machine.name} ({machine.type})
            <button onClick={() => handleDelete(machine.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MachineList;
