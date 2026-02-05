import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

export interface MachineToolbarProps {
  searchQuery: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddClick: () => void;
}

export function MachineToolbar({ searchQuery, onSearchChange, onAddClick }: MachineToolbarProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        p: 2,
      }}
    >
      <OutlinedInput
        defaultValue=""
        value={searchQuery}
        onChange={onSearchChange}
        fullWidth={false}
        placeholder="Search machine..."
        startAdornment={
          <InputAdornment position="start">
            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
          </InputAdornment>
        }
        sx={{ maxWidth: '500px', width: '100%' }}
      />
      <Button onClick={onAddClick} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
        New Machine
      </Button>
    </Box>
  );
}
