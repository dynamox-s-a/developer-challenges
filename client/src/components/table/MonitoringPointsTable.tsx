import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    TableSortLabel,
  } from "@mui/material";
  import { MonitoringPointTableProps } from "../../types/monitoringPoint";
  
  const columnMap: Record<string, string> = {
    "Machine Name": "machineId.name",
    "Machine Type": "machineId.type",
    "Monitoring Point Name": "name",
    "Sensor Model": "sensor.model",
  };
  
  export default function MonitoringPointTable({
    data,
    sortBy,
    order,
    onSortChange,
  }: MonitoringPointTableProps) {
    const headers = Object.keys(columnMap);
  
    return (
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((title) => (
              <TableCell key={title}>
                <TableSortLabel
                  active={sortBy === columnMap[title]}
                  direction={order}
                  onClick={() => onSortChange(columnMap[title])}
                >
                  {title}
                </TableSortLabel>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
  
        <TableBody>
          {data.map((mp) => (
            <TableRow key={mp._id}>
              <TableCell>{mp.machineId?.name}</TableCell>
              <TableCell>{mp.machineId?.type}</TableCell>
              <TableCell>{mp.name}</TableCell>
              <TableCell>{mp.sensor.model}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  