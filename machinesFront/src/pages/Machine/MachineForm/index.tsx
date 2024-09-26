import { CustomInput } from "../../../components/Input";
import { useEffect, useState } from "react";
import { CustomButton } from "../../../components/Button/CustomButton.tsx";
import { FormContainer, SelectContainer } from "./styles.ts";
import { CustomSelect } from "../../../components/Select/Select.tsx";
import {
  createMachine,
  upDateMachine,
} from "../../../services/machineService.ts";
import { IMachine } from "../IMachine.ts";
import {getAllSensors} from "../../../services/sensorService.ts";
import {ISensor} from "../../Sensor/ISensor.ts";

type machineForm = {
  onBack: () => void;
  editMachine: IMachine | undefined;
};

export function MachineForm({ onBack, editMachine }: machineForm) {
  const [newMachine, setNewMachine] = useState<IMachine>({
    name: "",
    type: "",
    monitoringPoint: [{},{}],
  });

  const [sensors, setSensors] = useState<ISensor[]>([
    {
      _id: "",
      name: "",
      model: "",
    }
  ]);

  function setEdit() {
    setNewMachine(editMachine!);
  }

  function handleFormInput(identifier: string, value: string) {
    setNewMachine((prevState) => {
      return {
        ...prevState,
        [identifier]: value,
      };
    });
  }
  async function onSubmmit(event) {
    event.preventDefault();

    try {
      if (editMachine) {
        await upDateMachine(newMachine);
      } else {
        await createMachine(newMachine);
      }
      onBack();
    } catch (e) {
      console.error(e.message);
    }
  }

  function handleSelect(event: React.ChangeEvent<HTMLSelectElement>, index:number) {
    const selectedSensor = sensors.find(
        (sensor) => sensor._id === event.target.value
    );

    if (selectedSensor) {
      setNewMachine((prevState) => {
        const updatedMonitoringPoint = [...prevState.monitoringPoint];
        updatedMonitoringPoint[index] = selectedSensor; // Update the sensor at the specific index

        return {
          ...prevState,
          monitoringPoint: updatedMonitoringPoint,
        };
      });
    }
  }

  useEffect(() => {
    async function getSensor() {
      const { resultData } = await getAllSensors({
        sort: {
          orderBy: "name",
          order: "desc",
        },
      });
      setSensors(resultData);
    }
    getSensor();
    if (editMachine) {
      setEdit();
    }
  }, []);
  return (
    <form
      onSubmit={async (event) => {
        await onSubmmit(event);
      }}
    >
      <FormContainer>
        <CustomInput
          label="Nome"
          onChange={(event) => handleFormInput("name", event.target.value)}
          value={newMachine.name}
        />
        <CustomInput
          label="Tipo"
          onChange={(event) => handleFormInput("type", event.target.value)}
          value={newMachine.type}
        />
        <h3>Sensores</h3>
        <SelectContainer>
          {newMachine.monitoringPoint.map((select:ISensor|undefined, index) => (
            <CustomSelect
              key={index}
              options={sensors}
              onChange={(event)=>handleSelect(event, index)}
              value={select?._id || ''}
            />
          ))}
        </SelectContainer>

        <CustomButton title="Salvar" />
        <CustomButton title="Voltar" onClick={onBack} $delete />
      </FormContainer>
    </form>
  );
}
