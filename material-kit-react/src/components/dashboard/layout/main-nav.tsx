"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import { MobileNav } from "./mobile-nav";
import { IconButton, Typography } from "@mui/material";
import { List } from "@phosphor-icons/react";

interface MainNavProps {
  title?: string;
}

/**
 * Main navigation bar component.
 * @returns {React.JSX.Element} The rendered MainNav component.
 */
export function MainNav({ title }: MainNavProps): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);

  const toggleNav = () => {
    setOpenNav(!openNav);
  };

  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: "1px solid var(--mui-palette-divider)",
          backgroundColor: "var(--mui-palette-background-paper)",
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "end",
            minHeight: "64px",
            px: 2,
          }}
        >
          <IconButton onClick={toggleNav}>
            <List />
          </IconButton>

          <MobileNav onClose={() => setOpenNav(false)} open={openNav} />

          {title && (
            <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
          )}
        </Stack>
      </Box>
    </React.Fragment>
  );
}
