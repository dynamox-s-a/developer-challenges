"use client";
import {
  createMachine,
  selectMachines,
  updateMachine,
  useDispatch,
  useSelector,
} from "@/lib/redux";
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

export default function UpdateMachineForm() {
  const [type, setType] = useState("");
  const [typeError, setTypeError] = useState(false);
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
    formik.setFieldValue("type", machine.type);
    setType(machine.type);
  };

  const handleTypeChange = (event: SelectChangeEvent<string>) => {
    formik.setFieldValue("type", event.target.value);
    setType(event.target.value);
    setTypeError(false);
  };

  //TODO: Implement validation of the Select field through formik and Yup instead of the way it was done (with useState)

  const handleFormValidation = () => {
    if (!machineId) setMachineError(true);
    else setMachineError(false);
    if (!type) setTypeError(true);
    else setTypeError(false);
  };

  const formik = useFormik({
    initialValues: {
      machineId: "",
      name: "",
      type: "",
    },
    validationSchema: Yup.object({
      machineId: Yup.number().required("Machine is required"),
      name: Yup.string().min(1).required("New name is required"),
      type: Yup.string().min(1).required("Type is required"),
    }),
    onSubmit: async (values) => {
      dispatch(
        updateMachine({
          id: Number(machineId),
          name: values.name,
          type: values.type,
        })
      );
    },
  });

  return (
    <Stack sx={{ bgcolor: "white", maxWidth: "400px", width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Edit Machine
      </Typography>
      <form noValidate onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <Box className={machineError ? styles.validationError : ""}>
            <FormControl fullWidth>
              <InputLabel id="machine-label">Select the machine to edit</InputLabel>
              <Select
                labelId="machine-label"
                id="machine-id"
                value={machineId}
                label="Select the machine to edit"
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
          <TextField
            error={!!(formik.touched.name && formik.errors.name)}
            fullWidth
            helperText={formik.touched.name && formik.errors.name}
            label="New name"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          <Box className={typeError ? styles.validationError : ""}>
            <FormControl fullWidth>
              <InputLabel id="machine-type-label">Type</InputLabel>
              <Select
                labelId="machine-type-label"
                id="machine-type-id"
                value={type}
                label="Type"
                name="type"
                onChange={handleTypeChange}
              >
                <MenuItem value={"fan"}>Fan</MenuItem>
                <MenuItem value={"pump"}>Pump</MenuItem>
              </Select>
            </FormControl>
            {typeError && (
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
          Edit
        </Button>
      </form>
    </Stack>
  );
}
