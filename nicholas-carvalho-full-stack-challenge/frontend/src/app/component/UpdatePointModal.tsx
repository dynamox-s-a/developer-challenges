"use client";

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import { UpdateModalProps } from "../types/modal";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { MachineService } from "../api/machine";
import { setMachines } from "../redux/slices/machineSlice";
import { SensorService } from "../api/sensor";
import { setSensor } from "../redux/slices/sensorSlice";
import { translateSensorModelName } from "../api/translate";
import { UpdateSensorForm } from "../types/sensor";
import { MachineState } from "../types/machine";

export default function UpdatePointModal({ open, onClose, onSucess, data }: UpdateModalProps) {
    const [form, setForm] = useState<UpdateSensorForm>({
        monitoringPointId: data.monitoringPointId,
        name: data.name,
        machineId: data.machineId,
        sensor: data.sensor
    });

    const { items, isLoading } = useAppSelector(state => state.machine);
    const { sensorItems, sensorIsLoading } = useAppSelector(state => state.sensor);
    const dispatch = useAppDispatch();

    const sensorService = new SensorService();
    const machineService = new MachineService();

    async function fetchData() {
        const machines = await machineService.getManyMachines();
        const sensors = await sensorService.getAllSensors();
        dispatch(setMachines({ items: machines, isLoading: false }));
        dispatch(setSensor({ items: sensors, sensorIsLoading: false, selectedSensorId: "" }));

    }

    useEffect(() => {
        if (open) {
            setForm({ monitoringPointId: data.monitoringPointId, name: data.name, machineId: data.machineId, sensor: data.sensor });
            fetchData();
        }
    }, [open, data, dispatch]);

    async function handleSensorChange(id: string) {
        const selected = sensorItems.find(sensor => sensor.id == id);
        if (selected) {
            setForm({ ...form, sensor: { id: selected.id, sensorUid: selected.sensorUid, model: selected.model } });
        } else {
            setForm({ ...form, sensor: null });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: "bold" }}>Update Monitoring Point</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <TextField label="Point Name*" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <TextField value={form.machineId || ""} onChange={e => setForm({ ...form, machineId: e.target.value })} select label="Machine*">
                        {items?.map((item: MachineState) => (
                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                        ))}
                    </TextField>
                    <TextField label="Sensor Model" select value={form.sensor?.id || ""} onChange={e => handleSensorChange(e.target.value)}>
                        <MenuItem value="">No Sensor</MenuItem>
                        {sensorIsLoading == false && sensorItems?.map((item, i) => {
                            if (item.monitoringPointId == null || item.id == data.sensor?.id) {
                                return (
                                    <MenuItem key={item.id} value={item.id}>{item.sensorUid} - {translateSensorModelName(item.model)}</MenuItem>
                                );
                            }
                            return null;
                        })}
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button fullWidth variant="outlined" onClick={onClose}>Cancel</Button>
                <Button fullWidth variant="contained" disabled={!form.name || !form.machineId} onClick={() => sensorService.handleUpdateSensor(data.sensor ? data.sensor.id : "", form, dispatch).then(() => { onSucess(), fetchData() })}>Update Point</Button>
            </DialogActions>
        </Dialog>
    );
}