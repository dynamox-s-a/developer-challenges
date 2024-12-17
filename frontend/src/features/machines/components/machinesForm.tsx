import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { addMachine, updateMachine } from "../redux/machinesSlice";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Card,
  CardHeader,
  Divider,
} from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Sensor {
  id: string;
  model: "TcAg" | "TcAs" | "HF+";
}

interface MonitoringPoint {
  id: string;
  name: string;
  sensor: Sensor | null;
}

interface Machine {
  id: string;
  name: string;
  type: "Pump" | "Fan";
  monitoringPoints: MonitoringPoint[];
}

// Validation schema
const machineSchema = z.object({
  name: z.string().min(1, "Machine name is required"),
  type: z.enum(["Pump", "Fan"], { required_error: "Type is required" }),
});

type MachineFormValues = z.infer<typeof machineSchema>;

interface MachinesFormProps {
  existingMachine?: {
    id: string;
    name: string;
    type: "Pump" | "Fan";
    monitoringPoints: MonitoringPoint[];
  } | null;
}

const MachinesForm: React.FC<MachinesFormProps> = ({
  existingMachine = null,
}) => {
  const dispatch = useDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<MachineFormValues>({
    defaultValues: {
      name: existingMachine?.name || "",
      type: existingMachine?.type || "Pump",
    },
    resolver: zodResolver(machineSchema),
  });

  const onSubmit = (data: MachineFormValues) => {
    const machine: Machine = {
      id: existingMachine ? existingMachine.id : Date.now().toString(),
      name: data.name,
      type: data.type,
      monitoringPoints: existingMachine?.monitoringPoints || [],
    };

    if (existingMachine) {
      dispatch(updateMachine(machine));
    } else {
      dispatch(addMachine(machine));
    }
  };

  return (
    <Card variant="outlined" sx={{ flex: 1 }}>
      <CardHeader
        title={existingMachine ? "Edit Machine" : "Add New Machine"}
        sx={{
          "& .MuiCardHeader-title": { fontWeight: 600, fontSize: "1.5rem" },
        }}
      />
      <Divider />
      <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ p: 3 }}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Machine Name"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              margin="normal"
            />
          )}
        />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Machine Type"
              select
              fullWidth
              error={!!errors.type}
              helperText={errors.type?.message}
              margin="normal"
            >
              <MenuItem value="Pump">Pump</MenuItem>
              <MenuItem value="Fan">Fan</MenuItem>
            </TextField>
          )}
        />
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ width: "100%", mt: "1rem" }}
        >
          {existingMachine ? "Update Machine" : "Add Machine"}
        </Button>
      </Box>
    </Card>
  );
};

export default MachinesForm;
