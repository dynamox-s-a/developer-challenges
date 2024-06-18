import { Button } from '@mui/material';
import CreateMachine from './CreateMachine';
import { useNavigate } from 'react-router-dom';

export default function AddMachine() {
  const n = useNavigate();
  return (
    <div>
      <h1>Create Machine</h1>
      <CreateMachine />
      <Button onClick={() => n(-1)}>Back</Button>
    </div>
  );
}
