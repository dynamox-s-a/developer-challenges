import PropTypes from 'prop-types';
import Bars3Icon from '@heroicons/react/24/solid/Bars3Icon';
import {
  Button,
  Box,
  IconButton,
  Stack,
  SvgIcon,
  Theme,
  useMediaQuery,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useCallback } from 'react';
import { useAppDispatch } from 'store/store';
import { logout } from 'store/features/user-slice';

const SIDE_NAV_WIDTH = 280;
const TOP_NAV_HEIGHT = 64;

export const Header = ({ onNavOpen }: { onNavOpen: () => void }) => {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const dispatch = useAppDispatch();

  const onLogoutClick = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return (
    <>
      <Box
        component="header"
        sx={{
          backdropFilter: 'blur(6px)',
          backgroundColor: (theme) =>
            alpha(theme.palette.background.default, 0.8),
          position: 'sticky',
          left: {
            lg: `${SIDE_NAV_WIDTH}px`,
          },
          top: 0,
          width: {
            lg: `calc(100% - ${SIDE_NAV_WIDTH}px)`,
          },
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Stack
          alignItems="center"
          direction="row"
          justifyContent="space-between"
          spacing={2}
          sx={{
            minHeight: TOP_NAV_HEIGHT,
            px: 2,
          }}
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            <IconButton onClick={onNavOpen}>
              <SvgIcon fontSize="small">
                <Bars3Icon />
              </SvgIcon>
            </IconButton>
          </Stack>
          <Stack alignItems="center" direction="row" spacing={2}>
            <Button onClick={onLogoutClick}>Logout</Button>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

Header.propTypes = {
  onNavOpen: PropTypes.func,
};
