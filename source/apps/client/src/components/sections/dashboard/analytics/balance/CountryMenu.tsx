import { useState } from 'react';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconifyIcon from 'components/base/IconifyIcon';

interface Country {
  id: number;
  name: string;
  flag: string;
}

const countries: Country[] = [
  {
    id: 1,
    name: 'United States',
    flag: 'circle-flags:um',
  },
  {
    id: 2,
    name: 'England',
    flag: 'emojione:flag-england',
  },
  {
    id: 3,
    name: 'Sweden',
    flag: 'emojione:flag-for-sweden',
  },
  {
    id: 4,
    name: 'Turkey',
    flag: 'emojione:flag-for-turkey',
  },
];

const CountryMenu = () => {
  const [country, setCountry] = useState(countries[0]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleActionButtonClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (country: Country) => {
    setCountry(country);
    handleMenuClose();
  };

  return (
    <Box pr={2}>
      <Stack
        onClick={handleActionButtonClick}
        direction="row"
        spacing={0.5}
        alignItems="center"
        sx={{ cursor: 'pointer' }}
      >
        <IconifyIcon icon={country.flag} fontSize={50} />
        <IconifyIcon icon="ri:arrow-down-s-line" color="text.disabled" fontSize={24} />
      </Stack>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        sx={{
          mt: 0.5,
          '& .MuiList-root': {
            width: 190,
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {countries.map((item, index) => {
          return (
            <MenuItem
              key={item.id}
              onClick={() => handleMenuItemClick(countries[index])}
              sx={{ mb: 0.5, bgcolor: country.id === item.id ? 'neutral.main' : null }}
            >
              <ListItemIcon sx={{ mr: 1.5, fontSize: 'h2.fontSize' }}>
                <IconifyIcon icon={item.flag} />
              </ListItemIcon>
              <ListItemText>
                <Typography>{item.name}</Typography>
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};

export default CountryMenu;
