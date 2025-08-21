import React, { useState } from 'react';
import MachineList from '../components/MachineList';
import MachineForm from '../components/MachineForm';

const Home: React.FC = () => {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh(!refresh);

  return (
    <div>
      <h1>Gerenciamento de Máquinas</h1>
      <MachineForm onSave={handleRefresh} />
      <MachineList />
    </div>
  );
};

export default Home;
