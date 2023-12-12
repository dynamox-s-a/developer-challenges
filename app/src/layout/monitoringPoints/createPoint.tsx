import { SubmitHandler, UseFormReturn } from "react-hook-form";
import { Button } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ErrorIcon from "@mui/icons-material/Error";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import {
  IListPoint,
  NewPoint,
} from "../../redux/store/monitoringPoints/types";
import { IMachine } from "../../redux/store/machines/types";
import * as St from "../../pages/Home/styles";
import PointForm from "./pointForm";

interface IFormMachineProps {
  formHook: UseFormReturn<IListPoint>;
  formSubmit: SubmitHandler<IListPoint | NewPoint>;
  machines: IMachine[]
}

export default function EditPointForm({
  formHook,
  formSubmit,
  machines
}: IFormMachineProps) {
  const { formState, handleSubmit, setValue } = formHook;
  const errors = formState.errors;
  const [selectedMachine, setSelectedMachine] = useState<IMachine>(machines[0]);
  
  useEffect(() => {
    setValue("machineId", selectedMachine.id);
  }, [selectedMachine, setValue]);

  console.log({selectedMachine})

  return (
    <St.Form autoComplete="off" onSubmit={handleSubmit(formSubmit)}>
      <St.Input>
        <FormControl variant="standard">
          <InputLabel htmlFor="machine">Máquina</InputLabel>
          <Select
            required
            sx={{ width: "12rem" }}
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={selectedMachine}
            onChange={(e) => setSelectedMachine(e.target.value as IMachine)}
            label="machine"
          >
            {
              machines.map((mach, index)=> {
                return <MenuItem key={index} value={mach as any}>{mach.name}</MenuItem>
              })
            }
          </Select>
        </FormControl>
        {errors.sensor && (
          <St.ErrorMessage>
            <ErrorIcon color="error" fontSize="small" />
            <p>{errors.sensor.message as string} </p>
          </St.ErrorMessage>
        )}
      </St.Input>
      <St.FormPoints>
        <article>
          <St.PointTitle>Ponto 1</St.PointTitle>
          <PointForm formHook={formHook} selectedMachine={selectedMachine}/>
        </article>
        <article>
          <St.PointTitle>Ponto 2</St.PointTitle>
          <PointForm formHook={formHook} selectedMachine={selectedMachine}/>
        </article>
      </St.FormPoints>
      <Button type="submit">Salvar</Button>
    </St.Form>
  );
}
