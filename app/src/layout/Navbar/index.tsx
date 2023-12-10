import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import { SetStateFunction } from "../../types";
import Menu from "./menu";
import * as St from "./styles";

interface INavProps {
  setTab: SetStateFunction<string>;
  setOpen: SetStateFunction<boolean>;
  open: boolean;
  isMobile: boolean;
}

export default function Navbar({ isMobile, open, setOpen, setTab }: INavProps) {
  return (
    <>
      {isMobile ? (
        <SwipeableDrawer
          anchor="left"
          open={open}
          onClose={() => setOpen(false)}
          onOpen={() => setOpen(true)}
        >
          <Menu isMobile={isMobile} setTab={setTab} setOpen={setOpen} />
        </SwipeableDrawer>
      ) : (
        <St.MenuDesktop>
          <Menu isMobile={isMobile} setTab={setTab} setOpen={setOpen} />
        </St.MenuDesktop>
      )}
    </>
  );
}
