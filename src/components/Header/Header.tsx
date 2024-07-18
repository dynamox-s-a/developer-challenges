import { AppBar, Toolbar, Typography } from "@mui/material";

const Header = () => (
  <AppBar
    position="static"
    color="transparent"
    sx={{
      boxShadow: "none",
      width: "100vw",
      borderBottom: "1px solid",
      borderColor: "divider",
    }}
  >
    <Toolbar>
      <Typography
        variant="h6"
        component="div"
        sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
      >
        Análise de Dados
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
