import React, { useState, useEffect } from "react";
import { Button, Grid, MenuItem, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setMachines } from "../../store/actions/machineActions";
import { Machine } from "../types/types";
import { RootState } from "../../store/store";

const MachineList = () => {
  const dispatch = useDispatch();

  const machines = useSelector((state: RootState) => state.machines);

  const [expandedMachine, setExpandedMachine] = useState<number | null>(null);
  const [newMonitoringPoint, setNewMonitoringPoint] = useState({
    name: "",
    sensorModel: "",
  });

  const [isEditing, setIsEditing] = useState<number | null>(null);

  const handleEditTitle = (index: number) => {
    setIsEditing(index);
  };

  const handleEditType = (index: number) => {
    setIsEditing(-index);
  };

  const handleTitleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number
  ) => {
    const updatedMachines = [...machines];
    updatedMachines[index].title = event.target.value;
    dispatch(setMachines(updatedMachines));
  };

  const handleTypeChange = (
    event: React.ChangeEvent<{ value: unknown }>,
    index: number
  ) => {
    const updatedMachines = [...machines];
    updatedMachines[index].type = event.target.value as string;
    dispatch(setMachines(updatedMachines));
  };

  const handleAddMonitoringPoint = (machineIndex: number) => {
    setExpandedMachine(machineIndex);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewMonitoringPoint({
      ...newMonitoringPoint,
      name: event.target.value,
    });
  };

  const handleSensorModelChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setNewMonitoringPoint({
      ...newMonitoringPoint,
      sensorModel: event.target.value as string,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("New Monitoring Point:", newMonitoringPoint);
    // Reset form
    setNewMonitoringPoint({ name: "", sensorModel: "" });
    setExpandedMachine(null);
  };

  return (
    <Grid container>
      {machines.map((machine: Machine, index: number) => (
        <Grid item xs={12} key={index} className="px-8">
          <div className="flex justify-evenly items-center bg-gray-200 px-8 border rounded border-gray-900 -mt-2">
            <div className="flex justify-center items-center flex-col w-full">
              <label className="text-xs underline">Name</label>
              {isEditing === index ? (
                <TextField
                  value={machine.title}
                  onChange={(event) => handleTitleChange(event, index)}
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                />
              ) : (
                <h2
                  className="text-xl hover:underline cursor-pointer"
                  onClick={() => handleEditTitle(index)}
                >
                  {machine.title}
                </h2>
              )}
            </div>
            <div className="flex justify-center items-center flex-col w-full">
              <label className="text-xs underline">Type</label>
              {isEditing === -index ? (
                <TextField
                  select
                  value={machine.type}
                  onChange={(event) => handleTypeChange(event, index)}
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                >
                  <MenuItem value="Pump">Pump</MenuItem>
                  <MenuItem value="Fan">Fan</MenuItem>
                </TextField>
              ) : (
                <h2
                  className="text-xl hover:underline cursor-pointer"
                  onClick={() => handleEditType(index)}
                >
                  {machine.type}
                </h2>
              )}
            </div>

            <div className="flex justify-between items-center flex-col w-full">
              <label className="text-xs underline">Monitoring Points</label>
              <h2 className="text-xl">0</h2>
            </div>
            <div className="py-4">
              <Button
                variant="outlined"
                onClick={() => handleAddMonitoringPoint(index)}
              >
                Add Monitoring Point
              </Button>
            </div>
          </div>
          {expandedMachine === index ? (
            <form className="mt-2 mb-4" onSubmit={handleSubmit}>
              <Button
                variant="outlined"
                onClick={() => setExpandedMachine(null)}
              >
                Close
              </Button>

              <TextField
                label="Name"
                value={newMonitoringPoint.name}
                onChange={handleNameChange}
                variant="outlined"
                margin="dense"
                required
                fullWidth
              />
              {machine.type === "Pump" ? (
                <TextField
                  label="Sensor Model"
                  value={"HF+"}
                  onChange={handleSensorModelChange}
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                  disabled
                />
              ) : (
                <TextField
                  label="Sensor Model"
                  select
                  value={newMonitoringPoint.sensorModel}
                  onChange={handleSensorModelChange}
                  variant="outlined"
                  margin="dense"
                  required
                  fullWidth
                >
                  <MenuItem value="TcAg">TcAg</MenuItem>
                  <MenuItem value="TcAs">TcAs</MenuItem>
                  <MenuItem value="HF+">HF+</MenuItem>
                </TextField>
              )}
              <Button type="submit" variant="contained" className="bg-blue-500">
                Submit
              </Button>
            </form>
          ) : null}
        </Grid>
      ))}
    </Grid>
  );
};

export default MachineList;
