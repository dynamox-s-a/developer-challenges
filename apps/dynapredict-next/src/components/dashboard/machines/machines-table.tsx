import React from 'react';
import { useRouter } from 'next/navigation';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import { PencilSimple as EditIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import dayjs from 'dayjs';

import { Machine } from '@/types/data-types';
import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useDeleteMachineMutation } from '@/lib/redux/service/api';
import { useUser } from '@/hooks/use-user';

const typeMap = {
  Pump: { color: 'primary' },
  Fan: { color: 'secondary' },
} as const;

interface MachinesTableProps {
  machines: Machine[];
}

export function MachinesTable({ machines }: MachinesTableProps): React.JSX.Element {
  const router = useRouter();
  const { checkSession } = useUser();
  const [deleteMachine, { isLoading }] = useDeleteMachineMutation();

  const handleDelete = async (machineId: number) => {
    try {
      await checkSession?.();
      await deleteMachine(machineId).unwrap();
    } catch (error) {
      logger.error('Failed to delete machine:', error);
    }
  };

  return (
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
        {machines?.map((machine) => {
          const { color } = typeMap[machine.type] ?? { color: 'default' };

          return (
            <TableRow
              hover
              key={machine.id}
              sx={{ opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}
            >
              <TableCell>{machine.name}</TableCell>
              <TableCell>
                <Chip color={color} label={machine.type} size="small" />
              </TableCell>
              <TableCell>{dayjs(machine.createdAt).format('MMM D, YYYY')}</TableCell>
              <TableCell align="right">
                <Tooltip title="Edit">
                  <IconButton
                    onClick={() => {
                      router.push(`${paths.dashboard.machines}/${machine.id}`);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton onClick={() => handleDelete(machine.id)}>
                    <TrashIcon />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
