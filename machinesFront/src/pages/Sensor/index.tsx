import { ListItem } from "../../components/ListItem";
import { useEffect, useState } from "react";
import { Container, ListContainer, ListHeaderContainer } from "./styles.ts";
import { CustomButton } from "../../components/Button/CustomButton.tsx";
import {ISensor} from "./ISensor.ts";
import {SensorForm} from "./SensorForm";
import {deleteSensor, getAllSensors} from "../../services/sensorService.ts";

export function Sensor() {
  const [sensors, setSensors] = useState<ISensor[]>([]);

  const [novo, setNovo] = useState(false);
  const [editSensor, setEditSensor] = useState<ISensor>();
  async function handleDelete(id: string) {
    try {
      await deleteSensor(id).then(() => getSensor());
    } catch (e) {
      console.error("Erro ao deletar maquina");
    }
  }

  function handleNew() {
    setEditSensor(undefined);
    setNovo((prevState) => !prevState);
  }

  async function getSensor() {
    const { resultData } = await getAllSensors({
      sort: {
        orderBy: "name",
        order: "desc",
      },
    });
    setSensors(resultData);
  }

  async function handleEdit(sensor: ISensor) {
    setEditSensor((_prevState) => sensor);
    setNovo(true);
  }

  useEffect(() => {
    getSensor();
  }, [novo]);

  return (
    <Container>
      {novo ? (
        <SensorForm onBack={handleNew} editSensor={editSensor} />
      ) : (
        <ListContainer>
          <CustomButton title="+ Nova" onClick={handleNew} />
          <h2>Sensores</h2>
          <ListHeaderContainer>
            <p>Nome</p>
            <p>Modelo</p>
            <p></p>
            <p></p>
          </ListHeaderContainer>
          {sensors.map((item: ISensor, index) => (
            <ListItem
              key={index}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </ListContainer>
      )}
    </Container>
  );
}
