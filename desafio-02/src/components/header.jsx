import React from "react";
import {
  Box,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/auth/authSlice";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box>
          <Typography variant="h6" component="div">
            <Link to="/user" component={MuiLink}>
              Lista
            </Link>
          </Typography>
          <Typography>
            <Link to="/user/addProduct" component={MuiLink} color="inherit">
              Adicionar produto
            </Link>
          </Typography>
        </Box>
        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};
