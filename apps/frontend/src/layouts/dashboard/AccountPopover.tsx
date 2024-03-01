import {
  Box,
  Popover,
  Divider,
  MenuItem,
  MenuList,
  Typography,
} from '@mui/material';
import { FC, useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useAppDispatch from '../../hooks/useAppDispatch';
import useAppSelector from '../../hooks/useAppSelector';
import { logout as logoutStore } from '../../lib/redux/features/userSlice';

interface AccountPopoverProps {
  anchorEl: Element;
  onClose?: () => void;
  open: boolean;
}

const AccountPopover: FC<AccountPopoverProps> = ({
  anchorEl, onClose, open
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector(state => state.user);

  const handleSignOut = useCallback(
    () => {
      onClose?.();
      signOut();
      dispatch(logoutStore());
      router.push('/auth/login');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClose, router]
  );

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'left',
        vertical: 'bottom'
      }}
      onClose={onClose}
      open={open}
      PaperProps={{ sx: { width: 200 } }}
    >
      <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant="overline">
          Account
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {user?.name}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1
          }
        }}
      >
        <MenuItem onClick={handleSignOut}>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
};

export default AccountPopover;
