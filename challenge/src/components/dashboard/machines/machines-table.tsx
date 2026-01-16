'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';

import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import { useSelection } from '@/hooks/use-selection';
import { Button } from '@mui/material';
import { TrashIcon } from '@phosphor-icons/react';

export interface Machine {
  id: string;
  name: string;
  type: string;
}

interface MachineTableProps {
  count?: number;
  rows?: Machine[];
}

export function MachinesTable({
  count = 0,
  rows = [],
}: MachineTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((customer) => customer.id);
  }, [rows]);

  // Data
  const [page, setPage] = React.useState(0);
  const rowsPerPage = 5;

  // Select rows
  const { selectOne, deselectOne, selected } = useSelection(rowIds);
  const selectedSome = selected.size > 1;

  // Handlers
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleDeleteItems = () => {
    console.log([...selected]);
    console.log(selectedSome);
    for (const value of selected) {
        rows = rows.filter(x => x.id != value);
    }
  };

  //Component

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Button startIcon = {<TrashIcon fontSize="var(--icon-fontSize-md)" color='red'/>}
                    onClick={()=>{
                        handleDeleteItems();
                    }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
            ).map((row) => {
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
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.type}</TableCell>
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
        onPageChange={handleChangePage}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5]}
      />
    </Card>
  );
}