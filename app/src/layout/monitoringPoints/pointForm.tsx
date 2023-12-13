import { UseFormReturn } from "react-hook-form";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ErrorIcon from "@mui/icons-material/Error";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import {
  Sensors,
} from "../../redux/store/monitoringPoints/types";
import { IMachine, MachineTypes } from "../../redux/store/machines/types";
import * as St from "../../pages/Home/styles";
import { changeName } from "../../shared/utils";

interface IFormMachineProps {
  formHook: any;
  selectedMachine: IMachine;
  pointNumber?: number;
}

export default function PointForm({
  formHook,
  selectedMachine,
  pointNumber
}: IFormMachineProps) {
  const { formState, getValues, setValue } = formHook;
  const errors = formState.errors;
  const nameForm = pointNumber? `name${pointNumber}` : "name"
  const sensorForm = pointNumber? `sensor${pointNumber}` : "sensor"
  
  const [pointName, setMachineName] = useState<string>(() => {
    const values = getValues(nameForm) || "";
    return values;
  });
  const [sensor, setSensor] = useState<Sensors>(() => {
    const values = getValues(sensorForm) || Sensors.hf;
    return values;
  });

  
  
  useEffect(() => {
    setValue(nameForm, pointName);
  }, [pointName, setValue]);

  useEffect(() => {
    setValue(sensorForm, sensor);
  }, [sensor, setValue]);


  return (
    <St.PointForm>
      <St.Input>
        <FormControl variant="standard">
          <InputLabel htmlFor="name">Nome do Ponto</InputLabel>
          <Input
            required
            sx={{ width: "12rem" }}
            value={pointName}
            type="text"
            error={!!errors.name}
            autoComplete="off"
            onChange={(e) => {
              setMachineName(changeName(e.target.value));
            }}
            name="name"
            id="name"
          />
        </FormControl>
        {errors.name && (
          <St.ErrorMessage>
            <ErrorIcon color="error" fontSize="small" />
            <p>{errors.name.message as string} </p>
          </St.ErrorMessage>
        )}
      </St.Input>
      <St.Input>
        <FormControl variant="standard">
          <InputLabel htmlFor="name">Tipo de Sensor</InputLabel>
          <Select
            sx={{ width: "12rem" }}
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={sensor}
            onChange={(e) => setSensor(e.target.value as Sensors)}
            label="Tipo de Sensor"
            disabled={selectedMachine.type === MachineTypes.pump}
          >
            <MenuItem value={Sensors.hf}>HF+</MenuItem>
            {selectedMachine.type !== MachineTypes.pump && (
              <MenuItem value={Sensors.tcAg}>TcAg</MenuItem>
            )}
            {selectedMachine.type !== MachineTypes.pump && (
              <MenuItem value={Sensors.tcAf}>TcAs</MenuItem>
            )}
          </Select>
        </FormControl>
        {errors.sensor && (
          <St.ErrorMessage>
            <ErrorIcon color="error" fontSize="small" />
            <p>{errors.sensor.message as string} </p>
          </St.ErrorMessage>
        )}
      </St.Input>
    </St.PointForm>
  );
}
