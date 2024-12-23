import * as React from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { SignOut as SignOutIcon } from "@phosphor-icons/react/dist/ssr/SignOut";
import Alert from "@mui/material/Alert";

import { paths } from "@/paths";
import { logger } from "@/lib/default-logger";
import { useAppDispatch, useAppSelector } from "@/types/hooks";
import { logout } from "@/redux/auth/thunks";

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function UserPopover({
  anchorEl,
  onClose,
  open,
}: UserPopoverProps): React.JSX.Element {
  const router = useRouter();
  const dispatch = useAppDispatch();
  
  const { user } = useAppSelector((state) => state.auth);
  
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [logoutError, setLogoutError] = React.useState<string | null>(null);

  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      setIsLoggingOut(true);
      setLogoutError(null);

      await dispatch(logout()).unwrap();
      
      onClose();
      
      router.replace(paths.auth.signIn);
      
      router.refresh();
    } catch (error: any) {
      logger.error("Sign out error:", error);
      setLogoutError(error.message || "Failed to sign out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  }, [dispatch, router, onClose]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: "240px", marginLeft: 2 } } }}
    >
      <Box sx={{ p: "16px 20px" }}>
        <Typography color="text.secondary" variant="body2">
          {user?.email || ""}
        </Typography>
      </Box>
      
      {logoutError && (
        <Box sx={{ px: 2, pb: 2 }}>
          <Alert severity="error" sx={{ width: '100%' }}>
            {logoutError}
          </Alert>
        </Box>
      )}
      
      <Divider />
      <MenuList
        disablePadding
        sx={{ p: "8px", "& .MuiMenuItem-root": { borderRadius: 1 } }}
      >
        <MenuItem 
          onClick={handleSignOut}
          disabled={isLoggingOut}
        >
          <ListItemIcon>
            <SignOutIcon 
              fontSize="var(--icon-fontSize-md)"
              style={{ opacity: isLoggingOut ? 0.5 : 1 }}
            />
          </ListItemIcon>
          {isLoggingOut ? "Signing out..." : "Sign out"}
        </MenuItem>
      </MenuList>
    </Popover>
  );
}