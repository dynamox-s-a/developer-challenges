import { CustomInput } from "../../../components/Input";
import { useEffect, useState } from "react";
import { CustomButton } from "../../../components/Button/CustomButton.tsx";
import { FormContainer } from "./styles.ts";
import {ISensor} from "../ISensor.ts";
import {createSensor, upDateSensor} from "../../../services/sensorService.ts";

type sensorForm = {
  onBack: () => void;
  editSensor: ISensor | undefined;
};

export function SensorForm({ onBack, editSensor }: sensorForm) {
  const [newSensor, setNewSensor] = useState<ISensor>({
    name: "",
    model: ""
  });

  function setEdit() {
    setNewSensor(editSensor!);
  }

  function handleFormInput(identifier: string, value: string) {
    setNewSensor((prevState) => {
      return {
        ...prevState,
        [identifier]: value,
      };
    });
  }
  async function onSubmmit(event) {
    event.preventDefault();

    try {
      if (editSensor) {
        await upDateSensor(newSensor);
      } else {
        await createSensor(newSensor);
      }
      onBack();
    } catch (e) {
      console.error(e.message);
    }
  }

  useEffect(() => {
    if (editSensor) {
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
          value={newSensor.name}
        />
        <CustomInput
          label="Tipo"
          onChange={(event) => handleFormInput("model", event.target.value)}
          value={newSensor.model}
        />
        <CustomButton title="Salvar" />
        <CustomButton title="Voltar" onClick={onBack} $delete />
      </FormContainer>
    </form>
  );
}
