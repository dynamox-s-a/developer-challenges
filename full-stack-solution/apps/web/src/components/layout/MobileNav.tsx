import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import { Logo } from "./Logo";
import { NavList } from "./NavList";

export interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

/** Temporary navigation drawer used below the `lg` breakpoint. */
export function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
      PaperProps={{
        sx: {
          bgcolor: "neutral.950",
          color: "common.white",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          width: 300,
        },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Logo />
      </Stack>
      <Divider sx={{ borderColor: "neutral.700" }} />
      <NavList onNavigate={onClose} />
    </Drawer>
  );
}
