"use client";

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, TextField } from "@mui/material";
import { CreateModalProps } from "../types/modal";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { MachineService } from "../api/machine";
import { setLoading, setMachines } from "../redux/slices/machineSlice";
import { MachineState } from "../types/machine";
import { MonitoringPoint } from "../api/monitoringPoint";

export default function CreatePointModal({ open, onClose, onSucess }: CreateModalProps) {
    const [form, setForm] = useState({ name: "", machineId: "" });
    const { items, isLoading } = useAppSelector(state => state.machine);
    const dispatch = useAppDispatch();
    const machineService = new MachineService();
    const monitoringService = new MonitoringPoint();

    useEffect(() => {
        if(open) {
            setForm({name: "", machineId: ""});
        }
        async function fetchData() {
            dispatch(setLoading(true));
            const machines = await machineService.getManyMachines();
            dispatch(setMachines({ items: machines, isLoading: false }));
        }
        fetchData();
    }, [dispatch, open]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle sx={{ fontWeight: "bold" }}>New Monitoring Point</DialogTitle>
            <DialogContent dividers>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <TextField label="Point Name*" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    <TextField value={form.machineId || ""} onChange={e => setForm({ ...form, machineId: e.target.value })} select label="Machine*">
                        {isLoading && <MenuItem disabled>Loading Machines...</MenuItem>}
                        {isLoading == false && items && items.length > 0 ? items.map((item: MachineState) => (
                            <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                        )) : <MenuItem disabled>No Machines Found...</MenuItem>}
                    </TextField>
                </Box>
            </DialogContent>
            <DialogActions sx={{ display: "flex", p: 3 }}>
                <Button fullWidth variant="outlined" onClick={() => onClose()}>Cancel</Button>
                <Button fullWidth variant="contained" disabled={form.name == "" || form.machineId == ""} onClick={() => monitoringService.createMonitoringPoint(form, dispatch).then(() => onSucess())}>Create Point</Button>
            </DialogActions>
        </Dialog>
    );
}