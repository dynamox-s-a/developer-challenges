"use client";
import { deleteMachine, selectMachines, useDispatch, useSelector } from "@/lib/redux";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import styles from "./styles.module.css";

export default function DeleteMachineForm() {
  const [machineId, setMachineId] = useState<number | "">("");
  const [machineError, setMachineError] = useState(false);
  const dispatch = useDispatch();
  const { status, data: machines } = useSelector(selectMachines);

  const handleMachineIdChange = (event: SelectChangeEvent<number>) => {
    const newId = Number(event.target.value);
    formik.setFieldValue("machineId", newId);
    setMachineId(Number(newId));
    setMachineError(false);
    const [machine] = machines.filter((machine) => machine.id === newId);
  };

  //TODO: Implement validation of the Select field through formik and Yup instead of the way it was done (with useState)

  const handleFormValidation = () => {
    if (!machineId) setMachineError(true);
    else setMachineError(false);
  };

  const formik = useFormik({
    initialValues: {
      machineId: "",
    },
    validationSchema: Yup.object({
      machineId: Yup.number().required("Machine is required"),
    }),
    onSubmit: async (values) => {
      dispatch(
        deleteMachine({
          id: Number(machineId),
        })
      );
    },
  });

  return (
    <Stack sx={{ bgcolor: "white", maxWidth: "400px", width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Delete Machine
      </Typography>
      <form noValidate onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <Box className={machineError ? styles.validationError : ""}>
            <FormControl fullWidth>
              <InputLabel id="del-machine-label">Select the machine to delete</InputLabel>
              <Select
                labelId="del-machine-label"
                id="del-machine-id"
                value={machineId}
                label="Select the machine to delete"
                name="machineId"
                onChange={handleMachineIdChange}
              >
                {machines.map((machine) => (
                  <MenuItem key={machine.id} value={machine.id}>
                    {machine.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {machineError && (
              <Typography color="error" sx={{ fontSize: "12px", ml: "14px", mt: "3px" }}>
                Machine is required
              </Typography>
            )}
          </Box>
        </Stack>
        <Button
          size="large"
          sx={{ mt: 3 }}
          type="submit"
          variant="contained"
          onClick={handleFormValidation}
        >
          Delete
        </Button>
      </form>
    </Stack>
  );
}
