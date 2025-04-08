import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { fetchSensors } from "../store/sensors/sensorThunks";
import SensorForm from "../components/SensorForm";
import SensorList from "../components/SensorList";
import { Typography, Container, Box, Divider } from "@mui/material";

const SensorPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { status, error } = useSelector((state: RootState) => state.sensors);

  useEffect(() => {
    dispatch(fetchSensors());
  }, [dispatch]);

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h4" gutterBottom>
          Cadastro de Sensores
        </Typography>

        <SensorForm />

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>
          Sensores Cadastrados
        </Typography>

        {status === "loading" && <p>Carregando sensores...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <SensorList />
      </Box>
    </Container>
  );
};

export default SensorPage;
