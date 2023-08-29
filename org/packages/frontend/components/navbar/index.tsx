'use-strict';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import PropTypes from 'prop-types';
import ServerStackIcon from '@heroicons/react/24/solid/ServerStackIcon';
import {
  Box,
  Divider,
  Drawer,
  Stack,
  SvgIcon,
  useMediaQuery,
} from '@mui/material';
import { Scrollbar } from 'components/scroll-bar';
import { SideNavItem } from 'components/scroll-bar/side-nav-item';
import { useAppDispatch } from 'store/store';
import { logout } from 'store/features/user-slice';
import { useCallback } from 'react';

export const items = [
  {
    title: 'Machines',
    path: '/',
    icon: (
      <SvgIcon fontSize="small">
        <ServerStackIcon />
      </SvgIcon>
    ),
  },
];

type SideNavType = {
  open: boolean;
  onClose: () => void;
};

export const SideNav = ({ open, onClose }: SideNavType) => {
  const pathname = usePathname();
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const dispatch = useAppDispatch();

  const onLogoutClick = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  const content = (
    <Scrollbar
      sx={{
        height: '100%',
        '& .simplebar-content': {
          height: '100%',
        },
        '& .simplebar-scrollbar:before': {
          background: 'neutral.400',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
      >
        <Box sx={{ p: 3 }}>
          <Box
            component={NextLink}
            href="/"
            sx={{
              display: 'inline-flex',
              height: 32,
              width: 32,
            }}
          >
            {/* <Logo /> */}
            Logo
          </Box>
        </Box>
        <Divider sx={{ borderColor: 'neutral.700' }} />
        <Box
          component="nav"
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
          }}
        >
          <Stack
            component="ul"
            spacing={0.5}
            sx={{
              listStyle: 'none',
              p: 0,
              m: 0,
            }}
          >
            {items.map((item) => {
              const active = item.path ? pathname === item.path : false;

              return (
                <SideNavItem
                  active={active}
                  icon={item.icon}
                  key={item.title}
                  path={item.path}
                  title={item.title}
                />
              );
            })}
          </Stack>
        </Box>
        <Box
          sx={{
            px: 2,
            py: 3,
          }}
        >
          <SideNavItem onClick={onLogoutClick} title="Logout" />
        </Box>
      </Box>
    </Scrollbar>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'neutral.800',
            color: 'common.white',
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onClose}
      open={open}
      PaperProps={{
        sx: {
          backgroundColor: 'neutral.800',
          color: 'common.white',
          width: 280,
        },
      }}
      sx={{ zIndex: (theme) => theme.zIndex.appBar + 100 }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

SideNav.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};
