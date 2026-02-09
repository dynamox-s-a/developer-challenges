import { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconifyIcon from 'components/base/IconifyIcon';
import DeleteMachineDialog from './DeleteMachineDialog';
import { Machine } from 'store/slices/machinesSlice';

interface Action {
  id: number;
  icon: string;
  title: string;
}

const actions: Action[] = [
  {
    id: 1,
    icon: 'ic:baseline-edit',
    title: 'Edit',
  },
  {
    id: 2,
    icon: 'ic:baseline-delete-outline',
    title: 'Remove',
  },
];

interface MachineActionMenuProps {
  machine: Machine;
  onEdit: (machine: Machine) => void;
}

const MachineActionMenu = ({ machine, onEdit }: MachineActionMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const open = Boolean(anchorEl);

  const handleActionButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteOpen = () => {
    setIsDeleteDialogOpen(true);
    handleActionMenuClose();
  };

  const handleDeleteClose = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleActionItemClick = (title: string) => {
    if (title === 'Edit') {
      onEdit(machine);
      handleActionMenuClose();
    } else if (title === 'Remove') {
      handleDeleteOpen();
    }
  };

  return (
    <Box pr={2}>
      <IconButton
        onClick={handleActionButtonClick}
        sx={{ p: 0.75, border: 'none', bgcolor: 'transparent !important' }}
        size="medium"
      >
        <IconifyIcon icon="solar:menu-dots-bold" color="text.primary" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="machine-action-menu"
        open={open}
        onClose={handleActionMenuClose}
        sx={{
          mt: 0.5,
          '& .MuiList-root': {
            width: 140,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {actions.map((actionItem) => {
          return (
            <MenuItem key={actionItem.id} onClick={() => handleActionItemClick(actionItem.title)}>
              <ListItemIcon sx={{ mr: 1, fontSize: 'h5.fontSize' }}>
                <IconifyIcon
                  icon={actionItem.icon}
                  color={actionItem.id === 2 ? 'error.main' : 'text.primary'}
                />
              </ListItemIcon>
              <ListItemText>
                <Typography color={actionItem.id === 2 ? 'error.main' : 'text.primary'}>
                  {actionItem.title}
                </Typography>
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>

      <DeleteMachineDialog
        open={isDeleteDialogOpen}
        onClose={handleDeleteClose}
        machine={machine}
      />
    </Box>
  );
};

export default MachineActionMenu;
