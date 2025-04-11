import { Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../store";
import { logout } from "../features/auth/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <Button variant="outlined" color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
      Sair
    </Button>
  );
};

export default LogoutButton;
