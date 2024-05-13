import { Tooltip } from "@mui/material";
import DynamicChart from "../../components/DynamicChart";
import { Container, Header, ContainerGraphic } from "./styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { NavLink } from "react-router-dom";

export function Data() {
  return (
    <Container>
      <Header>
        Análise de Dados
        <NavLink to="/">
          <Tooltip title="Voltar" placement="top">
            <ArrowBackIcon sx={{ fontSize: 24 }} />
          </Tooltip>
        </NavLink>
      </Header>
      <ContainerGraphic>
        <DynamicChart
          chartId="accelerationChart"
          urls={[
            "http://localhost:3000/0",
            "http://localhost:3000/1",
            "http://localhost:3000/2",
          ]}
          seriesNames={["Axial", "Horizontal", "Radial"]}
          title="Gráfico de Aceleração"
          titleAxisX="Aceleração RMS (g)"
          lineColors={["#CC337D", "#2386CB", "#B48A00"]}
        />

        <DynamicChart
          chartId="temperatureChart"
          urls={["http://localhost:3000/3"]}
          seriesNames={["Temperatura"]}
          title="Temperatura"
          titleAxisX="Temperatura (°C)"
          lineColors={["#89982E"]}
        />

        <DynamicChart
          chartId="velocityChart"
          urls={[
            "http://localhost:3000/4",
            "http://localhost:3000/5",
            "http://localhost:3000/6",
          ]}
          seriesNames={["Axial", "Horizontal", "Radial"]}
          title="Velocidade RMS"
          titleAxisX="Aceleração (g)"
          lineColors={["#CC337D", "#2386CB", "#B48A00"]}
        />
      </ContainerGraphic>
    </Container>
  );
}
