import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import { Stack, IconButton, Typography, useTheme, alpha } from "@mui/material";
import SettingColorPresets from "./Options/SettingColorPresets";
import { useEffect, useState } from "react";
import Buttons from "./Buttons";
import Iconify from "../Iconify/Iconify";
import { dispatch, useSelector } from "@/app/redux/store";
import { reset } from "@/app/redux/slices/Theme";

type Anchor = "right";

export default function ThemeDrawer({ menuSuperior = true }) {
  const theme = useTheme();

  const [state, setState] = useState({
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{
        height: "100%",
        overflow: "hidden",
        width: { xs: "230px", md: "280px" },
        bgcolor: theme.palette.background.paper,
      }}
      role="tab"
    >
      <List>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ py: 2, pr: 1, pl: 2.5 }}
        >
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
            Configurations
          </Typography>
          <IconButton
            aria-label="Reset"
            onClick={() => {
              dispatch(reset());
            }}
          >
            <Iconify
              color={theme.palette.text.secondary}
              icon={"ic:round-refresh"}
              width={20}
              height={20}
            />
          </IconButton>
          <IconButton aria-label="Ver" onClick={toggleDrawer(anchor, false)}>
            <Iconify
              color={theme.palette.text.secondary}
              icon={"eva:close-fill"}
              width={20}
              height={20}
            />
          </IconButton>
        </Stack>
        <Divider />
        <Stack spacing={3} sx={{ p: 3 }}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle2">Color</Typography>
          </Stack>

          <SettingColorPresets />
        </Stack>
        <Divider />
      </List>
    </Box>
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <></>;

  return (
    <Box
      sx={{
        [theme.breakpoints.down("md")]: {
          width: "43px",
          height: "43px",
          borderRadius: "100%",
          bottom: "none",
          boxShadow: theme.shadows[1],
        },
        [theme.breakpoints.only("md")]: {
          width: "43px",
          height: "43px",
          borderRadius: "100%",
          bottom: "none",
          boxShadow: theme.shadows[1],
        },
        [theme.breakpoints.up("lg")]: {
          width: "50px",
          zIndex: 10,
          right: 0,
          position: "fixed",
          bottom: {
            xl: "calc(50% - 25px)",
            md: "calc(50% - 25px)",
            lg: "calc(50% - 25px)",
          },
          borderRadius: "100%",
          boxShadow: theme.shadows[1],
        },
      }}
    >
      {(["right"] as const).map((anchor) => (
        <div key={anchor}>
          <Box
            sx={{
              borderRadius: "50%",
              justifyContent: "flex-end",
              alignItems: "center",
              transition: "transform 1s",
            }}
          >
            <Buttons onClick={toggleDrawer(anchor, true)} anchor="right" />
          </Box>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            sx={{
              "& .MuiBackdrop-root": {
                backgroundColor: alpha(theme.palette.background.default, 0.3),
              },
            }}
          >
            {list(anchor)}
          </Drawer>
        </div>
      ))}
    </Box>
  );
}
