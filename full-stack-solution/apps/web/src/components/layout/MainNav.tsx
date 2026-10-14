import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import { useAppDispatch, useAppSelector } from "@web/app/hooks";
import { signOut } from "@web/features/auth/auth.slice";
import { MobileNav } from "./MobileNav";

/**
 * Sticky top bar: opens the mobile navigation and holds the account menu with
 * the logout action.
 */
export function MainNav() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const [navOpen, setNavOpen] = useState(false);
  // The anchor is kept in state (not a ref) because reading `ref.current`
  // during render is not allowed.
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const initial = user?.email?.charAt(0).toUpperCase() ?? "?";

  return (
    <>
      <Box
        component="header"
        sx={{
          backgroundColor: "background.paper",
          borderBottom: "1px solid",
          borderColor: "divider",
          position: "sticky",
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            minHeight: 64,
            px: 2,
          }}
        >
          <IconButton
            aria-label="Open navigation"
            onClick={() => setNavOpen(true)}
            sx={{ display: { lg: "none" } }}
          >
            <MenuOutlinedIcon />
          </IconButton>
          <Box sx={{ flex: "1 1 auto" }} />
          <Tooltip title="Account">
            <IconButton
              aria-label="Open account menu"
              onClick={(event) => setAnchorEl(event.currentTarget)}
              sx={{ p: 0.5 }}
            >
              <Avatar sx={{ bgcolor: "primary.main" }}>{initial}</Avatar>
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { width: 240 } } }}
      >
        <Box sx={{ p: "16px 20px" }}>
          <Typography variant="subtitle1">Signed in</Typography>
          <Typography color="text.secondary" variant="body2" noWrap>
            {user?.email ?? "—"}
          </Typography>
        </Box>
        <Divider />
        <MenuList
          disablePadding
          sx={{ p: 1, "& .MuiMenuItem-root": { borderRadius: 1 } }}
        >
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              void dispatch(signOut());
            }}
          >
            <ListItemIcon>
              <LogoutOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Sign out
          </MenuItem>
        </MenuList>
      </Popover>

      <MobileNav open={navOpen} onClose={() => setNavOpen(false)} />
    </>
  );
}
