import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const BtnShowData = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Button
        variant="contained"
        sx={{ bgcolor: "#692746" }}
        onClick={() => navigate("/data")}
      >
        Visualizar Análise de dados
      </Button>
    </Box>
  );
};

export default BtnShowData;
