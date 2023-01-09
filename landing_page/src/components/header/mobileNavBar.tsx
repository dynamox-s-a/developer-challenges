import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import { IconButton, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { pages } from "./helper";

export default function MobileNavBar(): JSX.Element {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="fade-button"
        aria-controls={open ? "fade-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          style={{ color: "#F4F7FC" }}
        >
          <MenuIcon />
        </IconButton>
      </Button>

      <Menu
        id="fade-menu"
        MenuListProps={{
          "aria-labelledby": "fade-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        {pages.map((page) => (
          <MenuItem key={page.name} onClick={handleClose}>
            <Typography
              component="a"
              href={page.path}
              title={page.title}
              className="mobileMenuItem"
            >
              {page.name}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
