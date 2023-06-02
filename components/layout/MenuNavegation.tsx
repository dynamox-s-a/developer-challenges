import * as React from "react";
import { useRouter } from "next/router";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import ListItemIcon from "@mui/material/ListItemIcon";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SensorsIcon from "@mui/icons-material/Sensors";
import TroubleshootIcon from "@mui/icons-material/Troubleshoot";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";

export default function MenuNavegation() {
  const router = useRouter();
  return (
    <React.Fragment>
      <ListItemButton
        onClick={() => {
          router.push("/");
        }}
      >
        <ListItemIcon>
          <ViewColumnIcon />
        </ListItemIcon>
        <ListItemText primary="Pontos de Monitoramento" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          router.push("/create-monitoring-point");
        }}
      >
        <ListItemIcon>
          <TroubleshootIcon />
        </ListItemIcon>
        <ListItemText primary="Criar Ponto de Monitoramento" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          router.push("/create-machine");
        }}
      >
        <ListItemIcon>
          <SettingsApplicationsIcon />
        </ListItemIcon>
        <ListItemText primary="Criar Máquina" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          router.push("/create-sensor");
        }}
      >
        <ListItemIcon>
          <SensorsIcon />
        </ListItemIcon>
        <ListItemText primary="Criar Sensor" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          router.push("/create-user");
        }}
      >
        <ListItemIcon>
          <PersonAddIcon />
        </ListItemIcon>
        <ListItemText primary="Criar Usuário" />
      </ListItemButton>
    </React.Fragment>
  );
}
