import React, { useEffect } from "react";
import { Drawer, Toolbar, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Link } from "@mui/material";
import { FormatListBulleted, Home, Inbox, Mail } from "@mui/icons-material";
import { useSelector } from "react-redux";
import Router from 'next/router'

const drawerWidth = 240;

export default function Sidebar() {

    const user = useSelector((state: any) => state.user.value)

    useEffect(() => {
      if(user.userId === "") {
        Router.push("/auth/login");
      }
    }, []);
    const sidebarItems = [
        {
            label: "Máquinas",
            icon: <Home color="primary" />,
            action: () => {
              Router.push("/profile/dashboard");
          }
        },
        {
            label: "Pontos de monitoramento",
            icon: <FormatListBulleted color="primary" />,
            action: () => {
              Router.push("/profile/monitoringPointsList");
          }
        }
    ]

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
            }}
        >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {sidebarItems.map(({ label, icon, action }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton
                  onClick={action}
                >
                  <ListItemIcon>
                    { icon }
                  </ListItemIcon>
                  <ListItemText>
                    <Link underline="none">
                        { label }
                    </Link>
                  </ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    )
};