"use client";

import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { setLoading, setMonitoringPoints } from "../redux/slices/monitoringSlice";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { MonitoringPoint } from "../api/monitoringPoint";
import { translateSensorModelName, trasnlateMachineType } from "../api/translate";
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import CreatePointModal from "./CreatePointModal";
import { MonitoringPointType } from "../types/monitoring";
import DeletePointModal from "./DeletePointModal";
import GlobalSnackBar from "./GlobalSnackBar";
import UpdatePointModal from "./UpdatePointModal";
import { SensorModel } from "../types/enum";
import { UpdateSensorForm } from "../types/sensor";
import { setSelectedSensorId } from "../redux/slices/sensorSlice";

export function TablePoints() {
    const dispatch = useAppDispatch();
    const { items, total } = useAppSelector(state => state.monitoringPoint);
    const { selectedSensorId } = useAppSelector(state => state.sensor);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [updatePointInfo, setUpdatePointInfo] = useState<UpdateSensorForm>({ monitoringPointId: "", name: "", machineId: "", sensor: { id: "", sensorUid: "", model: "None" } });
    const [pointInfo, setPointInfo] = useState({ id: "", name: "" });
    const rowsPerPage = 5;

    async function fetchData() {
        dispatch(setLoading(true));
        const api = new MonitoringPoint();
        const response = await api.getAllMonitoringPoints(page + 1, search);

        dispatch(setMonitoringPoints({
            items: response.items,
            total: response.total
        }));
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchData();
        }, 500);
        return () => clearTimeout(timeout);
    }, [dispatch, page, search]);

    return (
        <TableContainer component={Paper}>
            <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                <Typography variant="h6" component="div" fontWeight="bold" color="primary">
                    Monitoring Points
                </Typography>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <TextField value={search} onChange={e => { setSearch(e.target.value), setPage(0) }} size="small" placeholder="Search for Machine or Point" InputProps={{ startAdornment: <SearchIcon /> }} />
                    <Button variant="contained" sx={{ mr: 2 }} onClick={() => setOpen(true)}>Create Point</Button>
                </Box>
            </Box>
            <Table>
                <TableHead >
                    <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Machine Name</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Machine Type</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Monitoring Point</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Sensor Model</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {items.map((row: MonitoringPointType) => (
                        <TableRow key={row.id} sx={{ fontWeight: "light", cursor: row.sensor ? "pointer" : "default", backgroundColor: selectedSensorId == row.sensor?.id ? "#e3f2fd": "inherit", transition: 0.2 }} onClick={() => row.sensor ? dispatch(setSelectedSensorId(row.sensor.id)) : ""}>
                            <TableCell>{row.machine.name}</TableCell>
                            <TableCell>{trasnlateMachineType(row.machine.type)}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.sensor ? translateSensorModelName(row.sensor.model) : "None"}</TableCell>
                            <TableCell><EditIcon sx={{ cursor: "pointer" }} onClick={() => { setUpdateModalOpen(true), setUpdatePointInfo({ monitoringPointId: row.id, name: row.name, machineId: row.machineId, sensor: row.sensor || null }) }} /><DeleteIcon sx={{ cursor: "pointer" }} onClick={() => { setDeleteModalOpen(true), setPointInfo({ id: row.id, name: row.name }) }} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination rowsPerPageOptions={[5]} component={"div"} count={total} rowsPerPage={rowsPerPage} page={page} onPageChange={(e, newPage) => setPage(newPage)} />
            <CreatePointModal open={open} onClose={() => setOpen(false)} onSucess={() => { setOpen(false), fetchData() }} />
            <UpdatePointModal open={updateModalOpen} onClose={() => setUpdateModalOpen(false)} onSucess={() => { setUpdateModalOpen(false), fetchData() }} data={updatePointInfo} />
            <DeletePointModal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onSucess={() => { setDeleteModalOpen(false), fetchData() }} pointInfo={pointInfo} />
            <GlobalSnackBar />
        </TableContainer>
    );
}