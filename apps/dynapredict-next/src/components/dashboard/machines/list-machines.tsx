'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { PencilSimple as EditIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import dayjs from 'dayjs';

import { paths } from '@/paths';

const typeMap = {
  Pump: { color: 'primary' },
  Fan: { color: 'secondary' },
} as const;

export interface Machine {
  id: string;
  name: string;
  type: 'Pump' | 'Fan';
  createdAt: Date;
}

type ListMachinesProps = {
  machines?: Machine[];
  sx?: SxProps;
};

export function ListMachines({ machines = [] }: ListMachinesProps): React.JSX.Element {
  const router = useRouter();

  return (
    <Card>
      <CardHeader
        title="Machines"
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
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {machines.map((machine) => {
              const { color } = typeMap[machine.type] ?? { color: 'default' };

              return (
                <TableRow hover key={machine.id}>
                  <TableCell>{machine.name}</TableCell>
                  <TableCell>
                    <Chip color={color} label={machine.type} size="small" />
                  </TableCell>
                  <TableCell>{dayjs(machine.createdAt).format('MMM D, YYYY')}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Edit">
                      <IconButton onClick={() => router.push(`${paths.dashboard.machines}/${machine.id}`)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        onClick={() => {
                          console.log('Delete machine:', machine.id);
                        }}
                      >
                        <TrashIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Card>
  );
}
