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

import { paths } from "@/paths";
import { authClient } from "@/lib/auth/client";
import { logger } from "@/lib/default-logger";
import { useUser } from "@/hooks/use-user";

/**
 * Props for the UserPopover component.
 */
export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

/**
 * UserPopover component renders a popover with user details and a sign-out option.
 * @param {UserPopoverProps} props The props for the component.
 * @returns {React.JSX.Element} The rendered JSX element.
 */
export function UserPopover({
  anchorEl,
  onClose,
  open,
}: UserPopoverProps): React.JSX.Element {
  const { checkSession } = useUser();
  const router = useRouter();

  /**
   * Handles the sign-out process.
   * @returns {Promise<void>} A promise indicating the completion of the sign-out process.
   */
  const handleSignOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authClient.signOut();

      if (error) {
        logger.error("Sign out error", error);
        return;
      }

      await checkSession?.();

      router.refresh();
    } catch (err) {
      logger.error("Sign out error", err);
    }
  }, [checkSession, router]);

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: "240px", marginLeft: 2 } } }}
    >
      <Box sx={{ p: "16px 20px " }}>
        <Typography variant="subtitle1">Sofia Rivers</Typography>
        <Typography color="text.secondary" variant="body2">
          sofia.rivers@devias.io
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        sx={{ p: "8px", "& .MuiMenuItem-root": { borderRadius: 1 } }}
      >
        <MenuItem onClick={handleSignOut}>
          <ListItemIcon>
            <SignOutIcon fontSize="var(--icon-fontSize-md)" />
          </ListItemIcon>
          Sign out
        </MenuItem>
      </MenuList>
    </Popover>
  );
}
