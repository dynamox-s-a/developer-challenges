import DynamicChart from "../../components/DynamicChart";
import { Container, Header, ContainerGraphic } from "./styles";

export function Data() {
  return (
    <Container>
      <Header>Análise de Dados</Header>
      <ContainerGraphic>
        <DynamicChart
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
          urls={["http://localhost:3000/3"]}
          seriesNames={["Tempetura"]}
          title="Temperatura"
          titleAxisX="Temperatura (°C)"
          lineColors={["#89982E"]}
        />

        <DynamicChart
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
