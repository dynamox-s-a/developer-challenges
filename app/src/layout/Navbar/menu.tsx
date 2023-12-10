import Logo from "@assets/logo.png";
import CloseIcon from "@mui/icons-material/Close";
import HeatPumpIcon from "@mui/icons-material/HeatPump";
import LogoutIcon from "@mui/icons-material/Logout";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store";
import { logout } from "../../redux/store/users/userSlice";
import { SetStateFunction } from "../../types";
import * as St from "./styles";

interface IMenuProps {
  setTab: SetStateFunction<string>;
  setOpen: SetStateFunction<boolean>;
  isMobile: boolean;
}

interface IMenuList {
  text: string;
  function: () => void;
  icon: ReactNode;
}

export default function Menu({ isMobile, setOpen, setTab }: IMenuProps) {
  const dispatch = useDispatch<AppDispatch>();

  const changeTab = (tab: string) => {
    setTab(tab);
    isMobile && setOpen(false);
  };

  const menuItems: IMenuList[] = [
    {
      text: "Máquinas",
      function: () => changeTab("machines"),
      icon: <HeatPumpIcon />,
    },
    {
      text: "Pontos de Monitoramento",
      function: () => changeTab("monitoring"),
      icon: <MyLocationIcon />,
    },
    {
      text: "Sair",
      function: () => dispatch(logout()),
      icon: <LogoutIcon />,
    },
  ];

  return (
    <Box role="presentation">
      <Box
        sx={{
          display: "flex",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <St.Logo src={Logo} alt="Logo" />
        {isMobile && (
          <IconButton
            sx={{ height: "fit-content" }}
            onClick={() => setOpen(false)}
            aria-label="Fechar Menu"
            size="small"
          >
            <CloseIcon
              sx={{
                color: "neutral.50",
                fontSize: "1rem",
              }}
            />
          </IconButton>
        )}
      </Box>
      <List>
        {menuItems.map((list, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={list.function}>
              <ListItemIcon
                sx={{ color: "neutral.50", minWidth: 0, marginRight: 2 }}
              >
                {list.icon}
              </ListItemIcon>
              <ListItemText primary={list.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
