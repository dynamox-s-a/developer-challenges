import {
  Box,
  Popover,
  Divider,
  MenuItem,
  MenuList,
  Typography,
} from '@mui/material';
import { FC } from 'react';
import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

interface AccountPopoverProps {
  anchorEl: Element;
  onClose?: () => void;
  open: boolean;
}

const AccountPopover: FC<AccountPopoverProps> = ({
  anchorEl, onClose, open
}) => {
  const router = useRouter();
  const { data: session } = useSession();

  const handleSignOut = useCallback(
    () => {
      onClose?.();
      signOut();
      router.push('/auth/login');
    },
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
          {session?.user?.name}
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
