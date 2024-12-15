import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addMachine, updateMachine } from "../redux/machinesSlice";
import { TextField, Button, MenuItem } from "@mui/material";
import styled from "styled-components";

interface Machine {
  id: string;
  name: string;
  type: "Pump" | "Fan";
  monitoringPoints: any[];
}

interface MachinesFormProps {
  existingMachine?: Machine | null;
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MachinesForm: React.FC<MachinesFormProps> = ({
  existingMachine = null,
}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(existingMachine ? existingMachine.name : "");
  const [type, setType] = useState<"Pump" | "Fan">(
    existingMachine ? existingMachine.type : "Pump",
  );

  const handleSubmit = () => {
    const machine: Machine = {
      id: existingMachine ? existingMachine.id : Date.now().toString(),
      name,
      type,
      monitoringPoints: existingMachine ? existingMachine.monitoringPoints : [],
    };

    if (existingMachine) {
      dispatch(updateMachine(machine));
    } else {
      dispatch(addMachine(machine));
    }
  };

  return (
    <FormContainer>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        select
        label="Type"
        value={type}
        onChange={(e) => setType(e.target.value as "Pump" | "Fan")}
      >
        <MenuItem value="Pump">Pump</MenuItem>
        <MenuItem value="Fan">Fan</MenuItem>
      </TextField>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        {existingMachine ? "Update Machine" : "Add Machine"}
      </Button>
    </FormContainer>
  );
};

export default MachinesForm;
