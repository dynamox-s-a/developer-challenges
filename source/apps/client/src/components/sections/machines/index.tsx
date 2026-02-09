import { useState, ChangeEvent } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import IconifyIcon from 'components/base/IconifyIcon';
import MachinesTable from './MachinesTable';
import AddMachineDialog from './AddMachineDialog';
import { Machine } from 'store/slices/machinesSlice';

const MachinesSection = () => {
  const [searchText, setSearchText] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const handleAddMachineClick = () => {
    setSelectedMachine(null);
    setIsDialogOpen(true);
  };

  const handleEditMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedMachine(null);
  };

  return (
    <Box component={Paper} height={1} minHeight={400} px={4}>
      <Stack
        py={2}
        spacing={{ xs: 2, sm: 0 }}
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography variant="h4" textAlign={{ xs: 'center', sm: 'left' }}>
          Machines
        </Typography>

        <Stack direction="row" spacing={2} width={{ xs: 1, sm: 'auto' }} alignItems="center">
          <TextField
            variant="filled"
            size="small"
            placeholder="Search here"
            value={searchText}
            onChange={handleInputChange}
            sx={{ width: 1, maxWidth: { xs: 'none', sm: 220 } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconifyIcon icon="eva:search-fill" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            startIcon={<IconifyIcon icon="ic:baseline-plus" />}
            onClick={handleAddMachineClick}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Add Machine
          </Button>
        </Stack>
      </Stack>

      <Box mt={1} height={600}>
        <MachinesTable searchText={searchText} onEdit={handleEditMachine} />
      </Box>

      <AddMachineDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        machine={selectedMachine}
      />
    </Box>
  );
};

export default MachinesSection;

