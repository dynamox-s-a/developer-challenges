import { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconifyIcon from 'components/base/IconifyIcon';

interface Action {
  id: number;
  icon: string;
  title: string;
}

const actions: Action[] = [
  {
    id: 1,
    icon: 'ic:outline-account-circle',
    title: 'Profile',
  },
  {
    id: 2,
    icon: 'ic:baseline-edit',
    title: 'Edit',
  },
  {
    id: 3,
    icon: 'ic:baseline-delete-outline',
    title: 'Remove',
  },
];

const CardMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleActionButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleActionMenuClose = () => {
    setAnchorEl(null);
  };

  const handleActionItemClick = () => {
    handleActionMenuClose();
  };

  return (
    <>
      <IconButton
        edge="start"
        color="inherit"
        aria-label="card-menu"
        onClick={handleActionButtonClick}
        sx={{ bgcolor: 'transparent', '&:hover': { bgcolor: 'transparent' } }}
      >
        <IconifyIcon icon="ic:baseline-more-vert" color="text.disabled" />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleActionMenuClose}
        onClick={handleActionMenuClose}
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
            <MenuItem key={actionItem.id} onClick={handleActionItemClick}>
              <ListItemIcon sx={{ mr: 1, fontSize: 'h5.fontSize' }}>
                <IconifyIcon
                  icon={actionItem.icon}
                  color={actionItem.id === 3 ? 'error.main' : 'text.primary'}
                />
              </ListItemIcon>
              <ListItemText>
                <Typography color={actionItem.id === 3 ? 'error.main' : 'text.primary'}>
                  {actionItem.title}
                </Typography>
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default CardMenu;
