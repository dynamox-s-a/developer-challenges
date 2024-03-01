import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useQuery } from '@tanstack/react-query';
import DateFormatter from '../../core/components/date-formatter';
import getAllSensors from '../actions';

export default function SensorsTable() {
  const getSensorList = {
    queryFn: () => getAllSensors({ page: 1, size: 5 }),
    queryKey: ['Sensors'],
  };

  const { data, isFetching } = useQuery(getSensorList);

  if (!data || isFetching)
    return (
      <Skeleton
        variant="rectangular"
        sx={{ borderRadius: 1 }}
        width={'99%'}
        height={360}
      />
    );

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Sensor Id</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Created At</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.data.map((row) => (
            <TableRow
              key={row._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row._id}
              </TableCell>
              <TableCell align="right">{row.modelName}</TableCell>
              <TableCell align="right">
                <DateFormatter>{row.createdAt}</DateFormatter>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
