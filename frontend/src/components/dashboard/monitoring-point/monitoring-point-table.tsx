'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import IconButton from "@mui/material/IconButton";
import Button from '@mui/material/Button';
import { Minus as PlusMinus } from '@phosphor-icons/react/dist/ssr/Minus';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';

import { paths } from '@/paths';
import RouterLink from 'next/link';

import { useSelection } from '@/hooks/use-selection';

function noop(): void {
  // do nothing
}

export interface MonitoringPoint {
  id: string;
  name: string;
  type: string;
  machine: string;
}

interface MonitoringPointTableProps {
  count?: number;
  page?: number;
  rows?: MonitoringPoint[];
  rowsPerPage?: number;
  handleDeleteClick?: any;
}

export function MonitoringPointTable({
  count = 0,
  rows = [],
  page = 0,
  rowsPerPage = 0,
  handleDeleteClick = null
}: MonitoringPointProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows, handleDeleteClick]);

  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <colgroup>
              <col width="5%" />
              <col width="60%" />
              <col width="10%" />
              <col width="20%" />
              <col width="5%" />
          </colgroup>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Machine</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell component={RouterLink} href={{ pathname: paths.dashboard.edit_monitoring_point, query: { id: row.id } }}>
                      <Typography variant="subtitle2">{row.name}</Typography>
                  </TableCell>
                  <TableCell>{row.type}</TableCell>
                  <TableCell>{row.machine}</TableCell>
                  <TableCell sx={{'text-align': 'center'}}>
                    <Button sx={{'border-radius': '25px', 'padding': '0', 'height': '25px', 'width': '25px', 'min-width': '25px'}} color="error" variant="contained" onClick={handleDeleteClick} id={row.id}>
                      <PlusMinus />
                    </Button >
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
