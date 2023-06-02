import { ReactElement } from "react";

import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";

import Drawer from "./Drawer";
import MenuNavegation from "./MenuNavegation";
import { useAppDispatch, useAppSelector } from "redux/hooks";
import { toggle } from "redux/reducers/navStateReducer";

export default function Navigation(): ReactElement {
  const open = useAppSelector((state) => state.navStateReducer.value);
  const dispatch = useAppDispatch();

  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={() => dispatch(toggle())}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">{MenuNavegation()}</List>
    </Drawer>
  );
}
