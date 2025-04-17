import { Toolbar, AppBar, Typography, IconButton, Box } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import logoDynamox from "../../assets/logo-dynamox.png";

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <AppBar sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: "30px" }}>
            <img
              src={logoDynamox}
              alt="Dinamox logo"
              style={{ maxWidth: "70px", cursor: "pointer" }}
              onClick={() => {
                navigate("/");
              }}
            />
            <Typography variant="h6" noWrap component="div">
              Dynamox Monitoring System
            </Typography>
          </Box>

          {location.pathname === "/login" ? (
            ""
          ) : (
            <IconButton
              color="inherit"
              onClick={() => {
                logout();
                navigate("/login");
              }}
            >
              <LogoutIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}
