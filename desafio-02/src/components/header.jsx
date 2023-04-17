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
import "./header.css";
import { fetchProducts } from "../redux/products/productsActions";

export const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleFetchProducts = () => {
    dispatch(fetchProducts());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <AppBar position="static" className="appBar">
      <Toolbar>
        <Box className="titleContainer">
          <Typography variant="h6" component="div" className="title">
            <Link to="/user" onClick={() => handleFetchProducts()} component={MuiLink} className="link">
              Lista
            </Link>
          </Typography>
          <Typography variant="h6" component="div" className="title">
            <Link to="/user/addProduct" component={MuiLink} className="link">
              Adicionar produto
            </Link>
          </Typography>
        </Box>
        <Box className="button-container">
          <Button color="inherit" onClick={handleLogout} className="button">
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
