'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { PencilSimple } from '@phosphor-icons/react/dist/ssr/PencilSimple';

export interface MonitoringPoint {
  id: string;
  name: string;
  machineId: string;
  machineName: string;
  sensorId: string | null;
  isEnabled: boolean;
}

interface Sensor {
  id: string;
  name: string;
}

interface ListMonitoringPointsProps {
  monitoringPoints: MonitoringPoint[];
  availableSensors: Sensor[];
  onSensorChange?: (monitoringPointId: string, sensorId: string) => void;
  onToggleEdit?: (monitoringPointId: string) => void;
  editingPointId: string | null;
}

export function ListMonitoringPoints({
  monitoringPoints = [],
  availableSensors = [],
  onSensorChange,
  onToggleEdit,
  editingPointId,
}: ListMonitoringPointsProps): React.JSX.Element {
  return (
    <Card>
      <CardHeader
        title="Monitoring Points"
        sx={{
          '& .MuiCardHeader-title': {
            fontSize: '1.5rem',
            fontWeight: 600,
          },
        }}
      />
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sensor Assignment</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Machine</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {monitoringPoints.map((point) => (
              <TableRow hover key={point.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: '200px' }}>
                    <Select
                      size="small"
                      value={point.sensorId || ''}
                      onChange={(e) => onSensorChange?.(point.id, e.target.value)}
                      disabled={editingPointId !== point.id}
                    >
                      <MenuItem value="">
                        <em>None</em>
                      </MenuItem>
                      {availableSensors.map((sensor) => (
                        <MenuItem key={sensor.id} value={sensor.id}>
                          {sensor.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <Tooltip title={editingPointId === point.id ? 'Disable Assignment' : 'Enable Assignment'}>
                      <IconButton
                        onClick={() => onToggleEdit?.(point.id)}
                        color={editingPointId === point.id ? 'primary' : 'default'}
                      >
                        <PencilSimple weight={editingPointId === point.id ? 'fill' : 'regular'} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
                <TableCell>{point.name}</TableCell>
                <TableCell>{point.machineName}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}
