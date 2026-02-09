import { useState } from 'react';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconifyIcon from 'components/base/IconifyIcon';
import { theme } from 'theme/theme';

interface Action {
  id: number;
  icon: string;
  title: string;
}

const actions: Action[] = [
  {
    id: 1,
    icon: 'ic:baseline-sync',
    title: 'Sync',
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

const ActionMenu = () => {
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
      <Stack
        component={ButtonBase}
        onClick={handleActionButtonClick}
        alignItems="center"
        justifyContent="center"
        height={36}
        width={36}
        bgcolor="neutral.main"
        borderRadius={theme.shape.borderRadius * 1}
      >
        <IconifyIcon icon="ic:baseline-more-horiz" color="primary.main" fontSize="h4.fontSize" />
      </Stack>
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

export default ActionMenu;
