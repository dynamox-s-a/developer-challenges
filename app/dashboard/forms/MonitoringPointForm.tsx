"use client";
import {
  createMonitoringPoint,
  selectMachines,
  selectMonitoringPoints,
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
import { LoadingButton } from "@mui/lab";

const sensorModelsId = {
  tcag: 1,
  tcas: 2,
  hf: 3,
};

export default function MonitoringPointForm() {
  const { data: machines } = useSelector(selectMachines);
  const { status } = useSelector(selectMonitoringPoints);
  const [sensorId, setSensorId] = useState<number | "">("");
  const [machineId, setMachineId] = useState<number | "">("");
  const [sensorError, setSensorError] = useState(false);
  const [machineError, setMachineError] = useState(false);
  const dispatch = useDispatch();

  const handleSensorIdChange = (event: SelectChangeEvent<number>) => {
    formik.setFieldValue("sensorId", event.target.value);
    setSensorId(Number(event.target.value));
    setSensorError(false);
  };

  const handleMachineIdChange = (event: SelectChangeEvent<number>) => {
    formik.setFieldValue("machineId", event.target.value);
    setMachineId(Number(event.target.value));
    setMachineError(false);
  };

  //TODO: Implement validation of the Select field through formik and Yup instead of the way it was done (with useState)

  const handleFormValidation = () => {
    if (!machineId) setMachineError(true);
    else setMachineError(false);
    if (!sensorId) setSensorError(true);
    else setSensorError(false);
  };

  const formik = useFormik({
    initialValues: {
      name: "",
      machineId: "",
      sensorId: "",
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().min(1).required("Name is required"),
      machineId: Yup.number().required("Machine is required"),
      sensorId: Yup.number().required("Sensor is required"),
    }),
    onSubmit: async (values) => {
      dispatch(
        createMonitoringPoint({
          name: values.name,
          machineId: Number(values.machineId),
          sensorId: Number(values.sensorId),
        })
      );
    },
  });

  return (
    <Stack sx={{ bgcolor: "white", maxWidth: "400px", width: "100%" }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Add Monitoring Point
      </Typography>
      <form noValidate onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <TextField
            error={!!(formik.touched.name && formik.errors.name)}
            fullWidth
            helperText={formik.touched.name && formik.errors.name}
            label="Name"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          <Box className={machineError ? styles.validationError : ""}>
            <FormControl fullWidth>
              <InputLabel id="mp-machine-label">Machine</InputLabel>
              <Select
                labelId="mp-machine-label"
                id="mp-machine-id"
                value={machineId}
                label="Machine"
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
          <Box className={sensorError ? styles.validationError : ""}>
            <FormControl fullWidth>
              <InputLabel id="mp-sensor-label">Sensor</InputLabel>
              <Select
                labelId="mp-sensor-label"
                id="mp-sensor-id"
                value={sensorId}
                label="Sensor"
                name="sensorId"
                onChange={handleSensorIdChange}
              >
                <MenuItem value={sensorModelsId.tcag}>TcAg</MenuItem>
                <MenuItem value={sensorModelsId.tcas}>TcAs</MenuItem>
                <MenuItem value={sensorModelsId.hf}>HF+</MenuItem>
              </Select>
            </FormControl>
            {sensorError && (
              <Typography color="error" sx={{ fontSize: "12px", ml: "14px", mt: "3px" }}>
                Sensor is required
              </Typography>
            )}
          </Box>
        </Stack>
        <LoadingButton
          size="large"
          sx={{ mt: 3 }}
          type="submit"
          variant="contained"
          onClick={handleFormValidation}
          loading={status === "loading"}
        >
          Add
        </LoadingButton>
      </form>
    </Stack>
  );
}
