import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function EditMachine() {
  const n = useNavigate();
  return (
    <div>
      <h1>Edit Machine {"(Under construction)"}</h1>
      <Button onClick={() => n(-1)}>Back</Button>
    </div>
  );
}
