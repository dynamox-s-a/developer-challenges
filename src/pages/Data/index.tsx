import { Tooltip } from "@mui/material";
import DynamicChart from "../../components/DynamicChart";
import {
  Container,
  Header,
  ContainerGraphic,
  ContainerButtons,
  Button,
  Divider,
} from "./styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { NavLink } from "react-router-dom";
import IconMaquina from "../../assets/maquina.svg";
import Clock from "../../assets/clock.svg";
import Gps from "../../assets/gps.svg";
import Faixa from "../../assets/faixa_dinamica.svg";
import Rpm from "../../assets/rpm.svg";

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

      <ContainerButtons>
        <Button>
          <img src={IconMaquina} alt="" /> Máquina 1023
        </Button>

        <Divider></Divider>

        <Button>
          <img src={Gps} alt="" /> Ponto 20192
        </Button>

        <Divider></Divider>

        <Button>
          <img src={Rpm} alt="" /> 200
        </Button>
        <Divider></Divider>

        <Button>
          <img src={Faixa} alt="" /> 16g
        </Button>

        <Divider></Divider>

        <Button>
          <img src={Clock} alt="" /> 20 min
        </Button>
      </ContainerButtons>

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
