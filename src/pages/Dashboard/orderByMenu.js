import * as React from "react";
import { Button, Menu, MenuItem } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function OrderByMenu({ sort, setSort }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="button"
        aria-controls={open ? "menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        disableElevation
        onClick={handleClick}
        sx={{ ":hover": { bgcolor: "transparent"} }}
        endIcon={<KeyboardArrowDownIcon />}
      >
        Ordenar por
      </Button>
      <Menu id="menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem onClick={() => setSort("name")} disableRipple>
          Nome
        </MenuItem>
        <MenuItem onClick={() => setSort("fabricationDate")} disableRipple>
          Data de Fabricação
        </MenuItem>
        <MenuItem onClick={() => setSort("price")} disableRipple>
          Preço
        </MenuItem>
      </Menu>
    </div>
  );
}
