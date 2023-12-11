import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import FileCopyIcon from "@mui/icons-material/FileCopyOutlined";
import SaveIcon from "@mui/icons-material/Save";
import PrintIcon from "@mui/icons-material/Print";
import ShareIcon from "@mui/icons-material/Share";
import { IUserState } from "../../redux/store/users/types";
import { RootState } from "../../redux/store";
import MonitoringPoints from "../../layout/monitoringPoints";
import Machines from "../../layout/Machines";
import NavBar from "../../layout/Navbar";
import Header from "../../layout/Header";
import * as St from "./styles";

export default function Home() {
  const [tab, setTab] = useState<string>("machines");
  const isMobile = window.screen.width < 1024;
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(!isMobile);
  const navigate = useNavigate();
  const user: IUserState = useSelector((state: RootState) => state.user);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    !user.isLogged && navigate("/");
  }, [navigate, user]);

  const actions = [
    { icon: <FileCopyIcon />, name: "Copy" },
    { icon: <SaveIcon />, name: "Save" },
    { icon: <PrintIcon />, name: "Print" },
    { icon: <ShareIcon />, name: "Share" },
  ];

  return (
    <St.Container>
      {isMobile && <Header openNavbar={setIsMenuOpen} />}
      {isMenuOpen && (
        <NavBar
          isMobile={isMobile}
          setTab={setTab}
          open={isMenuOpen}
          setOpen={setIsMenuOpen}
        />
      )}
      {tab === "machines" ? (
        <Machines isMobile={isMobile} />
      ) : (
        <MonitoringPoints />
      )}

      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{
          position: "absolute",
          bottom: 16,
          right: 16,
        }}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
    </St.Container>
  );
}
