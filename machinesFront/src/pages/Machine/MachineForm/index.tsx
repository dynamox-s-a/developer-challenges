import { CustomInput } from "../../../components/Input";
import { useEffect, useState } from "react";
import { CustomButton } from "../../../components/Button/CustomButton.tsx";
import { FormContainer, SelectContainer } from "./styles.ts";
import { CustomSelect } from "../../../components/Select/Select.tsx";
import {
  createMachine,
  getAllSensors,
  upDateMachine,
} from "../../../services/machineService.ts";
import { IMachine } from "../IMachine.ts";

export type ISensor = {
  _id: string;
  name: string;
  model: string;
};

type machineForm = {
  onBack: () => void;
  editMachine: IMachine;
};

export function MachineForm({ onBack, editMachine }: machineForm) {
  const [newMachine, setNewMachine] = useState<IMachine>({
    name: "",
    type: "",
    monitoringPoint: [{}, {}],
  });

  const [sensors, setSensors] = useState<ISensor[]>([
    {
      _id: "",
      name: "",
      model: "",
    },
  ]);

  const [selectedValue, setSelectedValue] = useState<ISensor>();

  function setEdit() {
    setNewMachine(editMachine);
  }

  function handleFormInput(identifier: string, value: string) {
    setNewMachine((prevState) => {
      return {
        ...prevState,
        [identifier]: value,
        monitoringPoint: sensors,
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

  function handleAddSensor() {
    if (newMachine.monitoringPoint.length <= 2) {
    }
    setNewMachine((prevState) => {
      return {
        ...prevState,
        monitoringPoint: [...prevState, selectedValue],
      };
    });
  }

  function handleSelect(event: React.ChangeEvent<HTMLSelectElement>) {
    console.log(sensors.find((sensor) => sensor._id === event.target.value));
    setSelectedValue(
      sensors.find((sensor) => sensor._id === event.target.value),
    );
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

  useEffect(() => {
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
          {newMachine.monitoringPoint.map((select, index) => (
            <CustomSelect
              key={index}
              options={sensors}
              onChange={handleSelect}
              value={select._id}
            />
          ))}
        </SelectContainer>

        <CustomButton title="Salvar" />
        <CustomButton title="Voltar" onClick={onBack} $delete />
      </FormContainer>
    </form>
  );
}
