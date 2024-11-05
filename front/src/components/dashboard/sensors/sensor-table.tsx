'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import { TrashSimple } from '@phosphor-icons/react';

export interface Asset {
  id: number;
  name: string;
  type: string;
}

export interface Sensor {
  id: number;
  name: string;
  type: string;
  asset: Asset;
}

interface SensorTableProps {
  sensors: Sensor[];
  onDelete: (id: number) => void;
}

export function SensorTable({
  sensors = [],
  onDelete,
}: SensorTableProps): React.JSX.Element {
  console.log(sensors)
  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>Sensor Name</TableCell>
              <TableCell>Sensor Type</TableCell>
              <TableCell>Asset Name</TableCell>
              <TableCell>Asset Type</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sensors.map((sensor) => (
              <TableRow hover key={sensor.id}>
                <TableCell>{sensor.name}</TableCell>
                <TableCell>{sensor.type}</TableCell>
                <TableCell>{sensor.asset.name}</TableCell>
                <TableCell>{sensor.asset.type}</TableCell>
                <TableCell>
                  <Button
                    startIcon={<TrashSimple fontSize="var(--icon-fontSize-md)" />}
                    variant="contained"
                    onClick={() => onDelete(sensor.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}
