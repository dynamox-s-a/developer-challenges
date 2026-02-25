'use client';

import { ArrowDropDown } from '@mui/icons-material';
import { Button, Divider, Menu, MenuItem, Typography } from '@mui/material';
import { useState } from 'react';

interface SortMenuProps {
  sortName: 'date' | 'name';
  setSortName: (sort: 'date' | 'name') => void;
  sortType: 'asc' | 'desc';
  setSortType: (sort: 'asc' | 'desc') => void;
}

const SortMenu = ({ sortName, setSortName, sortType, setSortType }: SortMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpenMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <Button variant="outlined" color="primary" onClick={handleOpenMenu}>
        <Typography sx={{ display: { xs: 'block', lg: 'none' } }}>Sort</Typography>
        <Typography sx={{ display: { xs: 'none', lg: 'block' } }}>Sort By</Typography>
        <ArrowDropDown />
      </Button>
      <Menu
        sx={{ position: 'absolute', top: 0, left: 0 }}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseMenu}
        disableScrollLock={true}
      >
        <MenuItem
          selected={sortName === 'date'}
          onClick={() => {
            setSortName('date');
            handleCloseMenu();
          }}
        >
          Date
        </MenuItem>
        <MenuItem
          selected={sortName === 'name'}
          onClick={() => {
            setSortName('name');
            handleCloseMenu();
          }}
        >
          Name
        </MenuItem>
        <Divider orientation="horizontal" flexItem />
        <MenuItem
          selected={sortType === 'asc'}
          onClick={() => {
            setSortType('asc');
            handleCloseMenu();
          }}
        >
          Asc
        </MenuItem>
        <MenuItem
          selected={sortType === 'desc'}
          onClick={() => {
            setSortType('desc');
            handleCloseMenu();
          }}
        >
          Desc
        </MenuItem>
      </Menu>
    </>
  );
};

export default SortMenu;
