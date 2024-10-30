import { Card, CardContent } from '@mui/material';

export default function NoMachinesCard(): React.JSX.Element {
  return (
    <Card>
      <CardContent>Please create a machine first before creating a monitoring point.</CardContent>
    </Card>
  );
}
