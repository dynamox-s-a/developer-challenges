import * as React from "react";
import { Drawer, Toolbar, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText,Divider, Link } from "@mui/material";
import { FormatListBulleted, Home, Inbox, Mail } from "@mui/icons-material";

const drawerWidth = 240;

export default function Sidebar() {

    const sidebarItems = [
        {
            label: "Máquinas",
            icon: <Home color="primary" />,
            href: "/profile/dashboard"
        },
        {
            label: "Pontos de monitoramento",
            icon: <FormatListBulleted color="primary" />,
            href: "/profile/monitoringPointsList"
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
            {sidebarItems.map(({ label, icon, href }) => (
              <ListItem key={label} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    { icon }
                  </ListItemIcon>
                  <ListItemText>
                    <Link href={ href } underline="none">
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