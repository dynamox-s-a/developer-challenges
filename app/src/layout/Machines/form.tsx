import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Button } from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ErrorIcon from "@mui/icons-material/Error";
import Input from "@mui/material/Input";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import {
  IMachine,
  MachineTypes,
  NewMachine,
} from "../../redux/store/machines/types";
import * as St from "./styles";

interface IFormMachineProps {
  formHook: UseFormReturn<IMachine>;
  formSubmit: SubmitHandler<IMachine | NewMachine>;
}

export default function MachineForm({
  formHook,
  formSubmit,
}: IFormMachineProps) {
  const { formState, handleSubmit, getValues, setValue } = formHook;
  const errors = formState.errors;
  const [machineName, setMachineName] = useState<string>(() => {
    const values = getValues("name") || "";
    return values;
  });
  const [machineType, setMachineType] = useState<MachineTypes>(() => {
    const values = getValues("type") || MachineTypes.pump;
    return values;
  });

  const changeName = (inputValue: string) => {
    return inputValue.charAt(0).toUpperCase() + inputValue.substring(1);
  };

  useEffect(() => {
    setValue("name", machineName);
  }, [machineName, setValue]);

  useEffect(() => {
    setValue("type", machineType);
  }, [machineType, setValue]);

  return (
    <DialogContent id="dialog-description">
      <St.Form autoComplete="off" onSubmit={handleSubmit(formSubmit)}>
        <div>
          <FormControl variant="standard">
            <InputLabel htmlFor="name">Nome da Máquina</InputLabel>
            <Input
              required
              value={machineName}
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
        </div>
        <div>
          <FormControl variant="standard">
            <InputLabel htmlFor="name">Tipo de Máquina</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={machineType}
              onChange={(e) => setMachineType(e.target.value as MachineTypes)}
              label="Tipo de Máquina"
            >
              <MenuItem value={MachineTypes.pump}>Bomba</MenuItem>
              <MenuItem value={MachineTypes.fan}>Ventilador</MenuItem>
            </Select>
          </FormControl>
          {errors.type && (
            <St.ErrorMessage>
              <ErrorIcon color="error" fontSize="small" />
              <p>{errors.type.message as string} </p>
            </St.ErrorMessage>
          )}
        </div>
        <Button type="submit" variant="contained">
          Salvar
        </Button>
      </St.Form>
    </DialogContent>
  );
}
