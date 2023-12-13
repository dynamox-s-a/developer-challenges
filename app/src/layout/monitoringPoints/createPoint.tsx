import ErrorIcon from "@mui/icons-material/Error";
import { Button } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import { SubmitHandler, UseFormReturn } from "react-hook-form";
import * as St from "../../pages/Home/styles";
import { IMachine } from "../../redux/store/machines/types";
import { ICreateFormPoint } from "../../redux/store/monitoringPoints/types";
import PointForm from "./pointForm";

interface IFormMachineProps {
  formHook: UseFormReturn<ICreateFormPoint>;
  formSubmit: SubmitHandler<ICreateFormPoint>;
  machines: IMachine[];
}

export default function EditPointForm({
  formHook,
  formSubmit,
  machines,
}: IFormMachineProps) {
  const { formState, handleSubmit, setValue } = formHook;
  const errors = formState.errors;
  const [selectedMachine, setSelectedMachine] = useState<IMachine>(machines[0]);

  useEffect(() => {
    setValue("machineId", selectedMachine.id);
  }, [selectedMachine, setValue]);

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
            {machines.map((mach, index) => {
              return (
                <MenuItem key={index} value={mach as any}>
                  {mach.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        {errors.machineId && (
          <St.ErrorMessage>
            <ErrorIcon color="error" fontSize="small" />
            <p>{errors.machineId.message as string} </p>
          </St.ErrorMessage>
        )}
      </St.Input>
      <St.FormPoints>
        <article>
          <St.PointTitle>Ponto 1</St.PointTitle>
          <PointForm
            formHook={formHook}
            selectedMachine={selectedMachine}
            pointNumber={1}
          />
        </article>
        <article>
          <St.PointTitle>Ponto 2</St.PointTitle>
          <PointForm
            formHook={formHook}
            selectedMachine={selectedMachine}
            pointNumber={2}
          />
        </article>
      </St.FormPoints>
      <Button type="submit">Salvar</Button>
    </St.Form>
  );
}
